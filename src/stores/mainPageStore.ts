import { defineStore } from 'pinia';
import { onMounted, ref, watch } from 'vue';
import type { ArticleSummary, EventItem, Picture } from '../types/types.ts';
import { useI18n } from 'vue-i18n';
import { GetHistoryForThisDay } from '../api/contentAPI.ts';

interface BaseState {
  data: any;
  isLoading: boolean;
  error: boolean;
}
interface EventsState extends BaseState {
  data: EventItem[] | null;
}
interface TFAState extends BaseState {
  data: ArticleSummary | null;
}
interface TGAState extends BaseState {
  data: ArticleSummary | null;
}
interface TFIState extends BaseState {
  data: Picture | null;
}
interface DYKState extends BaseState {
  data: string[] | null;
}

interface LocaleState<T> {
  [locale: string]: T;
}
const baseState = { en: null, ru: null };
const baseArticleState = {
  en: { data: null, isLoading: false, error: false },
  ru: { data: null, isLoading: false, error: false },
};

interface LastLoaded {
  events: LocaleState<Date | null>;
  tfa: LocaleState<Date | null>;
  tga: LocaleState<Date | null>;
  tfi: LocaleState<Date | null>;
  dyk: LocaleState<Date | null>;
}

export const useMainPageStore = defineStore(
  'main',
  () => {
    const toast = useToast();
    const lastLoaded = ref<LastLoaded>({
      events: baseState,
      tfa: baseState,
      tga: baseState,
      tfi: baseState,
      dyk: baseState,
    });

    const events = ref<LocaleState<EventsState>>(baseArticleState);
    const tfa = ref<LocaleState<TFAState>>(baseArticleState);
    const tga = ref<LocaleState<TGAState>>(baseArticleState);
    const tfi = ref<LocaleState<TFIState>>(baseArticleState);
    const dyk = ref<LocaleState<DYKState>>(baseArticleState);

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
    async function loadTFA() {
      const loadDate = lastLoaded.value.tfa[locale.value];
      if (!!loadDate && !isOutdated(loadDate)) return;

      tfa.value[locale.value].isLoading = true;
      try {
        lastLoaded.value.tfa[locale.value] = new Date();
        tfa.value[locale.value].error = false;
      } catch (e: any) {
        toast.add({
          color: 'error',
          title: t('main.toasts.getTFAError'),
          description: e.message,
        });
        console.error(e.message);

        lastLoaded.value.tfa[locale.value] = null;
        tfa.value[locale.value].data = null;
        tfa.value[locale.value].error = true;
      }
      tfa.value[locale.value].isLoading = false;
    }
    async function loadTGA() {
      const loadDate = lastLoaded.value.tga[locale.value];
      if (!!loadDate && !isOutdated(loadDate)) return;

      tga.value[locale.value].isLoading = true;
      try {
        lastLoaded.value.tga[locale.value] = new Date();
        tga.value[locale.value].error = false;
      } catch (e: any) {
        if (locale.value === 'ru')
          toast.add({
            color: 'error',
            title: t('main.toasts.getTGAError'),
            description: e.message,
          });
        console.error(e.message);

        lastLoaded.value.tga[locale.value] = null;
        tga.value[locale.value].data = null;
        tga.value[locale.value].error = true;
      }
      tga.value[locale.value].isLoading = false;
    }
    async function loadTFI() {
      const loadDate = lastLoaded.value.tfi[locale.value];
      if (!!loadDate && !isOutdated(loadDate)) return;

      tfi.value[locale.value].isLoading = true;
      try {
        lastLoaded.value.tfi[locale.value] = new Date();
        tfi.value[locale.value].error = false;
      } catch (e: any) {
        toast.add({
          color: 'error',
          title: t('main.toasts.getTFIError'),
          description: e.message,
        });
        console.error(e.message);

        lastLoaded.value.tfi[locale.value] = null;
        tfi.value[locale.value].data = null;
        tfi.value[locale.value].error = true;
      }
      tfi.value[locale.value].isLoading = false;
    }
    async function loadDYK() {
      const loadDate = lastLoaded.value.dyk[locale.value];
      if (!!loadDate && !isOutdated(loadDate)) return;

      dyk.value[locale.value].isLoading = true;
      try {
      } catch (e: any) {
        toast.add({
          color: 'error',
          title: t('main.toasts.getDYKError'),
          description: e.message,
        });
        console.error(e.message);

        lastLoaded.value.dyk[locale.value] = null;
        dyk.value[locale.value].data = null;
        dyk.value[locale.value].error = true;
      }
      dyk.value[locale.value].isLoading = false;
    }

    async function loadData() {
      await Promise.all([
        loadEvents(),
        loadTFI(),
        loadTFA(),
        loadTGA(),
        loadDYK(),
      ]);
    }

    watch(locale, async () => await loadData(), { flush: 'post' });
    onMounted(async () => await loadData());

    return { events, tfa, tga, tfi, dyk };
  },
  {
    persist: true,
  }
);
