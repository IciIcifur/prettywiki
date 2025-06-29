import "./style.css";
import { createApp } from "vue";
import App from "./App.vue";
import { createRouter, createWebHistory } from "vue-router";
import ui from "@nuxt/ui/vue-plugin";
import MainPage from "./pages/MainPage.vue";

const app = createApp(App);
const routes = [{ path: "/", component: MainPage }];

const router = createRouter({
  routes,
  history: createWebHistory(),
});

app.use(router);
app.use(ui);

app.mount("#app");
