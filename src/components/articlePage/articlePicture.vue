<script setup lang="ts">
  import type { PictureItem } from '../../types/types.ts';
  import StyledImage from '../StyledImage.vue';

  defineProps<{ item: PictureItem }>();
</script>

<template>
  <UCard
    :ui="{
      body: 'flex w-fit h-fit flex-col gap-2 justify-center',
    }"
    class="float my-4 mr-4 ml-6 h-fit w-min items-center"
    variant="soft"
  >
    <StyledImage
      :alt="item.caption || ''"
      :full-width="true"
      class="h-fit w-fit min-w-fit"
      :src="item.src"
    />
    <ArticleText
      v-if="item.caption"
      no-styling
      class="w-full text-wrap text-neutral-500 italic"
      :item="{ id: '', type: 'text', text: item.caption }"
    />
  </UCard>
</template>
