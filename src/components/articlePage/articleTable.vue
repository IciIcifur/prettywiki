<script setup lang="ts">
  import type { TableItem } from '../../types/types.ts';
  import { computed } from 'vue';
  import cleanHTMLText from '../../utils/cleanHTMLText.ts';

  const props = defineProps<{ item: TableItem }>();

  const filteredData = computed(() =>
    props.item.rows.filter((row) =>
      Object.values(row).some((cell) => cleanHTMLText(cell || '').trim())
    )
  );
</script>

<template>
  <UCard
    v-if="filteredData.length"
    :ui="{
      body: 'flex flex-col gap-2 justify-center p-3',
    }"
    class="my-3 items-center overflow-x-auto lg:ml-6"
    variant="soft"
  >
    <template #header v-if="item.title">
      <ArticleHeading
        no-styling
        :item="{ type: 'heading', level: 5, id: '', text: item.title }"
        class="flex w-full justify-center py-0.5 text-center font-semibold"
      />
    </template>
    <UTable :data="filteredData" :ui="{ td: 'align-top' }">
      <template
        :key="column"
        #[`${column}-cell`]="{ row }"
        v-for="column in item.columns"
      >
        <ArticleText
          v-if="cleanHTMLText(row.original[column] || '').trim()"
          no-styling
          :item="{ id: '', type: 'text', text: row.original[column] }"
          class="text-left text-wrap"
        />
      </template>
    </UTable>
  </UCard>
</template>

<style scoped></style>
