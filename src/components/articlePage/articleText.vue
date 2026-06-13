<script setup lang="ts">
  import type { TextItem } from '../../types/types.ts';

  const props = defineProps<{ item: TextItem }>();
</script>

<template>
  {{ item.type }}
  {{ item.text }}
</template>

<style scoped></style>
