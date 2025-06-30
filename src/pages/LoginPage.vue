<script setup lang="ts">
import { useUserStore } from '../stores/userStore.ts';

const { user, isAuthenticated, logout } = useUserStore();
</script>

<template>
  <div class="flex w-full items-center justify-center">
    <UCard v-if="isAuthenticated" variant="soft" class="max-w-md">
      <template #header>
        <h4 class="h-8 w-full">Вы уже вошли в систему!</h4>
      </template>

      <p>
        Вы уже выполнили вход в систему под никнеймом
        <span class="text-indigo-500 dark:text-indigo-400">{{
          user?.nickname
        }}</span
        >. Хотите выйти из аккаунта?
      </p>

      <template #footer>
        <div class="flex h-8 justify-between gap-4">
          <UButton
            @click="logout"
            label="Выйти"
            size="lg"
            variant="ghost"
            color="error"
          />
          <UButton to="/" label="На главную" variant="link" size="lg" />
        </div>
      </template>
    </UCard>
    <div v-else>Вы не вошли в систему</div>
  </div>
</template>
