import { beforeEach, describe, expect, test, vi } from "vite-plus/test";
import { createApp, ref } from "vue";
import { IdleVue, useIdle } from "../src/index.ts";

describe("useIdle (node-safe, no window)", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  test("returns refs with defaults", () => {
    const api = useIdle({ idleTime: ref(1000) });
    expect(api.isIdle.value).toBe(false);
    expect(typeof api.lastActive.value).toBe("number");
    expect(typeof api.start).toBe("function");
    expect(typeof api.stop).toBe("function");
    api.stop();
    vi.useRealTimers();
  });

  test("reset() toggles state", () => {
    const api = useIdle({ idleTime: 1000 });
    api.reset(true);
    expect(api.isIdle.value).toBe(true);
    api.reset(false);
    expect(api.isIdle.value).toBe(false);
    api.stop();
  });

  test("setIdleTime() updates without throwing", () => {
    const api = useIdle({ idleTime: 1000 });
    api.setIdleTime(500);
    api.stop();
  });

  test("plugin installs and provides compat", () => {
    const app = createApp({ template: "<div/>" });
    expect(() => app.use(IdleVue, { idleTime: 1000 })).not.toThrow();
  });
});
