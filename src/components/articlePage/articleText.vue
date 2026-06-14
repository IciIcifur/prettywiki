<script setup lang="ts">
  import type { TextItem } from '../../types/types.ts';
  import { computed } from 'vue';

  type TextChunk =
    | { type: 'text'; text: string }
    | { type: 'link'; href: string; title: string; text: string };

  const JUNK_ATTRS_REGEX = /\s(?:id|about|typeof|rel|data-[\w-]+)="[^"]*"/g;
  const SUP_REGEX = /<sup[^>]*>.*?<\/sup>/gs;
  const SPAN_REGEX = /<span(?![^>]*\bstyle\b)[^>]*>(.*?)<\/span>/gs;
  const LINKS_REGEX = /<a\s([^>]*)>(.*?)<\/a>/gs;
  const IMG_REGEX = /<img[^>]*\/?>/g;

  const props = defineProps<{
    item: TextItem;
    noStyling?: boolean;
    class?: string;
  }>();

  function splitByLinks(html: string): TextChunk[] {
    LINKS_REGEX.lastIndex = 0;
    const chunks: TextChunk[] = [];

    let lastIndex = 0;
    let match;

    while ((match = LINKS_REGEX.exec(html)) !== null) {
      if (match.index > lastIndex) {
        chunks.push({ type: 'text', text: html.slice(lastIndex, match.index) });
      }

      const attrs = match[1];
      chunks.push({
        type: 'link',
        href: /href="([^"]*)"/.exec(attrs)?.[1] ?? '',
        title: /title="([^"]*)"/.exec(attrs)?.[1] ?? '',
        text: match[2],
      });

      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < html.length) {
      chunks.push({ type: 'text', text: html.slice(lastIndex) });
    }

    return chunks;
  }

  function purifyText(text: string) {
    text = text.replace(SUP_REGEX, '');
    text = text.replace(IMG_REGEX, '');
    text = text.replace(JUNK_ATTRS_REGEX, '');

    let prev = text;
    let result = text.replace(SPAN_REGEX, '$1');
    while (result !== prev) {
      prev = result;
      result = result.replace(SPAN_REGEX, '$1');
    }
    return result;
  }

  const cleanText = computed(() => purifyText(props.item.text));
  const textChunks = computed(() => splitByLinks(cleanText.value));
</script>

<template>
  <p
    v-if="textChunks.length && textChunks[0].text.length"
    :class="`${noStyling ? '' : 'pb-1 indent-6'} ${props.class || ''}`"
    class="styled-links"
  >
    <template :key="i" v-for="(chunk, i) in textChunks">
      <span v-if="chunk.type === 'text'" v-html="chunk.text" />
      <ArticleLink
        :key="i"
        v-if="chunk.type === 'link'"
        :href="chunk.href"
        :text="chunk.text"
        :title="chunk.title"
      />
    </template>
  </p>
</template>
