<template>
  <div class="demo">
    <h1>idle-vue v3 example</h1>
    <p>Idle after 3s of no mouse/key/touch. Move to wake.</p>
    <p>
      Status: <strong data-testid="status">{{ isIdle ? "Idle 😴" : "Active ⚡" }}</strong>
    </p>
    <p>Last active: {{ new Date(lastActive).toLocaleTimeString() }}</p>
    <label>Timeout (ms): <input v-model.number="ms" type="number" min="500" step="500" /></label>
    <button @click="setIdleTime(ms)">Apply</button>
    <button @click="stop()">Stop</button>
    <button @click="start()">Start</button>

    <!-- Example-only overlay: copy this into your app, it is NOT shipped -->
    <transition name="fade">
      <div v-if="isIdle" class="overlay" aria-live="polite">
        <div class="card">You are idle — touch to continue</div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useSharedIdle } from "../../src/index.ts";

const { isIdle, lastActive, setIdleTime, start, stop } = useSharedIdle();
const ms = ref(3000);
</script>

<style scoped>
.demo {
  font-family: system-ui, sans-serif;
  max-width: 640px;
  margin: 40px auto;
  padding: 0 16px;
}
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: grid;
  place-items: center;
}
.card {
  background: white;
  padding: 24px 32px;
  border-radius: 12px;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.8s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
