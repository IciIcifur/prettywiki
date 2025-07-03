<script setup lang="ts">
  import { onMounted, onUnmounted, ref, watch } from 'vue';
  import type { TimelineItem } from '@nuxt/ui/components/Timeline.vue';
  import { GetForThisDay } from '../../api/contentAPI.ts';
  import { useI18n } from 'vue-i18n';

  const { t, locale } = useI18n();
  const scrollRef = ref(null);

  const items = ref<TimelineItem[]>([]);

  const scrollToRight = () => {
    if (scrollRef.value) {
      scrollRef.value.scrollLeft = scrollRef.value.scrollWidth;
    }
  };

  async function loadItems() {
    const result = await GetForThisDay(locale.value);
    if (result) items.value = result;
    else items.value = [];
  }

  onMounted(async () => {
    await loadItems();

    window.addEventListener('resize', scrollToRight);
  });

  onUnmounted(() => {
    window.removeEventListener('resize', scrollToRight);
  });

  watch(locale, async () => {
    await loadItems();
  });

  watch(items, scrollToRight);
</script>

<template>
  <div class="relative flex h-fit w-full justify-start overflow-clip">
    <div
      class="pointer-events-none absolute top-0 left-0 z-10 h-full w-40 bg-gradient-to-r from-[var(--ui-bg)] to-transparent"
    />
    <div
      class="pointer-events-none absolute top-0 right-0 z-10 h-full w-40 bg-gradient-to-l from-[var(--ui-bg)] to-transparent"
    />
    <div
      ref="scrollRef"
      class="hide-scrollbar flex w-full overflow-x-auto scroll-smooth pl-40"
    >
      <UTimeline
        orientation="horizontal"
        :ui="{ item: 'w-80 ', description: 'line-clamp-3' }"
        :default-value="2"
        :items="items"
        class="w-fit"
        size="lg"
      />
      <div class="hidden min-w-[30%] sm:flex" />
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
