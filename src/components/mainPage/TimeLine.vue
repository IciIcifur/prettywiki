<script setup lang="ts">
  import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
  import type { TimelineItem } from '@nuxt/ui/components/Timeline.vue';
  import { GetHistoryForThisDay } from '../../api/contentAPI.ts';
  import { useI18n } from 'vue-i18n';
  import { useTimelineCenterIndex } from '../../composibles/useTimelineCentralIndex.ts';

  const i18n = useI18n();
  const scrollRef = ref<null | HTMLElement>(null);
  const centerIndex = useTimelineCenterIndex(scrollRef);

  const date = new Date();
  const localizedDate = computed(() =>
    date.toLocaleDateString(i18n.locale.value, {
      day: 'numeric',
      month: 'long',
    })
  );

  const items = ref<TimelineItem[]>([]);

  const scrollToRight = () => {
    if (scrollRef.value)
      scrollRef.value.scrollLeft = scrollRef.value.scrollWidth;
  };

  async function loadItems() {
    const result = await GetHistoryForThisDay(i18n.locale.value);
    if (result) items.value = result;
    else items.value = [];
  }

  onMounted(async () => {
    await loadItems();
    scrollToRight();

    window.addEventListener('resize', scrollToRight);
  });
  onUnmounted(() => {
    window.removeEventListener('resize', scrollToRight);
  });

  watch(i18n.locale, async () => {
    await loadItems();
    scrollToRight();
  });
</script>

<template>
  <div class="flex w-full flex-col gap-4">
    <h1
      v-if="items.length"
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
              :to="`/wiki/${item.title?.replace(/ /g, '_')}`"
              class="hover:text-primary line-clamp-1 w-full text-[var(--ui-text)] transition-colors"
            >
              {{ item.title }}
            </ULink>
          </template>
        </UTimeline>
        <div class="hidden min-w-[30%] sm:flex" />
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
