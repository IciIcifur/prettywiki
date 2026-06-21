<script setup lang="ts">
  import type { TableItem } from '../../types/types.ts';

  const props = defineProps<{ item: TableItem }>();
</script>

<template>
  <p>{{ item.type }} {{ item.title }}</p>
</template>

<style scoped></style>
