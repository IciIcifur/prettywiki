export default function ParseFacts(
  rawText: string,
  locale: string
): string[] | null {
  try {
    return rawText
      .split('\n')
      .filter((line) =>
        locale === 'en' ? line.startsWith('* ...') : line.startsWith('*')
      )
      .slice(0, 10)
      .map(
        (line) =>
          line
            .replace('* ', '')
            .replace('... ', '...')
            .replace(/\{\{[\s\S]*?\}\}/g, '') // {{ }}
            .replace(/'''|''/g, '') // '''
      );
  } catch {
    return null;
  }
}
