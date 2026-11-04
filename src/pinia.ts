import { defineStore } from "pinia";
import { useSharedIdle } from "./index.ts";

/**
 * Optional Pinia store. The package core never imports pinia;
 * only this subpath (`idle-vue/pinia`) does.
 */
export const useIdleStore = defineStore("idleVue", {
  state: () => ({
    isIdle: false as boolean,
    lastActive: Date.now() as number,
  }),
  actions: {
    bind() {
      const api = useSharedIdle();
      this.isIdle = api.isIdle.value;
      this.lastActive = api.lastActive.value;
      return api;
    },
    setIdle(v: boolean) {
      this.isIdle = v;
    },
  },
});
