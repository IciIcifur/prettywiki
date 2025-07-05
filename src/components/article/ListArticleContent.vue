<script setup lang="ts">
  defineProps<{ article: string[] }>();
</script>

<template>
  <ul class="flex flex-col gap-4 pt-4">
    <IconParagraph
      :key="index"
      v-for="(fact, index) in article"
      :paragraph="fact"
    />
  </ul>
</template>
