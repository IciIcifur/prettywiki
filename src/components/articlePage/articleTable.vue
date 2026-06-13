<script setup lang="ts">
  import type { TableItem } from '../../types/types.ts';

  const props = defineProps<{ item: TableItem }>();
</script>

<template>
  {{ item.type }}
  {{ item.title }}
</template>

<style scoped></style>
