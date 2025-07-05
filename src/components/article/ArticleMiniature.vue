<script setup lang="ts">
  import type { ArticleSummary, Picture } from '../../types/types.ts';
  import ArticleSkeleton from './ArticleSkeleton.vue';

  defineProps<{
    article: ArticleSummary | Picture | string[] | null | undefined;
    articleType: 'featured' | 'good' | 'image' | 'facts';
    colSpan: 2 | 3 | 5;
    isLoading: boolean;
  }>();
</script>

<template>
  <UCard
    :class="`lg:col-span-${colSpan}`"
    :ui="{
      body: 'flex w-full h-fit flex-col gap-2 justify-center ',
    }"
    class="col-span-full h-fit"
    variant="soft"
  >
    <ArticleMiniatureType :article-type="articleType" />

    <template v-if="!isLoading && article">
      <ListArticleContent v-if="Array.isArray(article)" :article="article" />
      <template v-else>
        <div class="flex w-full flex-col gap-0">
          <h4 class="line-clamp-1">
            {{ article.title }}
          </h4>
          <p class="line-clamp-1 flex w-full text-sm text-neutral-500 italic">
            {{ article.description }}
          </p>
        </div>

        <ImageArticleContent v-if="'src' in article" :article="article" />
        <DefaultArticleContent v-else :article="article" />
      </template>
    </template>

    <ArticleSkeleton v-else :article-type="articleType" />
  </UCard>
</template>
