<script setup lang="ts">
  import PickTimeLineIcon from '../../utils/timelineIcon.ts';

  defineProps<{ paragraph: string }>();
</script>

<template>
  <li class="flex h-fit w-full gap-4">
    <UIcon
      :name="PickTimeLineIcon([], paragraph)"
      class="mt-1 size-5 shrink-0 text-neutral-500"
    />
    <ArticleText
      no-styling
      :item="{ id: '', type: 'text', text: paragraph }"
      class="w-full"
    />
  </li>
</template>

<style scoped></style>
