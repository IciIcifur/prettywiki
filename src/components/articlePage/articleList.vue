<script setup lang="ts">
  import type { ListItem } from '../../types/types.ts';

  const props = defineProps<{ item: ListItem }>();
</script>

<template>
  <component
    :is="item.listType === 'ordered' ? 'ol' : 'ul'"
    class="space-y-1.5 pl-6"
  >
    <li :key="i" v-for="(child, i) in item.children" class="flex flex-col">
      <span class="flex items-start gap-2">
        <UIcon
          class="size-6 shrink-0 opacity-40"
          v-if="item.listType === 'bullet'"
          name="i-lucide-dot"
        />
        <span
          v-else
          class="size-6 shrink-0 text-center opacity-60 dark:opacity-40"
        >
          {{ i + 1 }}.
        </span>
        <ArticleText
          no-styling
          :item="{ id: '', type: 'text', text: child.title }"
        />
      </span>
      <span v-if="child.children.length">
        <ArticleList
          v-for="(innerList, j) in child.children"
          :key="j"
          :item="innerList"
        />
      </span>
    </li>
  </component>
</template>
