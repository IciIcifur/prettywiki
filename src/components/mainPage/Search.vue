<script setup lang="ts">
  import { ref } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { debouncedWatch } from '@vueuse/core';
  import { SearchForPage } from '../../api/contentAPI.ts';

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
  <div class="flex w-full justify-end">
    <UPopover v-model:open="isResultOpen">
      <template #anchor>
        <UInput
          v-model="searchValue"
          :loading="isLoading"
          icon="i-lucide-search"
          variant="soft"
          color="error"
          :placeholder="t('main.search.placeholder')"
          size="xl"
          class="text-md w-full max-w-md"
        />
      </template>
      <template #content>
        <div class="h-fit w-sm overflow-clip rounded-md">
          <div
            v-if="searchResults.length"
            class="flex h-fit max-h-96 w-full flex-col overflow-y-scroll p-4"
          >
            <SearchResultCard
              v-for="item of searchResults"
              :title="item.title"
              :first-line="item.firstLine"
              :last-updated="item.lastUpdated"
            />
          </div>
          <div v-else class="flex w-full items-center justify-center gap-2 p-4">
            <UIcon name="i-lucide-frown" class="size-5" />
            <p>{{ t('main.search.nothingFound') }}</p>
          </div>
        </div>
      </template>
    </UPopover>
  </div>
</template>
