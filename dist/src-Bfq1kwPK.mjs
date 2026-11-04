import { IdleJs } from "idle-js";
import { getCurrentInstance, onScopeDispose, readonly, ref, watch } from "vue";
// src/useIdle.ts
const INJECTION_KEY = Symbol("idleVue");
let shared = null;
function toValue(v) {
	return v?.value ?? v;
}
function useIdle(options = {}) {
	if (shared && getCurrentInstance()) return shared;
	if (shared && Object.keys(options).length === 0) return shared;
	const { idleTime = 6e4, events, keepTracking = true, startAtIdle = false, syncTabs = false, channelName = "idle-vue", paused = false } = options;
	const isIdle = ref(Boolean(startAtIdle));
	const lastActive = ref(Date.now());
	const pausedRef = typeof paused === "boolean" ? ref(paused) : paused;
	const idleTimeRef = typeof idleTime === "number" ? ref(idleTime) : idleTime;
	let channel = null;
	const onRemote = (e) => {
		if (e.data?.type === "idle-vue:active") {
			lastActive.value = e.data.at;
			if (isIdle.value) isIdle.value = false;
			instance.rearmRemote?.();
		}
	};
	const instance = new IdleJs({
		idle: toValue(idleTimeRef),
		...events ? { events } : {},
		keepTracking,
		startAtIdle,
		onIdle: () => {
			isIdle.value = true;
		},
		onActive: () => {
			isIdle.value = false;
			lastActive.value = Date.now();
		}
	});
	instance.activityHandler;
	const api = {
		isIdle,
		isIdleReadonly: readonly(isIdle),
		lastActive: readonly(lastActive),
		start: () => instance.start(),
		stop: () => instance.stop(),
		reset: (toIdle = false) => {
			instance.reset({ idle: toIdle });
			if (toIdle) isIdle.value = true;
			else {
				isIdle.value = false;
				lastActive.value = Date.now();
			}
			if (!toIdle && instance.started) instance.stop().start();
		},
		setIdleTime: (ms) => {
			idleTimeRef.value = ms;
		}
	};
	instance.rearmRemote = () => {
		instance.stop();
		instance.start();
	};
	watch(idleTimeRef, (ms) => instance.set({ idle: ms }));
	watch(pausedRef, (p) => {
		if (p) instance.stop();
		else instance.start();
	}, { immediate: false });
	if (syncTabs && typeof BroadcastChannel !== "undefined") {
		channel = new BroadcastChannel(channelName);
		channel.addEventListener("message", onRemote);
		watch(lastActive, (at) => {
			channel?.postMessage({
				type: "idle-vue:active",
				at
			});
		});
	}
	const prevOnActive = instance.settings.onActive;
	instance.settings.onActive = () => {
		lastActive.value = Date.now();
		prevOnActive?.();
		if (channel) channel.postMessage({
			type: "idle-vue:active",
			at: lastActive.value
		});
	};
	const prevOnIdle = instance.settings.onIdle;
	instance.settings.onIdle = () => {
		prevOnIdle?.();
	};
	if (typeof window !== "undefined" && !toValue(pausedRef)) instance.start();
	if (getCurrentInstance()) onScopeDispose(() => {
		instance.stop();
		channel?.close();
		if (shared === api) shared = null;
	});
	if (!shared && Object.keys(options).length !== 0) {}
	return api;
}
function setSharedIdle(api) {
	shared = api;
}
function getSharedIdle() {
	return shared;
}
const IdleVue = { install(app, options = {}) {
	const { compat = true, ...idleOptions } = options;
	const api = useIdle(idleOptions);
	setSharedIdle(api);
	app.provide(INJECTION_KEY, api);
	if (compat) app.mixin({
		computed: { isAppIdle() {
			return api.isIdle.value;
		} },
		created() {
			const onIdle = this.$options.onIdle;
			const onActive = this.$options.onActive;
			if (typeof onIdle === "function") watch(api.isIdle, (v) => v && onIdle.call(this), { flush: "sync" });
			if (typeof onActive === "function") watch(api.isIdle, (v) => !v && onActive.call(this), { flush: "sync" });
		}
	});
} };
function useSharedIdle() {
	const injected = getSharedIdle();
	if (injected) return injected;
	return useIdle();
}
export { useIdle as a, setSharedIdle as i, IdleVue as n, useSharedIdle as o, getSharedIdle as r, INJECTION_KEY as t };

//# sourceMappingURL=src-Bfq1kwPK.mjs.map