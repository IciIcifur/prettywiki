<script setup lang="ts">
  import type { AlertItem } from '../../types/types.ts';
  import { computed } from 'vue';

  const props = defineProps<{ item: AlertItem }>();
  const AMBOX_TYPE_REGEX =
    /-(style|content|notice|delete|speedy|move|protection)\b/;

  function getAlertType(className: string): string {
    return AMBOX_TYPE_REGEX.exec(className)?.[1] ?? 'notice';
  }

  const alertType = computed(() => getAlertType(props.item.classes));

  const style = computed(() => {
    switch (alertType.value) {
      case 'delete':
      case 'speedy':
        return { color: 'error' as const, icon: 'i-lucide-trash-2' };
      case 'protection':
        return { color: 'warning' as const, icon: 'i-lucide-lock' };
      case 'move':
        return { color: 'info' as const, icon: 'i-lucide-move' };
      case 'style':
        return { color: 'info' as const, icon: 'i-lucide-paintbrush' };
      case 'content':
        return { color: 'warning' as const, icon: 'i-lucide-triangle-alert' };
      default:
        return { color: 'info' as const, icon: 'i-lucide-info' };
    }
  });
</script>

<template>
  <UAlert
    v-if="item.title || item.text"
    :color="style.color"
    :icon="style.icon"
    class="my-2"
    variant="soft"
  >
    <template #title v-if="item.title">
      <ArticleText
        no-styling
        :item="{
          id: '',
          type: 'text',
          text: item.title[0]?.toUpperCase() + item.title.slice(1),
        }"
      />
    </template>
    <template #description v-if="item.text">
      <ArticleText
        no-styling
        :item="{ id: '', type: 'text', text: item.text }"
        class="text-sm"
      />
    </template>
  </UAlert>
</template>

<style scoped></style>
