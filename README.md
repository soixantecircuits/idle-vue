# idle-vue v3

Vue 3 idle detection. Store-free by default, optional Pinia. Powered by `idle-js@2`.

## Install

```sh
npm i idle-vue
# optional: npm i pinia
```

## Use

```ts
import { createApp } from "vue";
import { IdleVue } from "idle-vue";
import App from "./App.vue";

const app = createApp(App);
app.use(IdleVue, { idleTime: 60_000 });
app.mount("#app");
```

```vue
<script setup lang="ts">
import { useSharedIdle } from "idle-vue";
const { isIdle, lastActive, setIdleTime, start, stop, reset } = useSharedIdle();
</script>

<template>
  <div v-if="isIdle">You are idle</div>
</template>
```

Options-API compat (same as v2, now on Vue 3):

```ts
export default {
  onIdle() {
    /* ... */
  },
  onActive() {
    /* ... */
  },
  computed: {
    label() {
      return (this as unknown as { isAppIdle: boolean }).isAppIdle ? "zzz" : "hi";
    },
  },
};
```

Pinia (optional subpath, core never imports pinia):

```ts
import { useIdleStore } from "idle-vue/pinia";
```

## Multi-tab

```ts
app.use(IdleVue, { idleTime: 60_000, syncTabs: true });
```

## Migrate from v2

- `Vue.use` → `app.use`
- `eventEmitter` bus removed; use `useSharedIdle()` or `onIdle/onActive` options
- Vuex module removed; use `idle-vue/pinia` or read `isIdle` directly
- `startAtIdle` default is now `false`
- Idle overlay/Sprite PNG removed from the package; copy `examples/vue3-overlay/App.vue`

## Development

```sh
vp install
vp check
vp test
vp pack
vp dev
```
