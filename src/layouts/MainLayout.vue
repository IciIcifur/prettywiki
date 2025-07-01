<script setup lang="ts">
  import { onMounted } from 'vue';
  import { useUserStore } from '../stores/userStore.ts';
  import { useI18n } from 'vue-i18n';
  import { GetLocaleFromCookie } from '../utils/session.ts';

  onMounted(async () => {
    const userStore = useUserStore();
    const i18n = useI18n();

    await userStore.restoreUser();
    const restoredLocale = GetLocaleFromCookie();
    if (restoredLocale) i18n.locale.value = restoredLocale;
  });
</script>

<template>
  <div class="flex min-h-screen w-full flex-col">
    <HeaderMenu />
    <div class="flex h-full w-full flex-1 px-8 py-4">
      <router-view />
    </div>
    <FooterMenu />
  </div>
</template>
