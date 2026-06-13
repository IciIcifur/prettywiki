import { defineStore } from 'pinia';
import { onMounted, ref, watch } from 'vue';
import type { ArticleSummary, EventItem, Picture } from '../types/types.ts';
import { useI18n } from 'vue-i18n';
import {
  GetHistoryForThisDay,
  GetMaterialsOfTheDay,
} from '../api/contentAPI.ts';

interface BaseState {
  data: any;
  isLoading: boolean;
  error: boolean;
}
interface EventsState extends BaseState {
  data: EventItem[] | null;
}
interface FeaturedState extends BaseState {
  data: {
    tfa: ArticleSummary | null;
    tga: ArticleSummary | null;
    tfi: Picture | null;
    dyk: string[] | null;
  };
}

interface LocaleState<T> {
  [locale: string]: T;
}
const baseState = { en: null, ru: null };
const baseFeaturedState: LocaleState<FeaturedState> = {
  en: {
    data: { tfa: null, tga: null, tfi: null, dyk: null },
    isLoading: false,
    error: false,
  },
  ru: {
    data: { tfa: null, tga: null, tfi: null, dyk: null },
    isLoading: false,
    error: false,
  },
};

interface LastLoaded {
  events: LocaleState<Date | null>;
  featured: LocaleState<Date | null>;
}

export const useMainPageStore = defineStore(
  'main',
  () => {
    const toast = useToast();
    const lastLoaded = ref<LastLoaded>({
      events: baseState,
      featured: baseState,
    });

    const events = ref<LocaleState<EventsState>>({
      en: { data: null, isLoading: false, error: false },
      ru: { data: null, isLoading: false, error: false },
    });
    const featured = ref<LocaleState<FeaturedState>>(baseFeaturedState);

    const { t, locale } = useI18n();

    function isOutdated(date: Date): boolean {
      const today = new Date();

      return (
        date.getFullYear() !== today.getFullYear() ||
        date.getMonth() !== today.getMonth() ||
        date.getDate() !== today.getDate()
      );
    }

    async function loadEvents() {
      const loadDate = lastLoaded.value.events[locale.value];
      if (!!loadDate && !isOutdated(loadDate)) return;

      events.value[locale.value].isLoading = true;
      try {
        const result = await GetHistoryForThisDay(locale.value);
        if (!result) throw new Error();

        events.value[locale.value].data = result;

        lastLoaded.value.events[locale.value] = new Date();
        events.value[locale.value].error = false;
      } catch (e: any) {
        toast.add({
          color: 'error',
          title: t('main.toasts.getEventsError'),
          description: e.message,
        });
        console.error(e.message);

        lastLoaded.value.events[locale.value] = null;
        events.value[locale.value].data = null;
        events.value[locale.value].error = true;
      }
      events.value[locale.value].isLoading = false;
    }
    async function loadFeatured() {
      const loadDate = lastLoaded.value.featured[locale.value];
      if (!!loadDate && !isOutdated(loadDate)) return;

      featured.value[locale.value].isLoading = true;
      try {
        const response = await GetMaterialsOfTheDay(locale.value);
        if (!response) throw new Error();

        featured.value[locale.value].data = {
          tfa: response.featuredArticle,
          tga: response.goodArticle,
          tfi: response.featuredPicture,
          dyk: response.facts,
        };

        lastLoaded.value.featured[locale.value] = new Date();
        featured.value[locale.value].error = false;
      } catch (e: any) {
        toast.add({
          color: 'error',
          title: t('main.toasts.getTFAError'),
          description: e.message,
        });
        console.error(e.message);

        lastLoaded.value.featured[locale.value] = null;
        featured.value[locale.value] = baseFeaturedState[locale.value];
        featured.value[locale.value].error = true;
      }
      featured.value[locale.value].isLoading = false;
    }

    async function loadData() {
      await Promise.all([loadEvents(), loadFeatured()]);
    }

    watch(locale, async () => await loadData(), { flush: 'post' });
    onMounted(async () => await loadData());

    return { events, featured };
  },
  {
    persist: true,
  }
);
