<script setup lang="ts">
  import type { InfoBoxItem } from '../../types/types.ts';

  const props = defineProps<{ item: InfoBoxItem }>();
</script>

<template>
  {{ item.type }}
  {{ item.title }}
</template>

<style scoped></style>
