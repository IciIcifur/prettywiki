<script setup lang="ts">
  import LoginSign from './LoginSign.vue';
  import ToggleColorScheme from './ToggleColorScheme.vue';
  import { useI18n } from 'vue-i18n';

  const { t } = useI18n();

  const menuItems = [{ slot: 'locale' }, { slot: 'user' }, { slot: 'scheme' }];
</script>

<template>
  <header
    class="sticky top-0 z-30 flex h-fit w-full items-center justify-between gap-4 border-b border-neutral-200 bg-white/40 px-8 py-2 backdrop-blur-xl dark:border-neutral-800 dark:bg-neutral-900/60"
  >
    <div class="flex h-fit flex-col items-start justify-center">
      <ULink
        to="/"
        class="font-cormorant text-4xl font-black text-indigo-500 transition-colors hover:text-indigo-600 dark:text-indigo-400 dark:hover:text-indigo-500"
      >
        <p>
          {{ t('header.title') }}
        </p>
      </ULink>
      <p class="text-xs italic">
        {{ t('header.subtitle') }}
      </p>
    </div>
    <div class="hidden items-center gap-4 sm:flex">
      <LoginSign />
      <ToggleLocale />
      <ToggleColorScheme />
    </div>
    <UDropdownMenu
      :items="menuItems"
      :ui="{
        content: 'min-w-fit z-40 justify-center align-center',
      }"
      class="flex sm:hidden"
    >
      <UButton icon="i-lucide-menu" color="secondary" variant="soft" />

      <template #locale>
        <div class="flex h-full w-full items-center justify-center">
          <ToggleLocale />
        </div>
      </template>
      <template #user>
        <div class="flex h-full w-full items-center justify-center">
          <LoginSign />
        </div>
      </template>
      <template #scheme>
        <div class="flex h-full w-full items-center justify-center">
          <ToggleColorScheme />
        </div>
      </template>
    </UDropdownMenu>
  </header>
</template>
