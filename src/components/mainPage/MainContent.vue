<script setup lang="ts">
  import { computed } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { storeToRefs } from 'pinia';
  import { useMainPageStore } from '../../stores/mainPageStore.ts';

  const WIDE_SYMBOL_COUNT = 1600;

  const { locale } = useI18n();
  const { featured } = storeToRefs(useMainPageStore());

  const content = computed(() => featured.value[locale.value].data);
  const loading = computed(() => featured.value[locale.value].isLoading);

  const isWide = computed(() => {
    let featuredWide = false;
    let goodWide = false;
    if (!loading.value && content.value) {
      const { tfa: featuredArticle, tga: goodArticle } = content.value;

      if (featuredArticle && featuredArticle.summary.length > WIDE_SYMBOL_COUNT)
        featuredWide = true;
      if (goodArticle && goodArticle.summary.length > WIDE_SYMBOL_COUNT)
        goodWide = true;
    }

    return { featured: featuredWide, good: goodWide };
  });
</script>

<template>
  <div class="grid w-full grid-flow-dense grid-cols-1 gap-4 lg:grid-cols-5">
    <ArticleMiniature
      v-if="loading || content?.tfi"
      :article="content?.tfi"
      :col-span="isWide.featured ? 5 : 2"
      :is-loading="loading"
      article-type="image"
    />
    <ArticleMiniature
      v-if="loading || content?.tfa"
      :article="content?.tfa"
      :col-span="isWide.featured ? 5 : 3"
      :is-loading="loading"
      article-type="featured"
    />
    <ArticleMiniature
      v-if="loading || content?.tga"
      :article="content?.tga"
      :col-span="isWide.good ? 5 : 3"
      :is-loading="loading"
      article-type="good"
    />
    <ArticleMiniature
      v-if="loading || content?.dyk"
      :article="content?.dyk"
      :col-span="isWide.good ? 5 : 2"
      :is-loading="loading"
      article-type="facts"
    />
  </div>
</template>
