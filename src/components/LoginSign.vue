<script setup lang="ts">
import { useUserStore } from '../stores/userStore.ts';

const userStore = useUserStore();
</script>

<template>
  <UButton
    v-if="!userStore.isAuthenticated"
    to="/login"
    icon="i-lucide-log-in"
    color="secondary"
    variant="soft"
  />
  <UButton
    v-else
    to="/login"
    :label="userStore.user.login"
    color="secondary"
    variant="link"
    icon="i-lucide-circle-user"
  />
</template>

<style scoped></style>
