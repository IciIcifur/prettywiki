<script setup lang="ts">
  import StyledImage from '../StyledImage.vue';

  defineProps<{ articleType: 'featured' | 'good' | 'image' | 'facts' }>();
</script>

<template>
  <div class="flex w-full flex-col gap-2">
    <USkeleton class="h-8 w-1/2" />
    <USkeleton class="h-6 w-full" />
  </div>
  <div
    :class="articleType === 'image' ? 'flex flex-col gap-2' : 'sm:flex-row'"
    class="flex h-full w-full flex-col gap-2 pt-1"
  >
    <StyledImage
      v-if="articleType !== 'facts'"
      :alt="''"
      :class="articleType !== 'image' && 'sm:mr-4 sm:mb-1'"
      :full-width="articleType === 'image'"
      :src="''"
      class="h-fit w-full sm:float-left"
    />

    <template v-if="articleType !== 'image'">
      <div class="flex h-fit w-full flex-col gap-2">
        <USkeleton :key="_" v-for="_ in [1, 2, 3, 4]" class="h-20 w-full" />
      </div>
    </template>

    <div v-else class="flex items-start justify-between gap-4">
      <div class="flex flex-col gap-4">
        <USkeleton class="h-8 w-32" />

        <USkeleton class="h-8 w-48" />
      </div>
      <USkeleton class="h-8 w-40" />
    </div>
  </div>
</template>

<style scoped></style>
