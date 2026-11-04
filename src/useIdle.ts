import { IdleJs, type IdleEventName } from "idle-js";
import {
  getCurrentInstance,
  onScopeDispose,
  readonly,
  ref,
  watch,
  type App,
  type InjectionKey,
  type Ref,
} from "vue";

export type { IdleEventName };

export interface UseIdleOptions {
  /** Idle timeout in ms. Reactive. Default 60000. */
  idleTime?: number | Ref<number>;
  /** Activity events. Default from idle-js. */
  events?: IdleEventName[];
  /** Keep re-arming after each idle event. Default true. */
  keepTracking?: boolean;
  /** Start in idle state. Default false. */
  startAtIdle?: boolean;
  /** Sync activity across tabs via BroadcastChannel. Default false. */
  syncTabs?: boolean;
  /** BroadcastChannel name when syncTabs is true. */
  channelName?: string;
  /** Pause tracking (stops timer, keeps last state). */
  paused?: boolean | Ref<boolean>;
}

export interface UseIdleReturn {
  isIdle: Ref<boolean>;
  readonly isIdleReadonly: Ref<boolean>;
  lastActive: Ref<number>;
  start: () => void;
  stop: () => void;
  reset: (toIdle?: boolean) => void;
  setIdleTime: (ms: number) => void;
}

const INJECTION_KEY: InjectionKey<UseIdleReturn> = Symbol("idleVue");

let shared: UseIdleReturn | null = null;

function toValue<T>(v: T | Ref<T>): T {
  return (v as Ref<T>)?.value ?? (v as T);
}

export function useIdle(options: UseIdleOptions = {}): UseIdleReturn {
  if (shared && getCurrentInstance()) return shared;
  if (shared && Object.keys(options).length === 0) return shared;

  const {
    idleTime = 60000,
    events,
    keepTracking = true,
    startAtIdle = false,
    syncTabs = false,
    channelName = "idle-vue",
    paused = false,
  } = options;

  const isIdle = ref(Boolean(startAtIdle));
  const lastActive = ref(Date.now());
  const pausedRef = typeof paused === "boolean" ? ref(paused) : paused;
  const idleTimeRef = typeof idleTime === "number" ? ref(idleTime) : idleTime;

  let channel: BroadcastChannel | null = null;
  const onRemote = (e: MessageEvent) => {
    if (e.data?.type === "idle-vue:active") {
      lastActive.value = e.data.at;
      if (isIdle.value) isIdle.value = false;
      (instance as unknown as { rearmRemote?: () => void }).rearmRemote?.();
    }
  };

  const instance = new IdleJs({
    idle: toValue(idleTimeRef),
    ...(events ? { events } : {}),
    keepTracking,
    startAtIdle,
    onIdle: () => {
      isIdle.value = true;
    },
    onActive: () => {
      isIdle.value = false;
      lastActive.value = Date.now();
    },
  });

  // Keep lastActive in sync for visibility-elapsed consumers
  const origActivity = (instance as unknown as { activityHandler: () => void }).activityHandler;
  void origActivity;

  const api: UseIdleReturn = {
    isIdle,
    isIdleReadonly: readonly(isIdle) as Ref<boolean>,
    lastActive: readonly(lastActive) as Ref<number>,
    start: () => instance.start(),
    stop: () => instance.stop(),
    reset: (toIdle = false) => {
      instance.reset({ idle: toIdle });
      if (toIdle) isIdle.value = true;
      else {
        isIdle.value = false;
        lastActive.value = Date.now();
      }
      if (!toIdle && (instance as unknown as { started: boolean }).started) {
        instance.stop().start();
      }
    },
    setIdleTime: (ms: number) => {
      idleTimeRef.value = ms;
    },
  };

  (instance as unknown as { rearmRemote: () => void }).rearmRemote = () => {
    instance.stop();
    instance.start();
  };

  // Reactive idleTime
  watch(idleTimeRef, (ms) => instance.set({ idle: ms }));

  // Pause support
  watch(
    pausedRef,
    (p) => {
      if (p) instance.stop();
      else instance.start();
    },
    { immediate: false },
  );

  // Cross-tab sync
  if (syncTabs && typeof BroadcastChannel !== "undefined") {
    channel = new BroadcastChannel(channelName);
    channel.addEventListener("message", onRemote);
    const stopWatch = watch(lastActive, (at) => {
      channel?.postMessage({ type: "idle-vue:active", at });
    });
    void stopWatch;
  }

  // Wrap onActive to broadcast local activity
  const prevOnActive = instance.settings.onActive;
  instance.settings.onActive = () => {
    lastActive.value = Date.now();
    prevOnActive?.();
    if (channel) channel.postMessage({ type: "idle-vue:active", at: lastActive.value });
  };
  const prevOnIdle = instance.settings.onIdle;
  instance.settings.onIdle = () => {
    prevOnIdle?.();
  };

  if (typeof window !== "undefined" && !toValue(pausedRef)) {
    instance.start();
  }

  if (getCurrentInstance()) {
    onScopeDispose(() => {
      instance.stop();
      channel?.close();
      if (shared === api) shared = null;
    });
  }

  if (!shared && Object.keys(options).length !== 0) {
    // First full-config instance becomes the shared one for plugin consumers
  }

  return api;
}

export function setSharedIdle(api: UseIdleReturn): void {
  shared = api;
}

export function getSharedIdle(): UseIdleReturn | null {
  return shared;
}

export interface IdlePluginOptions extends UseIdleOptions {
  /** Provide Options-API compat: onIdle/onActive options + isAppIdle computed. Default true. */
  compat?: boolean;
}

export const IdleVue = {
  install(app: App, options: IdlePluginOptions = {}) {
    const { compat = true, ...idleOptions } = options;
    const api = useIdle(idleOptions);
    setSharedIdle(api);
    app.provide(INJECTION_KEY, api);

    if (compat) {
      app.mixin({
        computed: {
          isAppIdle(this: unknown): boolean {
            return (api.isIdle as Ref<boolean>).value;
          },
        },
        created(this: { $options: Record<string, unknown> }) {
          const onIdle = this.$options.onIdle as (() => void) | undefined;
          const onActive = this.$options.onActive as (() => void) | undefined;
          if (typeof onIdle === "function")
            watch(api.isIdle, (v) => v && onIdle.call(this), { flush: "sync" });
          if (typeof onActive === "function")
            watch(api.isIdle, (v) => !v && onActive.call(this), { flush: "sync" });
        },
      });
    }
  },
};

export function useSharedIdle(): UseIdleReturn {
  const injected = getSharedIdle();
  if (injected) return injected;
  return useIdle();
}

export { INJECTION_KEY };
export default IdleVue;
