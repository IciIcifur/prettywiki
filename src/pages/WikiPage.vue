<script setup lang="ts">
  import { useRoute } from 'vue-router';
  import { computed, watch } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { storeToRefs } from 'pinia';
  import { useWikiStore } from '../stores/wikiStore.ts';
  import { useDebounceFn } from '@vueuse/core';
  import { useUserStore } from '../stores/userStore.ts';

  const route = useRoute();
  const { locale } = useI18n();
  const { dataRestored } = storeToRefs(useUserStore());

  const title = computed(() => route.params.title.toString());
  const normalizedTitle = computed(() => title.value.replaceAll('_', ' '));

  const { loadPage } = useWikiStore();
  const { activePage } = storeToRefs(useWikiStore());

  const debouncedLoadPage = useDebounceFn(
    (_: string, t: string) => loadPage(t),
    128
  );

  watch(dataRestored, () => {
    if (dataRestored.value) debouncedLoadPage(locale.value, title.value);
  });
  watch([title, locale], () => {
    if (dataRestored.value) debouncedLoadPage(locale.value, title.value);
  });
</script>

<template>
  <div class="flex w-full flex-col gap-8">
    <h1 class="w-full text-neutral-800 italic dark:text-neutral-200">
      {{ normalizedTitle }}
    </h1>

    <p class="overflow-clip text-wrap">{{ activePage?.loadTimestamp }}</p>

    <div class="flex flex-col gap-4">
      <p :key="item.id" v-for="item in activePage?.contents">{{ item.type }}</p>
    </div>
  </div>
</template>
