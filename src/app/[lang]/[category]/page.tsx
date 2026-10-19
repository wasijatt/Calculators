import type { Metadata } from 'next'
import type { PageProps } from 'next/types'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { locales, isValidLocale } from '@/config/i18n'
import { categories, getCalculatorsByCategory } from '@/config/registry'
import { getDictionaryForLocale } from '@/dictionaries'
import { generateHreflangMeta } from '@/lib/seo'

type Params = { lang: string; category: string }

// Generate all [lang]/[category] combinations
export async function generateStaticParams() {
  const params: Params[] = []
  for (const lang of locales) {
    for (const cat of categories) {
      params.push({ lang, category: cat.slug[lang] })
    }
  }
  return params
}

export async function generateMetadata(props: PageProps<'/[lang]/[category]'>): Promise<Metadata> {
  const { lang, category: categorySlug } = await props.params
  if (!isValidLocale(lang)) return {}
  const cat = categories.find((c) => c.slug[lang] === categorySlug)
  if (!cat) return {}
  const dict = await getDictionaryForLocale(lang)
  const nav = dict.nav as Record<string, string>
  const title = nav[cat.id] ?? cat.id
  const catSlugsPerLocale = cat.slug
  return {
    title,
    alternates: generateHreflangMeta(
      lang,
      catSlugsPerLocale[lang],
    ),
  }
}

export default async function CategoryPage(props: PageProps<'/[lang]/[category]'>) {
  const { lang, category: categorySlug } = await props.params
  if (!isValidLocale(lang)) notFound()

  const cat = categories.find((c) => c.slug[lang] === categorySlug)
  if (!cat) notFound()

  const dict = await getDictionaryForLocale(lang)
  const nav = dict.nav as Record<string, string>
  const common = dict.common as Record<string, string>
  const catName = nav[cat.id] ?? cat.id
  const calcs = getCalculatorsByCategory(cat.id)

  return (
    <div className="container section">
      {/* Breadcrumb */}
      <nav className="breadcrumb" aria-label="Breadcrumb" style={{ marginBottom: '2rem' }}>
        <Link href={`/${lang}`}>{(dict.nav as Record<string, string>).home}</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{catName}</span>
      </nav>

      <header style={{ marginBottom: '3rem' }}>
        <div className="category-chip" style={{ display: 'inline-flex', marginBottom: '1rem' }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d={cat.icon} />
          </svg>
          {catName}
        </div>
        <h1
          style={{
            fontSize: 'clamp(1.75rem, 4vw, 2.75rem)',
            fontWeight: 900,
            color: 'var(--text-primary)',
            margin: '0 0 0.75rem',
          }}
        >
          {catName}{' '}
          <span className="text-gradient">
            {lang === 'ar' ? 'الحاسبات' : lang === 'es' ? 'Calculadoras' : 'Calculators'}
          </span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.0625rem', maxWidth: 520, margin: 0 }}>
          {lang === 'ar'
            ? 'اختر الحاسبة التي تحتاجها من القائمة أدناه.'
            : lang === 'es'
              ? 'Elige la calculadora que necesitas de la lista a continuación.'
              : 'Choose the calculator you need from the list below.'}
        </p>
      </header>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1.25rem',
        }}
      >
        {calcs.map((calc) => (
          <Link
            key={calc.id}
            href={`/${lang}/${categorySlug}/${calc.slug[lang]}`}
            style={{ textDecoration: 'none' }}
          >
            <article
              className="card"
              style={{
                padding: '1.75rem',
                transition: 'transform 0.18s ease, box-shadow 0.18s ease',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)'
                ;(e.currentTarget as HTMLElement).style.boxShadow = '0 16px 40px rgba(99,102,241,0.14)'
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'
                ;(e.currentTarget as HTMLElement).style.boxShadow = 'var(--card-shadow)'
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 14,
                  background: 'var(--grad-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.125rem',
                }}
                aria-hidden="true"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4338CA" strokeWidth="2" strokeLinecap="round">
                  <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18" />
                </svg>
              </div>
              <h2 style={{ fontWeight: 700, fontSize: '1.0625rem', color: 'var(--text-primary)', margin: '0 0 0.5rem' }}>
                {calc.title[lang]}
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0 0 1.25rem', lineHeight: 1.65 }}>
                {calc.description[lang]}
              </p>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  color: '#3B82F6',
                }}
              >
                {lang === 'ar' ? 'احسب الآن' : lang === 'es' ? 'Calcular ahora' : 'Calculate now'}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true" style={{ transform: lang === 'ar' ? 'scaleX(-1)' : 'none' }}>
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </span>
            </article>
          </Link>
        ))}
      </div>
    </div>
  )
}
