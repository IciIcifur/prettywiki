<script setup lang="ts">
  import { useI18n } from 'vue-i18n';
  import Search from '../components/mainPage/Search.vue';

  const { t } = useI18n();
</script>

<template>
  <div class="flex w-full flex-col items-center gap-8 pt-8">
    <TimeLine />
    <div class="flex w-fit flex-col items-center">
      <div class="flex w-fit flex-col items-start justify-center py-8">
        <h1>{{ t('main.greeting.title') }}</h1>
        <p class="w-full sm:text-end">{{ t('main.greeting.description') }}</p>
      </div>
      <Search />
    </div>
  </div>
</template>
