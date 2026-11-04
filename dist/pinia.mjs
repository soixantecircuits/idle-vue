import { o as useSharedIdle } from "./src-Bfq1kwPK.mjs";
import { defineStore } from "pinia";
// src/pinia.ts
/**
* Optional Pinia store. The package core never imports pinia;
* only this subpath (`idle-vue/pinia`) does.
*/
const useIdleStore = defineStore("idleVue", {
	state: () => ({
		isIdle: false,
		lastActive: Date.now()
	}),
	actions: {
		bind() {
			const api = useSharedIdle();
			this.isIdle = api.isIdle.value;
			this.lastActive = api.lastActive.value;
			return api;
		},
		setIdle(v) {
			this.isIdle = v;
		}
	}
});
export { useIdleStore };

//# sourceMappingURL=pinia.mjs.map