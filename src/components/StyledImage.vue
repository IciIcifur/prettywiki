<script setup lang="ts">
  import { ref } from 'vue';

  const props = defineProps<{
    src: string | undefined;
    alt: string;
    fullWidth?: boolean;
  }>();

  const error = ref(!props.src);
</script>

<template>
  <div
    :class="!fullWidth && 'sm:w-96'"
    class="flex min-h-64 items-center justify-center overflow-clip rounded-sm border border-white/40 bg-neutral-200 text-neutral-300 dark:border-white/5 dark:bg-neutral-800 dark:text-neutral-700"
  >
    <img
      @error="error = true"
      v-if="!error"
      :alt="alt"
      :src="src"
      class="w-full max-w-3xl"
      loading="lazy"
    />
    <div v-else class="flex h-full w-full items-center justify-center">
      <UIcon class="size-32" name="i-lucide-mountain-snow" />
    </div>
  </div>
</template>
