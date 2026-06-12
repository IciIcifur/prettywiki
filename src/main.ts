import './style.css';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import { createRouter, createWebHistory } from 'vue-router';
import ui from '@nuxt/ui/vue-plugin';
import MainPage from './pages/MainPage.vue';
import LoginPage from './pages/LoginPage.vue';
import MainLayout from './layouts/MainLayout.vue';
import { createI18n } from 'vue-i18n';
import customEn from './assets/dictionaries/en.json';
import customRu from './assets/dictionaries/ru.json';
import WikiPage from './pages/WikiPage.vue';

const app = createApp(App);
const routes = [
  {
    path: '/',
    component: MainLayout,
    children: [
      { path: '', name: 'Главная', component: MainPage },
      { path: 'login', name: 'Вход', component: LoginPage },
      { path: 'wiki/:title', name: 'Wiki', component: WikiPage },
    ],
  },
];
const i18n = createI18n({
  legacy: false,
  locale: 'en',
  availableLocales: ['en', 'ru'],
  messages: {
    en: customEn,
    ru: customRu,
  },
});

const router = createRouter({
  routes,
  history: createWebHistory(),
});
const pinia = createPinia();

app.use(pinia);
app.use(router);
app.use(i18n);
app.use(ui);

app.mount('#app');
