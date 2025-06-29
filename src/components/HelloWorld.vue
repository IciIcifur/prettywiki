<script setup lang="ts">
defineProps<{ msg: string }>();
</script>

<template>
  <h1>{{ msg }}</h1>

  <div class="flex w-fit flex-col gap-4">
    <UButton
      v-for="i of [1, 2, 3, 4, 5, 7, 9, 11, 12, 12, 15]"
      :key="i"
      color="primary"
      >Nuxt UI</UButton
    >
  </div>
</template>
