import { createApp } from "vue";
import { IdleVue } from "../../src/index.ts";
import App from "./App.vue";

const app = createApp(App);
app.use(IdleVue, { idleTime: 3000 });
app.mount("#app");
