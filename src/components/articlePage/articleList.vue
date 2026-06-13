<script setup lang="ts">
  import type { ListItem } from '../../types/types.ts';

  const props = defineProps<{ item: ListItem }>();
</script>

<template>
  {{ item.type }}
  {{ item.listType }}
</template>

<style scoped></style>
