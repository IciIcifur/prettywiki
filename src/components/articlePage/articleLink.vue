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
    <ULink :to="href"><span class="text-nowrap" v-html="text" /></ULink>
  </UTooltip>
</template>
