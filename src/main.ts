import './style.css';
import { createApp } from 'vue';
import App from './App.vue';
import { createRouter, createWebHistory } from 'vue-router';
import ui from '@nuxt/ui/vue-plugin';
import MainPage from './pages/MainPage.vue';
import LoginPage from './pages/LoginPage.vue';
import MainLayout from './layouts/MainLayout.vue';

const app = createApp(App);
const routes = [
  {
    path: '/',
    component: MainLayout,
    children: [
      { path: '', name: 'Главная', component: MainPage },
      { path: 'login', name: 'Вход', component: LoginPage },
    ],
  },
];

const router = createRouter({
  routes,
  history: createWebHistory(),
});

app.use(router);
app.use(ui);

app.mount('#app');
