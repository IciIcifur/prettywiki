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
    class="group relative flex items-center justify-center overflow-hidden rounded-xl border border-neutral-50/5 bg-neutral-200 dark:border-white/5 dark:bg-neutral-800"
  >
    <img
      v-if="!error"
      @error="error = true"
      :alt="alt"
      :src="src"
      class="h-auto max-h-[560px] w-full transition-transform duration-300 group-hover:scale-105"
      loading="lazy"
    />
    <div
      v-else
      class="flex min-h-[16rem] w-full items-center justify-center text-neutral-300 dark:text-neutral-700"
    >
      <UIcon class="size-32" name="i-lucide-mountain-snow" />
    </div>
  </div>
</template>
