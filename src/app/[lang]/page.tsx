import type { Metadata } from 'next'
import type { PageProps } from 'next/types'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { locales, isValidLocale } from '@/config/i18n'
import { calculators, categories } from '@/config/registry'
import { getDictionaryForLocale } from '@/dictionaries'
import { generateHreflangMeta } from '@/lib/seo'

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }))
}

export async function generateMetadata(props: PageProps<'/[lang]'>): Promise<Metadata> {
  const { lang } = await props.params
  if (!isValidLocale(lang)) return {}
  const dict = await getDictionaryForLocale(lang)
  const home = dict.home as Record<string, string>
  return {
    title: dict.siteName as string,
    description: dict.tagline as string,
    alternates: generateHreflangMeta(lang, ''),
    openGraph: {
      title: dict.siteName as string,
      description: dict.tagline as string,
      locale: lang,
      type: 'website',
    },
  }
}

export default async function HomePage(props: PageProps<'/[lang]'>) {
  const { lang } = await props.params
  if (!isValidLocale(lang)) notFound()

  const dict = await getDictionaryForLocale(lang)
  const home = dict.home as Record<string, string>
  const nav = dict.nav as Record<string, string>
  const fitnessCats = categories.filter((c) => c.id === 'fitness')
  const fitnessCalcs = calculators.filter((c) => c.categoryId === 'fitness')

  return (
    <>
      {/* Hero */}
      <section
        style={{ paddingBlock: '5rem 4rem', textAlign: 'center' }}
        className="container"
      >
        <p
          className="category-chip"
          style={{ display: 'inline-flex', marginBottom: '1.5rem' }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
          CalcPro
        </p>

        <h1
          style={{
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            fontWeight: 900,
            lineHeight: 1.15,
            color: 'var(--text-primary)',
            margin: '0 0 1rem',
          }}
        >
          {home.hero}{' '}
          <span className="text-gradient">{home.heroAccent}</span>
        </h1>

        <p
          style={{
            fontSize: 'clamp(1rem, 2vw, 1.25rem)',
            color: 'var(--text-secondary)',
            maxWidth: '600px',
            margin: '0 auto 2.5rem',
            lineHeight: 1.7,
          }}
        >
          {home.heroSub}
        </p>

        <Link href={`/${lang}/fitness`} className="btn-primary" style={{ textDecoration: 'none' }}>
          {home.startCalculating}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>
      </section>

      {/* Popular Calculators */}
      <section className="container section" style={{ paddingTop: 0 }}>
        <h2
          style={{
            fontSize: '1.5rem',
            fontWeight: 800,
            color: 'var(--text-primary)',
            marginBottom: '1.5rem',
          }}
        >
          {home.popularCalcs}
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '1.25rem',
          }}
        >
          {fitnessCalcs.map((calc) => (
            <Link
              key={calc.id}
              href={`/${lang}/fitness/${calc.slug[lang]}`}
              style={{ textDecoration: 'none' }}
            >
              <article
                className="card"
                style={{
                  padding: '1.5rem',
                  transition: 'transform 0.18s ease, box-shadow 0.18s ease',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget
                  el.style.transform = 'translateY(-3px)'
                  el.style.boxShadow = '0 16px 40px rgba(99,102,241,0.14)'
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget
                  el.style.transform = 'translateY(0)'
                  el.style.boxShadow = 'var(--card-shadow)'
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: 'var(--grad-secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1rem',
                  }}
                  aria-hidden="true"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4338CA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18" />
                  </svg>
                </div>
                <h3
                  style={{
                    fontWeight: 700,
                    fontSize: '1rem',
                    color: 'var(--text-primary)',
                    margin: '0 0 0.375rem',
                  }}
                >
                  {calc.title[lang]}
                </h3>
                <p
                  style={{
                    fontSize: '0.8rem',
                    color: 'var(--text-muted)',
                    margin: 0,
                    lineHeight: 1.6,
                  }}
                >
                  {calc.description[lang]}
                </p>
                <div
                  style={{
                    marginTop: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    color: '#3B82F6',
                  }}
                >
                  {lang === 'ar' ? 'احسب الآن' : lang === 'es' ? 'Calcular' : 'Calculate'}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ transform: lang === 'ar' ? 'scaleX(-1)' : 'none' }}>
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </section>
    </>
  )
}
