<script setup lang="ts">
  import { useI18n } from 'vue-i18n';
  import getPageUrl from '../../utils/getPageUrl.ts';

  const { locale } = useI18n();
  const props = defineProps<{
    title: string;
    firstLine: string;
    lastUpdated: string;
  }>();

  const date = new Date(props.lastUpdated as string);
  const localizedDate = date.toLocaleDateString(locale.value, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
</script>

<template>
  <UButton
    :to="getPageUrl(title)"
    class="flex w-full flex-col items-start p-2"
    color="neutral"
    variant="ghost"
  >
    <p class="text-primary">{{ title }}</p>
    <p v-html="firstLine" class="line-clamp-2 w-full text-start text-xs" />
    <p class="w-full text-end text-xs text-neutral-400 italic">
      {{ localizedDate }}
    </p>
  </UButton>
</template>
