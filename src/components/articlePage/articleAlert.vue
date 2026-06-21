<script setup lang="ts">
  import type { AlertItem } from '../../types/types.ts';

  const props = defineProps<{ item: AlertItem }>();
  const AMBOX_TYPE_REGEX =
    /-(style|content|notice|delete|speedy|move|protection)\b/;

  function getAlertType(className: string): string {
    return AMBOX_TYPE_REGEX.exec(className)?.[1] ?? 'notice';
  }
</script>

<template>
  <p>{{ item.type }} {{ item.classes }}</p>
</template>

<style scoped></style>
