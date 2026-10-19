import type { Locale } from '@/config/i18n'
import { locales } from '@/config/i18n'
import { calculators } from '@/config/registry'

const SITE_URL = 'https://calcpro.app'

/** Generate hreflang alternates for a page. Pass calcId to get per-locale slugs. */
export function generateHreflangMeta(
  currentLocale: Locale,
  path: string, // e.g. '' for home, 'fitness/bmi-calculator' (current locale slug used only as fallback)
  calcId?: string,
  categorySlug?: Record<Locale, string>,
): {
  canonical: string
  languages: Record<string, string>
} {
  const languages: Record<string, string> = {}

  if (calcId && categorySlug) {
    // Calculator page — use per-locale slugs from registry
    const calc = calculators.find((c) => c.id === calcId)
    for (const locale of locales) {
      if (calc && categorySlug[locale]) {
        languages[locale] = `${SITE_URL}/${locale}/${categorySlug[locale]}/${calc.slug[locale]}`
      }
    }
  } else {
    // Category or home page
    for (const locale of locales) {
      languages[locale] = `${SITE_URL}/${locale}${path ? `/${path}` : ''}`
    }
  }

  languages['x-default'] = languages['en'] ?? `${SITE_URL}/en`

  return {
    canonical: languages[currentLocale] ?? `${SITE_URL}/${currentLocale}`,
    languages,
  }
}

/** Build JSON-LD WebApplication schema */
export function buildWebAppSchema(name: string, description: string, url: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name,
    description,
    url,
    applicationCategory: 'HealthApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  }
}

/** Build JSON-LD FAQPage schema */
export function buildFaqSchema(faqs: Array<{ q: string; a: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  }
}

/** Build JSON-LD BreadcrumbList schema */
export function buildBreadcrumbSchema(
  items: Array<{ name: string; url: string }>,
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  }
}
