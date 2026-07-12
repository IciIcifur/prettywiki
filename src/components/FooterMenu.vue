<script setup lang="ts">
  import { useI18n } from 'vue-i18n';
  import type { NavigationMenuItem } from '@nuxt/ui/components/NavigationMenu.vue';
  import { computed } from 'vue';

  const { t } = useI18n();

  const sources = computed<NavigationMenuItem[]>(() => [
    {
      label: t('footer.sources'),
      icon: 'i-lucide-book-open',
      children: [
        {
          label: t('footer.actionApi'),
          icon: 'i-lucide-bookmark',
          to: 'https://www.mediawiki.org/wiki/API:Main_page',
        },
        {
          label: t('footer.restApi'),
          icon: 'i-lucide-bookmark',
          to: 'https://www.mediawiki.org/wiki/API:REST_API',
        },
        {
          label: t('footer.wtfWikipedia'),
          icon: 'i-lucide-package',
          to: 'https://github.com/spencermountain/wtf_wikipedia',
        },
      ],
    },
  ]);
</script>

<template>
  <footer
    class="bottom-0 flex h-fit w-full items-center justify-between gap-2 border-t border-neutral-200 bg-white/60 px-8 py-2 text-sm dark:border-neutral-800 dark:bg-neutral-900/60"
  >
    <div class="flex h-fit items-center justify-center gap-1">
      <UNavigationMenu
        :items="sources"
        collapsed
        tooltip
        popover
        orientation="vertical"
      />
    </div>

    <p>{{ t('footer.copyright', { year: '2026', author: 'IciIcifur' }) }}</p>

    <div class="flex h-fit items-center justify-center gap-1">
      <UButton
        icon="i-lucide-send"
        rel="noopener noreferrer"
        target="_blank"
        to="https://t.me/icicle_icifur"
        variant="link"
      />
      <UButton
        icon="i-lucide-github"
        rel="noopener noreferrer"
        target="_blank"
        to="https://github.com/IciIcifur/prettywiki"
        variant="link"
      />
    </div>
  </footer>
</template>
