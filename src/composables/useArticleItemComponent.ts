import type { ArticleContentItem } from '../types/types.ts';
import { type Component, computed } from 'vue';
import ArticleHeading from '../components/articlePage/articleHeading.vue';
import ArticleText from '../components/articlePage/articleText.vue';
import ArticleTable from '../components/articlePage/articleTable.vue';
import ArticleInfobox from '../components/articlePage/articleInfobox.vue';
import ArticleList from '../components/articlePage/articleList.vue';
import ArticlePicture from '../components/articlePage/articlePicture.vue';

const componentMap: Record<ArticleContentItem['type'], Component> = {
  heading: ArticleHeading,
  text: ArticleText,
  table: ArticleTable,
  infobox: ArticleInfobox,
  list: ArticleList,
  picture: ArticlePicture,
};

export default function useArticleItemComponent(item: ArticleContentItem) {
  const ItemComponent = computed<Component>(() => componentMap[item.type]);

  return { ItemComponent };
}
