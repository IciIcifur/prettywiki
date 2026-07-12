const STRIP_ATTRS_REGEX =
  /\s(?!(?:style|href|title)\b)[a-z][a-z0-9-]*\s*=\s*(?:"[^"]*"|'[^']*')/gi;
const EMPTY_TAG_REGEX = /<([a-z][a-z0-9]*)[^>]*>\s*<\/\1>/gi;
const SUP_REGEX = /<sup[^>]*>.*?<\/sup>/gs;
const SPAN_REGEX = /<span(?![^>]*\bstyle\b)[^>]*>(.*?)<\/span>/gs;
const IMG_REGEX = /<img[^>]*\/?>/g;

export default function cleanHTMLText(text: string) {
  text = text.replace(SUP_REGEX, '');
  text = text.replace(IMG_REGEX, '');
  text = text.replace(/↑/g, '');

  text = text.replace(STRIP_ATTRS_REGEX, '');

  let prev = '';
  while (prev !== text) {
    prev = text;
    text = text.replace(SPAN_REGEX, '$1');
  }

  prev = '';
  while (prev !== text) {
    prev = text;
    text = text.replace(EMPTY_TAG_REGEX, '');
  }

  return text;
}
