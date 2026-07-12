<script setup lang="ts">
  import { useRoute } from 'vue-router';
  import { computed, onMounted, watch } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { storeToRefs } from 'pinia';
  import { useWikiStore } from '../stores/wikiStore.ts';
  import { useDebounceFn } from '@vueuse/core';
  import { useUserStore } from '../stores/userStore.ts';
  import ArticleItem from '../components/articlePage/articleItem.vue';

  const route = useRoute();
  const { locale } = useI18n();
  const { dataRestored } = storeToRefs(useUserStore());

  const title = computed(() => route.params.title.toString());
  const normalizedTitle = computed(() =>
    (title.value as any).replaceAll('_', ' ')
  );

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
  onMounted(() => {
    if (dataRestored.value) debouncedLoadPage(locale.value, title.value);
  });
</script>

<template>
  <div class="flex w-full flex-col gap-8 sm:px-6 md:px-16">
    <h1 class="w-full pl-6 text-neutral-800 italic dark:text-neutral-200">
      {{ normalizedTitle }}
    </h1>

    <div class="space-1 w-full overflow-x-clip">
      <ArticleItem
        :key="item.id"
        v-for="item in activePage?.contents"
        :id="item.id"
        :item="item"
      />
    </div>
  </div>
</template>
