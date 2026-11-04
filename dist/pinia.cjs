Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const require_src = require("./src-BzL_LAY0.cjs");
// src/pinia.ts
/**
* Optional Pinia store. The package core never imports pinia;
* only this subpath (`idle-vue/pinia`) does.
*/
const useIdleStore = (0, require("pinia").defineStore)("idleVue", {
	state: () => ({
		isIdle: false,
		lastActive: Date.now()
	}),
	actions: {
		bind() {
			const api = require_src.useSharedIdle();
			this.isIdle = api.isIdle.value;
			this.lastActive = api.lastActive.value;
			return api;
		},
		setIdle(v) {
			this.isIdle = v;
		}
	}
});
exports.useIdleStore = useIdleStore;

//# sourceMappingURL=pinia.cjs.map