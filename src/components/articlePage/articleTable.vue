<script setup lang="ts">
  import type { TableItem } from '../../types/types.ts';
  import { computed, onMounted } from 'vue';

  const props = defineProps<{ item: TableItem }>();

  const filteredData = computed(() =>
    props.item.rows.filter((row) => Object.values(row).some(Boolean))
  );

  const columns = computed(() => {
    let set = new Set();
    for (const row in props.item.rows) {
      console.log(Object.keys(row), row);
      Object.keys(row).forEach((column) => set.add(column));
    }

    return Array.from(set);
  });

  onMounted(() => console.log(props.item, columns.value));
</script>

<template>
  <UCard
    v-if="filteredData.length"
    :ui="{
      body: 'flex flex-col gap-2 justify-center p-3',
    }"
    class="my-3 items-center lg:ml-6"
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
        v-for="column in columns"
      >
        <div v-if="row.original.value" class="flex flex-col items-start gap-2">
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
  </UCard>
</template>

<style scoped></style>
