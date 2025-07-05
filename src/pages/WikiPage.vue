<script setup lang="ts">
  import { useRoute } from 'vue-router';

  const route = useRoute();

  const title = route.params.title.toString().replace('_', ' ');
</script>

<template>Wiki page "{{ title }}"</template>

<style scoped></style>
