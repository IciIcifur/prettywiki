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

  // TODO: replace with pages in project
  const contentsUrl = computed(() =>
    locale.value === 'ru'
      ? 'https://ru.wikipedia.org/wiki/Википедия:Содержание'
      : 'https://en.wikipedia.org/wiki/Portal:Contents'
  );
  const newsUrl = computed(() =>
    locale.value === 'ru'
      ? 'https://ru.wikipedia.org/wiki/Портал:Текущие_события'
      : 'https://en.wikipedia.org/wiki/Portal:Current_events'
  );
  const donateUrl = 'https://donate.wikimedia.org/';

  const menuItems = computed(() => [
    {
      icon: 'i-lucide-table-of-contents',
      tooltip: t('main.search.bottomMenu.contents'),
      color: 'primary',
      to: contentsUrl.value,
      target: '_blank',
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
      to: newsUrl.value,
      target: '_blank',
      onClick: () => {},
    },
    {
      icon: 'i-lucide-hand-coins',
      tooltip: t('main.search.bottomMenu.donate'),
      color: 'success',
      to: donateUrl,
      target: '_blank',
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
        @click.stop="item.onClick"
        :color="item.color"
        :target="item.target"
        :to="item.to"
        class="w-full cursor-pointer justify-center"
        size="xl"
        variant="ghost"
      >
        <UIcon :class="`text-${item.color} size-6`" :name="item.icon" />
      </UButton>
    </UTooltip>
  </div>
</template>
