<script setup lang="ts">
  import type { ArticleContentItem, InfoBoxItem } from '../../types/types.ts';
  import { computed, onMounted } from 'vue';

  type InfoBoxChunk =
    | { type: 'label'; value: string }
    | { type: 'text'; value: ArticleContentItem[] }
    | { type: 'table'; value: InfoBoxItem['rows'] };

  const props = defineProps<{ item: InfoBoxItem }>();

  const columns = [
    {
      accessorKey: 'label',
      header: 'Label',
      meta: { class: { td: 'w-1/4', th: 'w-1/4' } },
    },
    {
      accessorKey: 'value',
      header: 'Value',
      meta: { class: { td: 'w-3/4', th: 'w-3/4' } },
    },
  ];

  const infoBoxChunks = computed(() => {
    const chunks: InfoBoxChunk[] = [];

    let tableChunk: { type: 'table'; value: InfoBoxItem['rows'] } | undefined =
      undefined;
    for (const row of props.item.rows) {
      if (row.label && row.value?.length) {
        if (!!tableChunk) tableChunk.value.push(row);
        else tableChunk = { type: 'table', value: [row] };
        continue;
      }
      if (tableChunk) {
        chunks.push(tableChunk);
        tableChunk = undefined;
      }
      if (row.label) chunks.push({ type: 'label', value: row.label });
      else if (row.value?.length)
        chunks.push({ type: 'text', value: row.value });
    }

    return chunks;
  });

  onMounted(() => console.log(props.item, infoBoxChunks.value));
</script>

<template>
  <UCard
    :ui="{
      body: 'flex flex-col gap-2 justify-center p-3',
    }"
    class="right-clear mb-3 w-full items-center lg:float-right lg:ml-6 lg:w-fit lg:max-w-1/3"
    variant="soft"
  >
    <template #header v-if="item.title">
      <ArticleHeading
        no-styling
        class="flex w-full justify-center py-0.5 text-center"
        :item="{ type: 'heading', level: 4, id: '', text: item.title }"
      />
    </template>

    <template :key="i" v-for="(chunk, i) in infoBoxChunks">
      <UTable
        v-if="chunk.type === 'table'"
        :columns="columns"
        :data="chunk.value"
        :ui="{ thead: 'hidden', td: 'align-top' }"
      >
        <template #label-cell="{ row }">
          <ArticleText
            v-if="row.original.label"
            :item="{ type: 'text', id: '', text: row.original.label }"
            class="h-full align-text-top font-semibold text-wrap"
            no-styling
          />
        </template>
        <template #value-cell="{ row }">
          <div
            v-if="row.original.value"
            class="flex flex-col items-start gap-2"
          >
            <ArticleItem
              no-styling
              :key="value.id"
              v-for="value in row.original.value"
              :item="value"
              class="text-left text-wrap"
              class-name="pl-0"
            />
          </div>
        </template>
      </UTable>

      <ArticleText
        v-if="chunk.type === 'label'"
        :item="{ type: 'text', id: '', text: chunk.value }"
        class="light:bg-neutral-100 flex w-full justify-center rounded-md py-2 text-center font-semibold dark:bg-neutral-800 dark:text-neutral-100"
        no-styling
      />
      <div
        v-if="chunk.type === 'text'"
        class="flex flex-col items-center gap-2"
      >
        <ArticleItem
          no-styling
          :key="value.id"
          v-for="value in chunk.value"
          :item="value"
          class="text-left text-wrap"
          class-name="pl-0"
        />
      </div>
    </template>
  </UCard>
</template>

<style scoped></style>
