<script setup lang="ts">
  import type { ArticleContentItem } from '../../types/types.ts';
  import useArticleItemComponent from '../../composables/useArticleItemComponent.ts';

  const props = defineProps<{ item: ArticleContentItem }>();

  const { ItemComponent } = useArticleItemComponent(props.item);
</script>

<template>
  <component :is="ItemComponent" :item="item" />
</template>
