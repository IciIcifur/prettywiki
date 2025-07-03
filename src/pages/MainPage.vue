<script setup lang="ts">
  import { useI18n } from 'vue-i18n';
  import Search from '../components/mainPage/Search.vue';

  const { t } = useI18n();
</script>

<template>
  <div class="flex w-full flex-col">
    <div class="flex w-full flex-col justify-center py-8">
      <h1>{{ t('main.greeting.title') }}</h1>
      <p>{{ t('main.greeting.description') }}</p>
    </div>
    <Search />
  </div>
</template>
