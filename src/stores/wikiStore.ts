import { defineStore } from 'pinia';
import { useI18n } from 'vue-i18n';
import { computed, ref, shallowRef, watch } from 'vue';
import type { Article } from '../types/types.ts';
import { GetPageByTitle } from '../api/contentAPI.ts';
import parsePageHTML from '../utils/parsePageHTML.ts';

const LRU_SIZE = 5;

export const useWikiStore = defineStore('wiki', () => {
  const toast = useToast();
  const { t, locale } = useI18n();

  const lruPages = shallowRef(new Map<string, Article>());
  const lruSize = computed(() => lruPages.value.size);

  const activePage = shallowRef<Article | null>(null);
  const isLoading = ref(false);

  function isOutdated(date: Date): boolean {
    const today = new Date();

    return (
      date.getFullYear() !== today.getFullYear() ||
      date.getMonth() !== today.getMonth() ||
      date.getDate() !== today.getDate()
    );
  }
  function getArticleKey(title: string) {
    return title.replaceAll(/\s/g, '').trim().replaceAll(' ', '_');
  }
  function hasCache(key: string) {
    if (lruPages.value.has(key)) {
      const savedArticle = lruPages.value.get(key);
      if (
        savedArticle?.loadTimestamp &&
        savedArticle.contents.length &&
        !isOutdated(savedArticle.loadTimestamp)
      ) {
        activePage.value = { ...savedArticle };
        return true;
      }
    }
    return false;
  }

  async function loadPage(title: string) {
    const key = getArticleKey(title);
    if (hasCache(key)) return;

    isLoading.value = true;
    try {
      const html = await GetPageByTitle(title, locale.value);
      if (!html) throw new Error('Not found');

      const parsedContents = parsePageHTML(html);
      const newArticle = {
        title,
        loadTimestamp: new Date(),
        contents: parsedContents,
      };

      activePage.value = newArticle;
      lruPages.value.set(key, newArticle);
    } catch (e: any) {
      toast.add({
        color: 'error',
        title: t('wiki.toasts.getArticleError'),
        description: e.message,
      });
      console.error(e.message);
    }
    isLoading.value = false;
  }

  watch(lruSize, () => {
    if (lruSize.value > LRU_SIZE) {
      let latestArticle: { key: string; date: number } | null = null;

      for (const [key, page] of [...lruPages.value.entries()]) {
        if (activePage.value && key === getArticleKey(activePage.value.title))
          continue;

        const date = Number(page.loadTimestamp);
        if (!latestArticle || date < latestArticle.date)
          latestArticle = { key, date };
      }

      if (latestArticle) lruPages.value.delete(latestArticle.key);
    }
  });

  return { activePage, isLoading, loadPage };
});
