import { Language } from './LanguageContext';

export function getLocalizedValue(
  language: Language,
  frValue?: string | null,
  enValue?: string | null
): string {
  const primary = language === 'en' ? enValue : frValue;
  const fallback = language === 'en' ? frValue : enValue;
  return (primary ?? fallback ?? '').toString();
}

export function getLocalizedList(
  language: Language,
  frList?: string[] | null,
  enList?: string[] | null
): string[] {
  if (language === 'en') {
    return enList ?? frList ?? [];
  }
  return frList ?? enList ?? [];
}
