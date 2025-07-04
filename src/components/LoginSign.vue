<script setup lang="ts">
  import { useUserStore } from '../stores/userStore.ts';

  const userStore = useUserStore();
</script>

<template>
  <UButton
    v-if="!userStore.isAuthenticated"
    color="secondary"
    icon="i-lucide-log-in"
    to="/login"
    variant="soft"
  />
  <template v-else>
    <UButton
      class="hidden sm:flex"
      color="secondary"
      icon="i-lucide-circle-user"
      :label="userStore.user?.login"
      to="/login"
      variant="link"
    />
    <UButton
      class="flex sm:hidden"
      color="secondary"
      icon="i-lucide-circle-user"
      to="/login"
      variant="soft"
    />
  </template>
</template>

<style scoped></style>
