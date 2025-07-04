<script setup lang="ts">
  import { ref } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { debouncedWatch } from '@vueuse/core';
  import { SearchForPage } from '../../api/contentAPI.ts';
  import BottomMenu from './BottomMenu.vue';

  const { t, locale } = useI18n();

  const searchValue = ref('');
  const isLoading = ref(false);
  const isResultOpen = ref(false);

  const searchResults = ref<
    { title: string; firstLine: string; lastUpdated: string }[]
  >([]);

  debouncedWatch(
    searchValue,
    async () => {
      isResultOpen.value = false;
      isLoading.value = true;

      const result = await SearchForPage(searchValue.value, locale.value);
      if (result) searchResults.value = result;

      isLoading.value = false;
      isResultOpen.value = true;
    },
    { debounce: 400 }
  );
</script>

<template>
  <div class="flex w-full flex-col items-center justify-center gap-2">
    <UPopover v-model:open="isResultOpen" content.align="start">
      <template #anchor>
        <UInput
          v-model="searchValue"
          class="text-md w-full"
          color="error"
          icon="i-lucide-search"
          :loading="isLoading"
          :placeholder="t('main.search.placeholder')"
          size="xl"
          variant="soft"
        />
      </template>
      <template #content>
        <div class="h-fit max-w-sm overflow-clip rounded-md sm:max-w-lg">
          <div
            v-if="searchResults.length"
            class="flex h-fit max-h-96 flex-col overflow-y-scroll p-4"
          >
            <SearchResultCard
              v-for="(item, index) of searchResults"
              :key="index"
              :first-line="item.firstLine"
              :last-updated="item.lastUpdated"
              :title="item.title"
            />
          </div>
          <div v-else class="flex w-full items-center justify-center gap-2 p-4">
            <UIcon class="size-5" name="i-lucide-frown" />
            <p>{{ t('main.search.nothingFound') }}</p>
          </div>
        </div>
      </template>
    </UPopover>
    <BottomMenu />
  </div>
</template>
