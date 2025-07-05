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
          link: '/',
        };
      case 'good':
        return {
          color: 'success',
          icon: 'i-lucide-circle-check-big',
          link: '/',
        };
      case 'facts':
        return { color: 'secondary', icon: 'i-lucide-telescope', link: '/' };
      default:
        return { color: 'warning', icon: 'i-lucide-star', link: '/' };
    }
  });
</script>

<template>
  <ULink
    :class="`text-${attrs.color} hover:text-${attrs.color}-600 hover:dark:text-${attrs.color}-300`"
    :to="attrs.link"
    class="flex w-fit items-center justify-start gap-2 text-sm font-medium transition-colors"
  >
    <UIcon :name="attrs.icon" class="size-5" />
    <p>{{ t(`main.articleType.${articleType}`) }}</p>
  </ULink>
</template>

<style scoped></style>
