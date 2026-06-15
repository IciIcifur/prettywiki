<script setup lang="ts">
  import type { PictureItem } from '../../types/types.ts';
  import StyledImage from '../StyledImage.vue';
  import { computed, onMounted, ref } from 'vue';
  import { GetMediaByTitle } from '../../api/contentAPI.ts';

  const props = defineProps<{ item: PictureItem }>();

  const betterUrl = ref<string | null>(null);

  const imageTitle = computed(() => {
    try {
      const src = props.item.src;
      if (!src.includes('wikimedia.org') && !src.includes('wikipedia.org')) {
        return null;
      }

      const decodedUrl = decodeURIComponent(src);
      const parts = decodedUrl.split('/');

      const lastPart = parts.pop();
      if (!lastPart) return null;

      let filename = lastPart;

      if (decodedUrl.includes('/thumb/')) {
        const originalName = parts.pop();
        if (originalName) {
          filename = originalName;
        }
      }

      return `File:${filename.replace(/ /g, '_')}`;
    } catch (e) {
      console.error('Failed to get filename', e);
      return null;
    }
  });

  const floatStyle = ref();

  onMounted(async () => {
    floatStyle.value =
      Math.random() > 0.5 ? 'sm:float-left mr-6' : 'sm:float-right ml-6';
    if (!imageTitle.value) return;
    const result = await GetMediaByTitle(imageTitle.value, 'en');
    if (result) betterUrl.value = result.url;
  });
</script>

<template>
  <UCard
    :class="floatStyle"
    :ui="{
      body: 'flex flex-col gap-2 justify-center p-3',
    }"
    class="my-3 w-full items-center sm:max-w-sm md:max-w-md"
    variant="soft"
  >
    <StyledImage
      :alt="item.caption || ''"
      :full-width="true"
      :src="betterUrl || item.src"
    />
    <ArticleText
      v-if="item.caption"
      no-styling
      :item="{ id: '', type: 'text', text: item.caption }"
      class="w-full text-sm text-wrap break-words text-neutral-500 italic"
    />
  </UCard>
</template>
