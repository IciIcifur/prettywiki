import type { ArticleSummary, Picture } from '../types/types.ts';
import type { RawContent } from '../types/apiTypes.ts';
import wtf from 'wtf_wikipedia';

const ruFieldsMap = {
  title: 'название',
  description: 'описание',
  image: 'изображение',
  summary: 'текст',
  width: 'ширина',
};

async function parseRevisions(
  revisions: string,
  locale: string,
  type: 'tfa' | 'tga' | 'tfi'
): Promise<Partial<ArticleSummary> | Picture> {
  if (type === 'tfi') {
    try {
      const cleanedWikitext =
        revisions.split('<div class="potd-recent"')[0] || revisions;
      const doc = wtf(cleanedWikitext);

      const imgMatch = cleanedWikitext.match(
        /\[\[(?:File|Image|Файл|Изображение):\s*([^|\]\n]+)/i
      );
      const fileName = imgMatch ? imgMatch[1].trim() : '';

      const src = fileName
        ? `https://en.wikipedia.org/wiki/Special:FilePath/${encodeURIComponent(fileName)}`
        : '';

      const firstLink = doc.links()[0];
      let title = 'Picture of the Day';

      if (firstLink) {
        title =
          (typeof firstLink.page === 'function'
            ? (firstLink as any).page()
            : firstLink.page) ||
          (firstLink as any).json?.()?.page ||
          'Picture of the Day';
      }

      const cleanParagraphs = doc
        .paragraphs()
        .map((p) => p.text().trim())
        .filter(
          (text) => text && !text.startsWith('{|') && !text.startsWith('|')
        );

      const fullText = cleanParagraphs[0] || '';

      const cleanFullText = fullText.replace(/<\/?[^>]+(>|$)/g, '').trim();
      let description = cleanFullText;
      let author = '';
      const creditParts = cleanFullText.split(/Photograph credit:\s*/i);
      if (creditParts.length > 1) {
        description = creditParts[0].trim();
        author = creditParts[1].trim();
      }

      return {
        src,
        title,
        description,
        author,
      };
    } catch (error) {
      console.error(error);
      return { title: '', description: '', summary: '' };
    }
  }

  const doc = wtf(revisions);

  if (locale === 'ru') {
    const templates = doc.templates();

    const articleTemplates = templates.filter((t) =>
      t.wiki?.toLowerCase().includes('заглавная/статья')
    );
    const selectedTemplate =
      type === 'tga'
        ? articleTemplates[Math.floor(Math.random() * 6)]
        : articleTemplates[0];

    if (selectedTemplate) {
      const data = selectedTemplate.json();

      const cleanSummary = data[ruFieldsMap.summary]
        ? wtf(data[ruFieldsMap.summary]).text()
        : '';

      return {
        title: data[ruFieldsMap.title] || '',
        description: data[ruFieldsMap.description] || '',
        image: data[ruFieldsMap.image],
        summary: cleanSummary.trim(),
      } as ArticleSummary;
    }
  }

  if (locale === 'en') {
    const templates = doc.templates();

    const articleTemplates = templates.filter((t) =>
      t.wiki?.toLowerCase().includes('заглавная/статья')
    );
    const selectedTemplate =
      type === 'tga'
        ? articleTemplates[Math.floor(Math.random() * 6)]
        : articleTemplates[0];

    if (selectedTemplate) {
      const data = selectedTemplate.json();

      console.log(data);
      const cleanSummary = data.summary ? wtf(data.summary.text()) : '';

      return {
        title: data.title || '',
        description: data.description || '',
        image: data.image,
        summary: cleanSummary.trim(),
      } as ArticleSummary;
    }
  }

  return { title: '', description: '', summary: '' };
}

function parseImages(images: string[]): string {
  console.log(images);
  return '';
}

export default async function parseTemplate(
  template: RawContent,
  locale: string,
  type: 'tfa' | 'tga' | 'tfi'
): Promise<ArticleSummary | Picture> {
  let article: ArticleSummary | Picture = {
    title: '',
    description: '',
    summary: '',
    image: '',
  };

  const { revisions, images } = template;

  if (revisions) article = await parseRevisions(revisions, locale, type);
  if (images && type !== 'tfi')
    article = { ...article, image: parseImages(images) };

  console.log(article);
  return article;
}
