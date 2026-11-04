import { o as UseIdleReturn } from "./useIdle-BBxrgb63.mjs";
/**
 * Optional Pinia store. The package core never imports pinia;
 * only this subpath (`idle-vue/pinia`) does.
 */
export declare const useIdleStore: import("pinia").StoreDefinition<"idleVue", {
  isIdle: boolean;
  lastActive: number;
}, {}, {
  bind(): UseIdleReturn;
  setIdle(v: boolean): void;
}>;
//# sourceMappingURL=pinia.d.mts.map