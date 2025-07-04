<script setup lang="ts">
  import { useColorMode } from '@vueuse/core';

  const colorMode = useColorMode();

  function toggleScheme() {
    colorMode.value = colorMode.value === 'dark' ? 'light' : 'dark';
  }
</script>

<template>
  <UButton
    color="secondary"
    :icon="colorMode == 'dark' ? 'i-lucide-sun' : 'i-lucide-moon'"
    variant="soft"
    @click.stop="toggleScheme"
  />
</template>
