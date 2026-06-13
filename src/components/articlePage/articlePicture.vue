<script setup lang="ts">
  import type { PictureItem } from '../../types/types.ts';

  const props = defineProps<{ item: PictureItem }>();
</script>

<template>
  {{ item.type }}
  {{ item.caption }}
</template>

<style scoped></style>
