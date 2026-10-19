export const locales = ['en', 'es', 'ar'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'en'

export const localeConfig: Record<
  Locale,
  { name: string; nativeName: string; dir: 'ltr' | 'rtl'; font: string }
> = {
  en: { name: 'English', nativeName: 'English', dir: 'ltr', font: 'Inter' },
  es: { name: 'Spanish', nativeName: 'Español', dir: 'ltr', font: 'Inter' },
  ar: { name: 'Arabic', nativeName: 'العربية', dir: 'rtl', font: 'IBM Plex Sans Arabic' },
}

export function isValidLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value)
}
