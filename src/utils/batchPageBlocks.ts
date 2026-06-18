import type { ArticleContentItem } from '../types/types.ts';

export default function batchPageBlocks(
  uiBlocks: ArticleContentItem[]
): ArticleContentItem[] {
  if (uiBlocks.length === 0) return uiBlocks;

  const batched: ArticleContentItem[] = [];

  let prevBlock: ArticleContentItem | null = null;

  for (const block of uiBlocks) {
    if (!prevBlock) {
      prevBlock = block;
      continue;
    }

    if (
      block.type === 'list' &&
      prevBlock.type === 'list' &&
      prevBlock.listType === block.listType
    ) {
      prevBlock.children = [...prevBlock.children, ...block.children];
      continue;
    }
    if (block.type === 'picture') {
      if (prevBlock.type === 'gallery') {
        prevBlock.children.push(block);
        continue;
      }
      if (prevBlock.type === 'picture') {
        prevBlock = {
          id: prevBlock.id,
          type: 'gallery',
          children: [prevBlock, block],
        };
        continue;
      }
    }

    if (prevBlock) batched.push(prevBlock);
    prevBlock = block;
  }
  if (prevBlock) batched.push(prevBlock);
  return batched;
}
