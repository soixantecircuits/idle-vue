import { IdleEventName } from "idle-js";
import { App, InjectionKey, Ref } from "vue";
interface UseIdleOptions {
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
interface UseIdleReturn {
  isIdle: Ref<boolean>;
  readonly isIdleReadonly: Ref<boolean>;
  lastActive: Ref<number>;
  start: () => void;
  stop: () => void;
  reset: (toIdle?: boolean) => void;
  setIdleTime: (ms: number) => void;
}
declare const INJECTION_KEY: InjectionKey<UseIdleReturn>;
declare function useIdle(options?: UseIdleOptions): UseIdleReturn;
declare function setSharedIdle(api: UseIdleReturn): void;
declare function getSharedIdle(): UseIdleReturn | null;
interface IdlePluginOptions extends UseIdleOptions {
  /** Provide Options-API compat: onIdle/onActive options + isAppIdle computed. Default true. */
  compat?: boolean;
}
declare const IdleVue: {
  install(app: App, options?: IdlePluginOptions): void;
};
declare function useSharedIdle(): UseIdleReturn;
export { UseIdleOptions as a, setSharedIdle as c, IdleVue as i, useIdle as l, IdleEventName as n, UseIdleReturn as o, IdlePluginOptions as r, getSharedIdle as s, INJECTION_KEY as t, useSharedIdle as u };
//# sourceMappingURL=useIdle-BBxrgb63.d.mts.map