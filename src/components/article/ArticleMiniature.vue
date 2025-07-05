<script setup lang="ts">
  import type { ArticleSummary, Picture } from '../../types/types.ts';
  import { computed } from 'vue';
  import StyledImage from '../StyledImage.vue';
  import { useI18n } from 'vue-i18n';
  import ArticleSkeleton from './ArticleSkeleton.vue';

  const props = defineProps<{
    article: ArticleSummary | Picture | string[] | undefined;
    articleType: 'featured' | 'good' | 'image' | 'facts';
    colSpan: 2 | 3 | 5;
    isLoading: boolean;
  }>();

  const i18n = useI18n();

  const articleState = computed(() => {
    if (props.article) {
      const hasTitle = 'title' in props.article;
      const hasDescription = 'description' in props.article;
      const hasImage =
        'src' in props.article ||
        ('image' in props.article && props.article.image);

      const imageSrc =
        'src' in props.article ? props.article.src : props.article.image;
      return { hasTitle, hasDescription, hasImage, imageSrc };
    }
    return undefined;
  });

  const imageDate = computed(() => {
    if ('date' in props.article && props.article.date) {
      return new Date(props.article.date).toLocaleDateString(
        i18n.locale.value,
        { dateStyle: 'long' }
      );
    }
    return undefined;
  });
</script>

<template>
  <UCard
    :class="`lg:col-span-${colSpan}`"
    :ui="{
      body: 'flex w-full h-fit flex-col gap-2 justify-center ',
    }"
    class="col-span-full h-fit"
    variant="soft"
  >
    <AricleMiniatureType :article-type="articleType" />

    <template v-if="!isLoading && articleState">
      <template v-if="articleType !== 'facts'">
        <div class="flex w-full flex-col gap-0">
          <h4 v-if="articleState.hasTitle" class="line-clamp-1">
            {{ article.title }}
          </h4>
          <p
            v-if="articleState.hasDescription"
            class="line-clamp-1 flex w-full text-sm text-neutral-500 italic"
          >
            {{ article.description }}
          </p>
        </div>
        <div
          :class="articleType === 'image' && 'flex flex-col items-center gap-2'"
          class="h-full w-full space-y-1"
        >
          <StyledImage
            v-if="articleState.hasImage"
            :alt="article.title"
            :class="articleType !== 'image' && 'sm:mr-4 sm:mb-1'"
            :full-width="articleType === 'image'"
            :src="articleState.imageSrc"
            class="h-fit w-fit sm:float-left"
          />
          <template v-if="articleType !== 'image' && article.summary">
            <p
              :key="index"
              v-for="(paragraph, index) in article.summary.split('\n')"
              class="indent-6"
            >
              {{ paragraph }}
            </p>
          </template>

          <div v-else class="flex w-full items-start justify-between gap-4">
            <div class="flex flex-col gap-2">
              <p v-if="imageDate" class="flex items-center gap-2">
                <UIcon
                  class="size-5 text-neutral-500"
                  name="i-lucide-calendar-days"
                />
                {{ imageDate }}
              </p>
              <p v-if="article.location" class="flex items-center gap-2">
                <UIcon
                  class="size-5 text-neutral-500"
                  name="i-lucide-map-pin"
                />
                {{ article.location }}
              </p>
            </div>
            <p
              v-if="article.author"
              class="flex items-center gap-2 font-medium"
            >
              <UIcon class="size-5 text-neutral-500" name="i-lucide-camera" />
              {{ article.author }}
            </p>
          </div>
        </div>
      </template>
      <ul v-else class="flex flex-col gap-4 pt-4">
        <IconParagraph
          :key="index"
          v-for="(fact, index) in article"
          :paragraph="fact"
        />
      </ul>
    </template>

    <ArticleSkeleton v-else :article-type="articleType" />
  </UCard>
</template>
