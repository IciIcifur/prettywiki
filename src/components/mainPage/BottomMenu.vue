<script setup lang="ts">
  import { computed } from 'vue';
  import { useI18n } from 'vue-i18n';

  const { t } = useI18n();

  // TODO: add real urls
  const menuItems = computed(() => [
    {
      icon: 'i-lucide-table-of-contents',
      tooltip: t('main.search.bottomMenu.contents'),
      color: 'primary',
      to: '/',
    },
    {
      icon: 'i-lucide-star',
      tooltip: t('main.search.bottomMenu.featured'),
      color: 'warning',
      to: '/',
    },
    {
      icon: 'i-lucide-dices',
      tooltip: t('main.search.bottomMenu.random'),
      color: 'secondary',
      to: '/',
    },
    {
      icon: 'i-lucide-clock',
      tooltip: t('main.search.bottomMenu.news'),
      color: 'error',
      to: '/',
    },
    {
      icon: 'i-lucide-hand-coins',
      tooltip: t('main.search.bottomMenu.donate'),
      color: 'success',
      to: '/',
    },
  ]);
</script>

<template>
  <div class="flex w-full gap-1 py-1 sm:max-w-xl">
    <UTooltip
      :key="item.tooltip"
      v-for="item in menuItems"
      :text="item.tooltip"
    >
      <UButton
        :color="item.color"
        :to="item.to"
        class="w-full justify-center"
        size="xl"
        variant="ghost"
      >
        <UIcon :class="`text-${item.color} size-6`" :name="item.icon" />
      </UButton>
    </UTooltip>
  </div>
</template>
