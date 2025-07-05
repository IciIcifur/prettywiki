<script setup lang="ts">
  import { computed, onMounted, ref, watch } from 'vue';
  import { GetMaterialsOfTheDay } from '../../api/contentAPI.ts';
  import { useI18n } from 'vue-i18n';
  import type { MaterialsOfTheDay } from '../../types/types.ts';

  const WIDE_SYMBOL_COUNT = 1200;

  const i18n = useI18n();
  const content = ref<MaterialsOfTheDay | null>(null);

  const isLoading = ref<boolean>(false);

  async function loadData() {
    isLoading.value = true;

    const response = await GetMaterialsOfTheDay(i18n.locale.value);
    if (response) content.value = response;
    else content.value = null;

    isLoading.value = false;

    console.log(response);
  }

  onMounted(loadData);

  watch(i18n.locale, async () => {
    await loadData();
  });

  const isWide = computed(() => {
    let featuredWide = false;
    let goodWide = false;
    if (!isLoading.value && content.value) {
      const { featuredArticle, goodArticle } = content.value;

      if (featuredArticle && featuredArticle.summary.length > WIDE_SYMBOL_COUNT)
        featuredWide = true;
      if (goodArticle && goodArticle.summary.length > WIDE_SYMBOL_COUNT)
        goodWide = true;
    }

    return { featured: featuredWide, good: goodWide };
  });
</script>

<template>
  <div class="grid w-full grid-cols-1 gap-4 lg:grid-cols-5">
    <ArticleMiniature
      v-if="isLoading || content?.featuredPicture"
      :article="content?.featuredPicture"
      :col-span="isWide.featured ? 5 : 2"
      :is-loading="isLoading"
      article-type="image"
    />

    <ArticleMiniature
      v-if="isLoading || content?.featuredArticle"
      :article="content?.featuredArticle"
      :col-span="isWide.featured ? 5 : 3"
      :is-loading="isLoading"
      article-type="featured"
    />

    <ArticleMiniature
      v-if="isLoading || content?.goodArticle"
      :article="content?.goodArticle"
      :col-span="isWide.good ? 5 : 3"
      :is-loading="isLoading"
      article-type="good"
    />
    <ArticleMiniature
      v-if="isLoading || content?.facts"
      :article="content?.facts"
      :col-span="isWide.good ? 5 : 2"
      :is-loading="isLoading"
      article-type="facts"
    />
  </div>
</template>
