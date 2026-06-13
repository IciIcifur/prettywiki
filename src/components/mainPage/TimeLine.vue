<script setup lang="ts">
  import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
  import type { TimelineItem } from '@nuxt/ui/components/Timeline.vue';
  import { GetHistoryForThisDay } from '../../api/contentAPI.ts';
  import { useI18n } from 'vue-i18n';
  import { useTimelineCenterIndex } from '../../composibles/useTimelineCentralIndex.ts';
  import TimelineItemSkeleton from '../timeline/TimelineItemSkeleton.vue';
  import getPageUrl from '../../utils/getPageUrl.ts';

  const { locale } = useI18n();
  const scrollRef = ref<null | HTMLElement>(null);
  const centerIndex = useTimelineCenterIndex(scrollRef);

  const date = new Date();
  const localizedDate = computed(() =>
    date.toLocaleDateString(locale.value, {
      day: 'numeric',
      month: 'long',
    })
  );

  const items = ref<TimelineItem[]>([]);
  const loading = ref(false);

  const scrollToRight = () => {
    if (scrollRef.value)
      scrollRef.value.scrollLeft = scrollRef.value.scrollWidth;
  };

  async function loadItems() {
    loading.value = true;
    const result = await GetHistoryForThisDay(locale.value);
    if (result) items.value = result as any[];
    else items.value = [];
    loading.value = false;
  }

  onMounted(async () => {
    await loadItems();
    scrollToRight();

    window.addEventListener('resize', scrollToRight);
  });
  onBeforeUnmount(() => {
    window.removeEventListener('resize', scrollToRight);
  });

  watch(locale, async () => {
    await loadItems();
    scrollToRight();
  });
</script>

<template>
  <div class="flex w-full flex-col gap-4">
    <h1
      v-if="items.length || loading"
      class="w-full text-neutral-300 italic dark:text-neutral-700"
    >
      {{ localizedDate }}
    </h1>
    <div class="relative flex h-fit w-full justify-start overflow-clip">
      <div
        class="pointer-events-none absolute top-0 left-0 z-10 h-full w-20 bg-gradient-to-r from-[var(--ui-bg)] to-transparent sm:w-40"
      />
      <div
        class="pointer-events-none absolute top-0 right-0 z-10 h-full w-20 bg-gradient-to-l from-[var(--ui-bg)] to-transparent sm:w-40"
      />
      <div
        ref="scrollRef"
        v-if="!loading"
        class="hide-scrollbar flex w-full overflow-x-auto scroll-smooth pl-40"
      >
        <UTimeline
          v-model="centerIndex"
          :items="items"
          :ui="{
            item: 'w-80',
            description: 'line-clamp-3',
            indicator: 'transition-colors duration-500',
          }"
          class="w-fit"
          color="neutral"
          orientation="horizontal"
          size="lg"
        >
          <template #title="{ item }">
            <ULink
              :to="getPageUrl(item.title)"
              class="hover:text-primary line-clamp-1 w-full text-[var(--ui-text)] transition-colors"
            >
              {{ item.title }}
            </ULink>
          </template>
        </UTimeline>
        <div class="hidden min-w-[30%] sm:flex" />
      </div>
      <div v-else class="flex gap-0 overflow-clip">
        <TimelineItemSkeleton :key="_" v-for="_ in [1, 2, 3, 4]" />
      </div>
    </div>
  </div>
</template>

<style scoped>
  .hide-scrollbar {
    scrollbar-width: none;
    -ms-overflow-style: none;
  }
  .hide-scrollbar::-webkit-scrollbar {
    display: none;
  }
</style>
