<script setup lang="ts">
  import { computed } from 'vue';

  const { text } = defineProps<{ text: string }>();

  const regex = /\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g;

  const processedText = computed<string>(() => {
    return text.replace(regex, (match, target, label) => {
      const display = label || target;
      return `<a href="/wiki/${target.replace(/ /g, '_')}" class="font-medium hover:text-primary transition-colors">${display}</a>`;
    });
  });
</script>

<template>
  <p v-html="processedText" />
</template>
