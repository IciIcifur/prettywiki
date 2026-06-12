<script setup lang="ts">
  import StyledImage from '../StyledImage.vue';
  import type { ArticleSummary } from '../../types/types.ts';

  defineProps<{ article: ArticleSummary }>();
</script>

<template>
  <div class="h-full w-full space-y-1">
    <StyledImage
      v-if="article.image"
      :alt="article.title"
      :src="article.image"
      class="h-fit w-fit sm:float-left sm:mr-4 sm:mb-1"
    />
    <p
      :key="index"
      v-for="(paragraph, index) in article.summary.split('\n')"
      class="indent-6"
    >
      {{ paragraph }}
    </p>
  </div>
</template>
