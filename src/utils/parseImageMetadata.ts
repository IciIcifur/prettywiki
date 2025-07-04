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
  raw: { name: string; value: string }[]
): Omit<Picture, 'src'> {
  let rawMetadata: Record<string, string> = {};

  for (let field of raw) {
    if (allowedKeys.has(field.name)) rawMetadata[field.name] = field.value;
  }

  const splitLabel = rawMetadata.Label.split(', ');
  const date = new Date(
    rawMetadata.DateTimeOriginal.split(' ')[0].replace(/:/g, '-')
  ).toISOString();

  return {
    title: splitLabel[splitLabel.length - 1],
    date,
    description: rawMetadata.Label || '',
    author: rawMetadata.Artist,
    location: `${rawMetadata.CountryDest}, ${rawMetadata.ProvinceOrStateDest}, ${rawMetadata.CityDest}`,
  };
}
