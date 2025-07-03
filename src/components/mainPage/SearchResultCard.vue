<script setup lang="ts">
  defineProps({ title: String, firstLine: String, url: String });
</script>

<template>
  <UButton
    :to="url"
    variant="ghost"
    color="neutral"
    class="flex w-full flex-col items-start p-2"
  >
    <p class="text-indigo-500 dark:text-indigo-300">{{ title }}</p>
    <p class="line-clamp-2 text-xs">{{ firstLine }}</p>
  </UButton>
</template>
