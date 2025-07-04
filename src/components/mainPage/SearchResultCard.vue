<script setup lang="ts">
  import { useI18n } from 'vue-i18n';

  const { locale } = useI18n();
  const props = defineProps({
    title: String,
    firstLine: String,
    lastUpdated: String,
  });

  const date = new Date(props.lastUpdated as string);
  const localizedDate = date.toLocaleDateString(locale.value, {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
</script>

<template>
  <UButton
    class="flex w-full flex-col items-start p-2"
    color="neutral"
    :to="`/wiki/${title?.replace(' ', '_')}`"
    variant="ghost"
  >
    <p class="text-primary">{{ title }}</p>
    <p class="line-clamp-2 w-full text-start text-xs" v-html="firstLine" />
    <p class="w-full text-end text-xs text-neutral-400 italic">
      {{ localizedDate }}
    </p>
  </UButton>
</template>
