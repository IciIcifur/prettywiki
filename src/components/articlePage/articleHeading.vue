<script setup lang="ts">
  import type { HeadingItem } from '../../types/types.ts';

  const props = defineProps<{ item: HeadingItem }>();
</script>

<template>
  {{ item.type }}
  {{ item.text }}
</template>

<style scoped></style>
