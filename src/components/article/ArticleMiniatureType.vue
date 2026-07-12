<script setup lang="ts">
  import { useI18n } from 'vue-i18n';
  import { computed } from 'vue';

  const props = defineProps<{
    articleType: 'featured' | 'good' | 'image' | 'facts';
  }>();
  const { t } = useI18n();

  const attrs = computed(() => {
    switch (props.articleType) {
      case 'image':
        return {
          color: 'error',
          icon: 'i-lucide-camera',
        };
      case 'good':
        return {
          color: 'success',
          icon: 'i-lucide-circle-check-big',
        };
      case 'facts':
        return { color: 'secondary', icon: 'i-lucide-telescope' };
      default:
        return { color: 'warning', icon: 'i-lucide-star' };
    }
  });
</script>

<template>
  <div
    :class="`text-${attrs.color}`"
    class="flex w-fit items-center justify-start gap-2 text-sm font-medium transition-colors"
  >
    <UIcon :name="attrs.icon" class="size-5" />
    <p>{{ t(`main.articleType.${articleType}`) }}</p>
  </div>
</template>

<style scoped></style>
