<script setup lang="ts">
  import { useRoute } from 'vue-router';
  import { computed, onMounted, watch } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { storeToRefs } from 'pinia';
  import { useWikiStore } from '../stores/wikiStore.ts';

  const route = useRoute();
  const { locale } = useI18n();

  const title = computed(() => route.params.title.toString());
  const normalizedTitle = computed(() => title.value.replaceAll('_', ' '));

  const { loadPage } = useWikiStore();
  const { activePage } = storeToRefs(useWikiStore());

  watch([title, locale], async () => await loadPage(title.value), {
    flush: 'post',
  });
  onMounted(async () => await loadPage(title.value));
</script>

<template>
  <div class="flex w-full flex-col gap-8">
    <h1 class="w-full text-neutral-800 italic dark:text-neutral-200">
      {{ normalizedTitle }}
    </h1>

    <p class="overflow-clip text-wrap">{{ activePage?.loadTimestamp }}</p>
  </div>
</template>
