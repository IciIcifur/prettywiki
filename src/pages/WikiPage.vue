<script setup lang="ts">
  import { useRoute } from 'vue-router';
  import { computed } from 'vue';

  const route = useRoute();

  const title = computed(() => route.params.title.toString());
</script>

<template>Wiki page "{{ title }}"</template>
