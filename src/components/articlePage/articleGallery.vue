<script setup lang="ts">
  import type { GalleryItem } from '../../types/types.ts';

  defineProps<{ item: GalleryItem }>();
</script>

<template>
  <div class="columns-2 gap-2 py-2 sm:columns-3 md:columns-4">
    <ArticlePicture
      no-float
      v-for="picture in item.children"
      :key="picture.id"
      :item="picture"
      class="mt-0 mb-2 w-full! break-inside-avoid"
    />
  </div>
</template>
