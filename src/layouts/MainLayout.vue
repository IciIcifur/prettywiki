<script setup lang="ts">
import { onMounted } from 'vue';
import { useUserStore } from '../stores/userStore.ts';

onMounted(async () => {
  const userStore = useUserStore();
  await userStore.restoreUser();
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