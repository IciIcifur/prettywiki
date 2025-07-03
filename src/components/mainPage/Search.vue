<script setup lang="ts">
  import { reactive, ref } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { debouncedWatch } from '@vueuse/core';

  const { t } = useI18n();

  const searchValue = ref('');
  const isLoading = ref(false);
  const isResultOpen = ref(false);

  const searchResults = reactive<
    { title: string; firstLine: string; url: string }[]
  >([
    {
      title: 'Римская империя',
      firstLine:
        'Ри́мская импе́рия (лат. Imperium Romanum, греч. Βασιλεία Ῥωμαίων) — постреспубликанский период истории Древнего Рима. Как государство Римская империя включала большие территориальные владения вокруг Средиземного моря в Европе,',
      url: '/',
    },
    {
      title: 'Римская империя',
      firstLine:
        'Ри́мская импе́рия (лат. Imperium Romanum, греч. Βασιλεία Ῥωμαίων) — постреспубликанский период истории Древнего Рима. Как государство Римская империя включала большие территориальные владения вокруг Средиземного моря в Европе,',
      url: '/login',
    },
  ]);

  debouncedWatch(
    searchValue,
    () => {
      isResultOpen.value = false;
      isLoading.value = true;

      setTimeout(() => {
        isLoading.value = false;
        isResultOpen.value = true;
      }, 1000);
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
        <div class="h-fit w-sm sm:w-md">
          <div
            v-if="searchResults.length"
            class="flex h-fit max-h-80 w-full flex-col p-4"
          >
            <SearchResultCard
              v-for="item of searchResults"
              :title="item.title"
              :first-line="item.firstLine"
              :url="item.url"
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
