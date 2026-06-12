<script setup lang="ts">
  import { useI18n } from 'vue-i18n';
  const { t } = useI18n();
</script>

<template>
  <footer
    class="bottom-0 z-30 flex h-fit w-full items-center justify-between gap-2 border-t border-neutral-200 bg-white/60 px-8 py-2 text-sm dark:border-neutral-800 dark:bg-neutral-900/60"
  >
    <p>{{ t('footer.copyright', { year: '2025', author: 'IciIcifur' }) }}</p>

    <div class="flex h-fit items-center justify-center gap-1">
      <p class="text-xs italic">{{ t('footer.sources') }}</p>
    </div>

    <div class="flex h-fit items-center justify-center gap-1">
      <UButton
        icon="i-lucide-send"
        to="https://t.me/icicle_icifur"
        variant="link"
      />
      <UButton
        icon="i-lucide-github"
        to="https://github.com/IciIcifur/prettywiki"
        variant="link"
      />
    </div>
  </footer>
</template>
