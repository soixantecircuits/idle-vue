let idle_js = require("idle-js");
let vue = require("vue");
// src/useIdle.ts
const INJECTION_KEY = Symbol("idleVue");
let shared = null;
function toValue(v) {
	return v?.value ?? v;
}
function useIdle(options = {}) {
	if (shared && (0, vue.getCurrentInstance)()) return shared;
	if (shared && Object.keys(options).length === 0) return shared;
	const { idleTime = 6e4, events, keepTracking = true, startAtIdle = false, syncTabs = false, channelName = "idle-vue", paused = false } = options;
	const isIdle = (0, vue.ref)(Boolean(startAtIdle));
	const lastActive = (0, vue.ref)(Date.now());
	const pausedRef = typeof paused === "boolean" ? (0, vue.ref)(paused) : paused;
	const idleTimeRef = typeof idleTime === "number" ? (0, vue.ref)(idleTime) : idleTime;
	let channel = null;
	const onRemote = (e) => {
		if (e.data?.type === "idle-vue:active") {
			lastActive.value = e.data.at;
			if (isIdle.value) isIdle.value = false;
			instance.rearmRemote?.();
		}
	};
	const instance = new idle_js.IdleJs({
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
		isIdleReadonly: (0, vue.readonly)(isIdle),
		lastActive: (0, vue.readonly)(lastActive),
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
	(0, vue.watch)(idleTimeRef, (ms) => instance.set({ idle: ms }));
	(0, vue.watch)(pausedRef, (p) => {
		if (p) instance.stop();
		else instance.start();
	}, { immediate: false });
	if (syncTabs && typeof BroadcastChannel !== "undefined") {
		channel = new BroadcastChannel(channelName);
		channel.addEventListener("message", onRemote);
		(0, vue.watch)(lastActive, (at) => {
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
	if ((0, vue.getCurrentInstance)()) (0, vue.onScopeDispose)(() => {
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
			if (typeof onIdle === "function") (0, vue.watch)(api.isIdle, (v) => v && onIdle.call(this), { flush: "sync" });
			if (typeof onActive === "function") (0, vue.watch)(api.isIdle, (v) => !v && onActive.call(this), { flush: "sync" });
		}
	});
} };
function useSharedIdle() {
	const injected = getSharedIdle();
	if (injected) return injected;
	return useIdle();
}
Object.defineProperty(exports, "INJECTION_KEY", {
	enumerable: true,
	get: function() {
		return INJECTION_KEY;
	}
});
Object.defineProperty(exports, "IdleVue", {
	enumerable: true,
	get: function() {
		return IdleVue;
	}
});
Object.defineProperty(exports, "getSharedIdle", {
	enumerable: true,
	get: function() {
		return getSharedIdle;
	}
});
Object.defineProperty(exports, "setSharedIdle", {
	enumerable: true,
	get: function() {
		return setSharedIdle;
	}
});
Object.defineProperty(exports, "useIdle", {
	enumerable: true,
	get: function() {
		return useIdle;
	}
});
Object.defineProperty(exports, "useSharedIdle", {
	enumerable: true,
	get: function() {
		return useSharedIdle;
	}
});

//# sourceMappingURL=src-BzL_LAY0.cjs.map