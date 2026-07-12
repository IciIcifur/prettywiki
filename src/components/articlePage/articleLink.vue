<script setup lang="ts">
  import { computed } from 'vue';
  import { useRoute } from 'vue-router';
  import getPageUrl from '../../utils/getPageUrl.ts';

  const props = defineProps<{ href: string; title?: string; text: string }>();
  const route = useRoute();

  const UNSUPPORTED_NAMESPACE_REGEX =
    /^(File|Файл|Image|Изображение|Category|Категория|Special|Служебная|Template|Шаблон|Portal|Портал|Talk|Обсуждение|Wikipedia|Википедия|Help|Справка|Media|Медиа):/i;

  const isExternal = computed(() => /^(https?:)?\/\//.test(props.href));
  const isAnchor = computed(() => props.href.startsWith('#'));

  const pageTitle = computed(() => {
    if (isExternal.value || isAnchor.value) return null;
    const raw = props.href
      .replace(/^\.?\//, '')
      .replace(/^wiki\//, '')
      .split('#')[0];
    try {
      return decodeURIComponent(raw);
    } catch {
      return raw;
    }
  });

  const isSupportedInternal = computed(
    () =>
      !!pageTitle.value && !UNSUPPORTED_NAMESPACE_REGEX.test(pageTitle.value)
  );

  const resolvedHref = computed(() => {
    if (isExternal.value) return props.href;
    if (isSupportedInternal.value) return getPageUrl(pageTitle.value!);
    return null;
  });

  const isSamePage = computed(() => {
    if (!resolvedHref.value || isExternal.value) return false;
    const hrefLastSegment = resolvedHref.value.split('/').pop();
    const routeLastSegment = route.path.split('/').pop();
    return routeLastSegment
      ? hrefLastSegment?.includes(routeLastSegment)
      : false;
  });
</script>

<template>
  <span v-if="!resolvedHref || isSamePage" v-html="text" />
  <UTooltip
    v-else
    :content="{
      align: 'start',
      side: 'top',
    }"
    :disabled="!title"
    :text="title"
  >
    <ULink
      :rel="isExternal ? 'noopener noreferrer' : undefined"
      :target="isExternal ? '_blank' : undefined"
      :to="resolvedHref"
    >
      <span v-html="text" class="truncate text-nowrap" />
    </ULink>
  </UTooltip>
</template>
