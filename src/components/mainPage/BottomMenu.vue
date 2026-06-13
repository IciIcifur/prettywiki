<script setup lang="ts">
  import { computed } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { useRouter } from 'vue-router';
  import { GetRandomPageTitle } from '../../api/contentAPI.ts';
  import getPageUrl from '../../utils/getPageUrl.ts';

  const { t, locale } = useI18n();
  const toast = useToast();

  const router = useRouter();

  async function navigateToRandomArticle() {
    const articleTitle = await GetRandomPageTitle(locale.value);
    if (articleTitle) await router.push(getPageUrl(articleTitle));
    else {
      toast.add({
        color: 'error',
        title: t('main.search.getRandomError'),
        icon: 'i-lucide-dices',
      });
      console.error(t('main.search.getRandomError'));
    }
  }

  // TODO: add real urls
  const menuItems = computed(() => [
    {
      icon: 'i-lucide-table-of-contents',
      tooltip: t('main.search.bottomMenu.contents'),
      color: 'primary',
      to: '/',
      onClick: () => {},
    },
    {
      icon: 'i-lucide-star',
      tooltip: t('main.search.bottomMenu.featured'),
      color: 'warning',
      to: '/',
      onClick: () => {},
    },
    {
      icon: 'i-lucide-dices',
      tooltip: t('main.search.bottomMenu.random'),
      color: 'secondary',
      to: undefined,
      onClick: navigateToRandomArticle,
    },
    {
      icon: 'i-lucide-clock',
      tooltip: t('main.search.bottomMenu.news'),
      color: 'error',
      to: '/',
      onClick: () => {},
    },
    {
      icon: 'i-lucide-hand-coins',
      tooltip: t('main.search.bottomMenu.donate'),
      color: 'success',
      to: '/',
      onClick: () => {},
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
        class="w-full cursor-pointer justify-center"
        size="xl"
        @click.stop="item.onClick"
        variant="ghost"
      >
        <UIcon :class="`text-${item.color} size-6`" :name="item.icon" />
      </UButton>
    </UTooltip>
  </div>
</template>
