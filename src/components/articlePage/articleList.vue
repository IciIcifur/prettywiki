<script setup lang="ts">
  import type { ListItem } from '../../types/types.ts';
  import { computed, ref } from 'vue';
  import { useI18n } from 'vue-i18n';
  import cleanHTMLText from '../../utils/cleanHTMLText.ts';

  const { t } = useI18n();

  const MAX_VISIBLE_ITEMS = 10;
  const MIN_HIDDEN_ITEMS = 5;
  const props = defineProps<{ item: ListItem }>();

  const notEmptyChildren = computed(() =>
    props.item?.children.filter(
      (child) => !!cleanHTMLText(child.title).trim().length
    )
  );

  const canBeCollapsed = computed(
    () => notEmptyChildren.value.length - MAX_VISIBLE_ITEMS >= MIN_HIDDEN_ITEMS
  );
  const expanded = ref(!canBeCollapsed.value);

  const visibleChildren = computed(() =>
    notEmptyChildren.value
      .map((child, originalIndex) => ({ child, originalIndex }))
      .filter(({ originalIndex }) => indexVisible(originalIndex))
  );

  const firstPartLastIndex = computed(() =>
    expanded.value ? visibleChildren.value.length : MAX_VISIBLE_ITEMS / 2
  );

  const indexVisible = (index: number) => {
    if (expanded.value) return true;
    return !(
      index > MAX_VISIBLE_ITEMS / 2 - 1 &&
      index < notEmptyChildren.value.length - MAX_VISIBLE_ITEMS / 2 - 1
    );
  };
</script>

<template>
  <TransitionGroup
    :tag="item.listType === 'ordered' ? 'ol' : 'ul'"
    class="relative space-y-1.5 pl-6"
    name="list-item"
  >
    <li
      :key="`i-${originalIndex}`"
      v-for="{ child, originalIndex } in visibleChildren.slice(
        0,
        firstPartLastIndex
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
          {{ originalIndex + 1 }}.
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
        :key="`i-${originalIndex}`"
        v-for="{ child, originalIndex } in visibleChildren.slice(
          firstPartLastIndex
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
            {{ originalIndex + 1 }}.
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
  </TransitionGroup>
</template>

<style scoped>
  .list-item-enter-active,
  .list-item-leave-active {
    transition:
      opacity 0.2s ease,
      transform 0.2s ease;
  }
  .list-item-enter-from,
  .list-item-leave-to {
    opacity: 0;
    transform: translateY(-6px);
  }
  .list-item-leave-active {
    position: absolute;
    width: 100%;
  }
  .list-item-move {
    transition: transform 0.25s ease;
  }
</style>
