export default function getPageUrl(title: string = '') {
  const cleansedTitle = title?.replace(' ', '_').replace(/ /g, '_');
  return `/wiki/${cleansedTitle}`;
}
