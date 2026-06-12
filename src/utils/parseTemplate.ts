import type { ArticleSummary } from '../types/types.ts';
import type { RawContent } from '../types/apiTypes.ts';

export default function parseTemplate(template: RawContent): ArticleSummary {
  const article: ArticleSummary = {
    title: '',
    description: '',
    summary: '',
    image: '',
  };

  const { revisions, images } = template;
  console.log(revisions, images);

  return article;
}
