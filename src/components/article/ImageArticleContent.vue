<script setup lang="ts">
  import StyledImage from '../StyledImage.vue';
  import type { Picture } from '../../types/types.ts';
  import { computed } from 'vue';
  import { useI18n } from 'vue-i18n';

  const props = defineProps<{ article: Picture }>();
  const i18n = useI18n();

  const imageDate = computed(() => {
    if (props.article.date) {
      return new Date(props.article.date).toLocaleDateString(
        i18n.locale.value,
        { dateStyle: 'long' }
      );
    }
    return undefined;
  });
</script>

<template>
  <div class="flex h-full w-full flex-col items-center gap-2 space-y-1">
    <StyledImage
      :alt="article.title"
      :full-width="true"
      :src="article.src"
      class="h-fit w-fit"
    />
    <div class="flex w-full items-start justify-between gap-4">
      <div class="flex flex-col gap-2">
        <p v-if="imageDate" class="flex items-center gap-2">
          <UIcon
            class="size-5 text-neutral-500"
            name="i-lucide-calendar-days"
          />
          {{ imageDate }}
        </p>
        <p v-if="article.location" class="flex items-center gap-2">
          <UIcon class="size-5 text-neutral-500" name="i-lucide-map-pin" />
          {{ article.location }}
        </p>
      </div>
      <p v-if="article.author" class="flex items-center gap-2 font-medium">
        <UIcon class="size-5 text-neutral-500" name="i-lucide-camera" />
        {{ article.author }}
      </p>
    </div>
  </div>
</template>
