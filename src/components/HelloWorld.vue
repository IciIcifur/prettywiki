<script setup lang="ts">
defineProps<{ msg: string }>();
</script>

<template>
  <h1>Заголовок 1</h1>
  <h2>Заголовок 2</h2>
  <h3>Заголовок 3</h3>
  <h4>Заголовок 4</h4>
  <p>{{ msg }} Обычный текст</p>

  <div class="flex w-fit flex-col gap-4">
    <UButton
      v-for="i of [1, 2, 3, 4, 5, 7, 9, 11, 12, 12, 15, 17]"
      :key="i"
      color="primary"
      >Nuxt UI</UButton
    >
  </div>
</template>
