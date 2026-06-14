<script setup lang="ts">
  defineProps<{ href: string; title?: string; text: string }>();
</script>

<template>
  <UTooltip
    :content="{
      align: 'start',
      side: 'top',
    }"
    :disabled="!title"
    :text="title"
  >
    <ULink :to="href"><span v-html="text" class="text-nowrap" /></ULink>
  </UTooltip>
</template>
