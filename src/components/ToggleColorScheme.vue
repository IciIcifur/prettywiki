<script setup lang="ts">
import { useColorMode } from "@vueuse/core";

const colorMode = useColorMode();

function toggleScheme() {
  colorMode.value = colorMode.value === "dark" ? "light" : "dark";
}
</script>

<template>
  <UButton
    :icon="colorMode == 'dark' ? 'i-lucide-sun' : 'i-lucide-moon'"
    color="secondary"
    variant="soft"
    @click="toggleScheme"
  />
</template>
