<script setup lang="ts">
  import type { HeadingItem } from '../../types/types.ts';
  import { computed } from 'vue';

  const props = defineProps<{ item: HeadingItem }>();

  const style = computed(() => {
    switch (props.item.level) {
      case 2:
        return 'italic pb-2 pt-4';
      case 3:
        return 'pt-3 pb-1';
      case 4:
        return 'pt-2 pb-0.5';
      default:
        return '';
    }
  });

  const cleanText = computed(() => {
    const div = document.createElement('div');
    div.innerHTML = props.item.text;
    div.querySelectorAll('[typeof="mw:FallbackId"]').forEach((s) => s.remove());
    return div.innerHTML.trim();
  });
</script>

<template>
  <component
    :is="`h${item.level}`"
    :class="style"
    class="flex-col overflow-hidden pl-6"
  >
    <USeparator v-if="item.level <= 2" class="pb-4" />
    <span v-html="cleanText" />
  </component>
</template>

<style scoped></style>
