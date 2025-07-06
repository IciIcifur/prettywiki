import type { Picture } from '../types/types.ts';

const allowedKeys = new Set([
  'Label',
  'Artist',
  'DateTimeOriginal',
  'CountryDest',
  'ProvinceOrStateDest',
  'CityDest',
]);

export default function ParseImageMetadata(
  raw: { name: string; value: string }[],
  rawTitle: string | undefined
): Omit<Picture, 'src'> {
  const rawMetadata: Record<string, string> = {};

  for (const field of raw) {
    if (allowedKeys.has(field.name)) rawMetadata[field.name] = field.value;
  }

  const splitLabel = rawMetadata.Label?.split(', ');
  const trimmedTitle = rawTitle
    ?.replace('File:', '')
    .split('.')
    .slice(0, -1)
    .join('.');

  const title = trimmedTitle
    ? trimmedTitle
    : splitLabel[splitLabel.length - 1] || '';
  const date = new Date(
    rawMetadata.DateTimeOriginal?.split(' ')[0].replace(/:/g, '-')
  ).toISOString();
  const description = rawMetadata.Label || trimmedTitle || undefined;
  const author = rawMetadata.Artist?.split('\n')[0];
  const location =
    [
      rawMetadata.CountryDest,
      rawMetadata.ProvinceOrStateDest,
      rawMetadata.CityDest,
    ]
      .filter(Boolean)
      .join(', ') || undefined;

  return {
    title,
    date,
    description: title === description ? undefined : description,
    author,
    location,
  };
}
