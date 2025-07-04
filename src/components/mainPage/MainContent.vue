<script setup lang="ts">
  import { ref, watch } from 'vue';
  import { GetMaterialsOfTheDay } from '../../api/contentAPI.ts';
  import { useI18n } from 'vue-i18n';
  import type { MaterialsOfTheDay } from '../../types/types.ts';

  const i18n = useI18n();
  const content = ref<MaterialsOfTheDay | null>(null);

  watch(i18n.locale, async () => {
    const response = await GetMaterialsOfTheDay(i18n.locale.value);
    if (response) content.value = response;

    console.log(response);
  });
</script>

<template>
  <div class="flex flex-wrap gap-8">
    <!-- избранная статья -->
    <!-- избранная картинка -->
    <!-- а знаете ли вы? -->
    <!-- хорошая статья -->
  </div>
</template>
