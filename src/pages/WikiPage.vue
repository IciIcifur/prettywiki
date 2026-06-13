<script setup lang="ts">
  import { useRoute } from 'vue-router';
  import { computed, onMounted, ref, watch } from 'vue';
  import { GetPageByTitle } from '../api/contentAPI.ts';
  import { useI18n } from 'vue-i18n';

  const route = useRoute();
  const { locale } = useI18n();

  const title = computed(() => route.params.title.toString());
  const normalizedTitle = computed(() => title.value.replaceAll('_', ' '));
  const rawArticle = ref(null);
  const loading = ref(true);

  async function fetchArticle() {
    if (!title.value || !locale.value) return;
    loading.value = true;
    rawArticle.value = await GetPageByTitle(title.value, locale.value);
    console.log(rawArticle.value);
    loading.value = false;
  }

  watch([title, locale], fetchArticle, { flush: 'post' });
  onMounted(async () => await fetchArticle());
</script>

<template>
  <div class="flex w-full flex-col gap-8">
    <h1 class="w-full text-neutral-800 italic dark:text-neutral-200">
      {{ normalizedTitle }}
    </h1>

    <p class="overflow-clip text-wrap">text here</p>
  </div>
</template>
