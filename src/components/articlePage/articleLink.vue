<script setup lang="ts">
  import { computed } from 'vue';
  import { useRoute } from 'vue-router';

  const props = defineProps<{ href: string; title?: string; text: string }>();
  const route = useRoute();
  const isSamePage = computed(() => {
    const hrefLastSegment = props.href.split('/').pop();
    const routeLastSegment = route.path.split('/').pop();
    return routeLastSegment
      ? hrefLastSegment?.includes(routeLastSegment)
      : false;
  });
</script>

<template>
  <UTooltip
    v-if="!isSamePage"
    :content="{
      align: 'start',
      side: 'top',
    }"
    :disabled="!title"
    :text="title"
  >
    <ULink :to="href"><span v-html="text" class="text-nowrap" /></ULink>
  </UTooltip>
  <span v-else v-html="text" />
</template>
