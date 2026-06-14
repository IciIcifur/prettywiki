<script setup lang="ts">
  import type { ListItem } from '../../types/types.ts';
  import { computed, ref } from 'vue';
  import { useI18n } from 'vue-i18n';

  const { t } = useI18n();

  const MAX_VISIBLE_ITEMS = 10;
  const MIN_HIDDEN_ITEMS = 5;
  const props = defineProps<{ item: ListItem }>();

  const canBeCollapsed = computed(
    () => props.item.children.length - MAX_VISIBLE_ITEMS >= MIN_HIDDEN_ITEMS
  );
  const expanded = ref(!canBeCollapsed.value);

  const visibleChildren = computed(() =>
    expanded.value
      ? props.item.children
      : props.item.children
          .map((child, i) => (indexVisible(i) ? child : null))
          .filter((child) => child !== null)
  );

  const firstPartLastIndex = computed(() =>
    expanded.value ? visibleChildren.value.length : MAX_VISIBLE_ITEMS / 2
  );
  const secondPartFirstIndex = computed(() =>
    expanded.value ? 0 : visibleChildren.value.length - MAX_VISIBLE_ITEMS / 2
  );

  const indexVisible = (index: number) => {
    if (expanded.value) return true;
    return !(
      index > MAX_VISIBLE_ITEMS / 2 - 1 &&
      index < props.item.children.length - MAX_VISIBLE_ITEMS / 2 - 1
    );
  };
</script>

<template>
  <component
    :is="item.listType === 'ordered' ? 'ol' : 'ul'"
    class="space-y-1.5 pl-6"
  >
    <li
      :key="i"
      v-for="(child, i) in visibleChildren.slice(0, firstPartLastIndex)"
      class="flex flex-col"
    >
      <span class="flex items-start gap-2">
        <UIcon
          v-if="item.listType === 'bullet'"
          class="size-6 shrink-0 opacity-40"
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
          :key="j"
          v-for="(innerList, j) in child.children"
          :item="innerList"
        />
      </span>
    </li>

    <li v-if="canBeCollapsed" class="flex w-full justify-center">
      <USeparator>
        <UTooltip
          :text="
            t(
              expanded
                ? 'wiki.tooltips.collapseList'
                : 'wiki.tooltips.expandList'
            )
          "
        >
          <UButton
            @click.stop="expanded = !expanded"
            :class="expanded ? '' : 'rotate-90'"
            :icon="
              expanded
                ? 'i-lucide-chevrons-up'
                : 'i-lucide-chevrons-left-right-ellipsis'
            "
            class="rounded-full"
            size="xl"
            variant="ghost"
          />
        </UTooltip>
      </USeparator>
    </li>

    <template v-if="!expanded">
      <li
        :key="i"
        v-for="(child, i) in visibleChildren.slice(
          secondPartFirstIndex,
          visibleChildren.length
        )"
        class="flex flex-col"
      >
        <span class="flex items-start gap-2">
          <UIcon
            v-if="item.listType === 'bullet'"
            class="size-6 shrink-0 opacity-40"
            name="i-lucide-dot"
          />
          <span
            v-else
            class="size-6 shrink-0 text-center opacity-60 dark:opacity-40"
          >
            {{ item.children.length - MAX_VISIBLE_ITEMS / 2 + i + 1 }}.
          </span>
          <ArticleText
            no-styling
            :item="{ id: '', type: 'text', text: child.title }"
          />
        </span>
        <span v-if="child.children.length">
          <ArticleList
            :key="j"
            v-for="(innerList, j) in child.children"
            :item="innerList"
          />
        </span>
      </li>
    </template>
  </component>
</template>
