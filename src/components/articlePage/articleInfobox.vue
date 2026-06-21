<script setup lang="ts">
  import type { ArticleContentItem, InfoBoxItem } from '../../types/types.ts';
  import { computed, onMounted, watch } from 'vue';

  type InfoBoxChunk =
    | { type: 'label'; value: string }
    | { type: 'text'; value: ArticleContentItem[] }
    | { type: 'table'; value: InfoBoxItem['rows'] };

  const props = defineProps<{ item: InfoBoxItem }>();

  const columns = [
    {
      accessorKey: 'label',
      header: 'Label',
      meta: { class: { td: 'w-fit', th: 'w-fit' } },
    },
    {
      accessorKey: 'value',
      header: 'Value',
      meta: { class: { td: 'w-full', th: 'w-full' } },
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

  onMounted(() => console.log(infoBoxChunks.value));
</script>

<template>
  <UCard
    :ui="{
      body: 'flex flex-col gap-2 justify-center p-3',
    }"
    class="right-clear mb-3 w-full items-center lg:float-right lg:ml-6 lg:w-fit"
    variant="soft"
  >
    <template #header v-if="item.title">
      <h4 class="w-full text-center">{{ item.title }}</h4>
    </template>

    <template :key="i" v-for="(chunk, i) in infoBoxChunks">
      <UTable
        v-if="chunk.type === 'table'"
        :columns="columns"
        :data="chunk.value"
        :ui="{ thead: 'hidden', td: 'align-top' }"
      >
        <template #label-cell="{ row }">
          <p v-if="row.original.label" class="h-full align-text-top font-bold">
            {{ row.original.label }}
          </p>
        </template>
        <template #value-cell="{ row }">
          <div
            v-if="row.original.value"
            class="flex w-full flex-col items-start gap-2"
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

      <p v-if="chunk.type === 'label'" class="w-full text-center font-bold">
        {{ chunk.value }}
      </p>

      <div
        v-if="chunk.type === 'text'"
        class="flex w-full flex-col items-center gap-2"
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
