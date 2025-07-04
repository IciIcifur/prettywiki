<script setup lang="ts">
  import { useI18n } from 'vue-i18n';
  import { SaveLocaleToCookie } from '../utils/session.ts';

  const localeStore = useI18n();
  function toggleLocale() {
    let newLocale = 'en';
    if (localeStore.locale.value === 'en') newLocale = 'ru';
    localeStore.locale.value = newLocale;
    SaveLocaleToCookie(newLocale);
  }
</script>

<template>
  <UButton
    color="secondary"
    :label="localeStore.locale.value.toUpperCase()"
    variant="soft"
    @click.stop="toggleLocale"
  />
</template>

<style scoped></style>
