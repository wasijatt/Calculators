import type { Metadata } from 'next'
import type { PageProps } from 'next/types'
import Link from 'next/link'
import Script from 'next/script'
import { notFound } from 'next/navigation'
import { locales, isValidLocale } from '@/config/i18n'
import { categories, calculators, getCalculatorsByCategory } from '@/config/registry'
import { getDictionaryForLocale, getCalcDictionary, type CalcId } from '@/dictionaries'
import { generateHreflangMeta, buildWebAppSchema, buildFaqSchema, buildBreadcrumbSchema } from '@/lib/seo'
import BmiCalculator from '@/components/calculators/BmiCalculator'
import CalorieCalculator from '@/components/calculators/CalorieCalculator'
import ProteinCalculator from '@/components/calculators/ProteinCalculator'
import BodyfatCalculator from '@/components/calculators/BodyfatCalculator'
import WaterCalculator from '@/components/calculators/WaterCalculator'

const SITE_URL = 'https://calcpro.app'

type Params = { lang: string; category: string; calc: string }

// Generate all lang × category × calc combinations
export async function generateStaticParams(): Promise<Params[]> {
  const params: Params[] = []
  for (const lang of locales) {
    for (const cat of categories) {
      for (const calc of calculators.filter((c) => c.categoryId === cat.id)) {
        params.push({
          lang,
          category: cat.slug[lang],
          calc: calc.slug[lang],
        })
      }
    }
  }
  return params
}

export async function generateMetadata(
  props: PageProps<'/[lang]/[category]/[calc]'>,
): Promise<Metadata> {
  const { lang, category: catSlug, calc: calcSlug } = await props.params
  if (!isValidLocale(lang)) return {}
  const cat = categories.find((c) => c.slug[lang] === catSlug)
  if (!cat) return {}
  const calcMeta = calculators.find((c) => c.categoryId === cat.id && c.slug[lang] === calcSlug)
  if (!calcMeta) return {}

  const href = generateHreflangMeta(lang, '', calcMeta.id, cat.slug)
  return {
    title: calcMeta.title[lang],
    description: calcMeta.description[lang],
    alternates: href,
    openGraph: {
      title: calcMeta.title[lang],
      description: calcMeta.description[lang],
      url: href.canonical,
      locale: lang,
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title: calcMeta.title[lang],
      description: calcMeta.description[lang],
    },
  }
}

// Map calculator id → client component
function getCalculatorComponent(calcId: string, lang: string, dict: Record<string, unknown>, common: Record<string, string>) {
  const props = { lang, dict, common }
  switch (calcId) {
    case 'bmi':     return <BmiCalculator {...props} />
    case 'calorie': return <CalorieCalculator {...props} />
    case 'protein': return <ProteinCalculator {...props} />
    case 'bodyfat': return <BodyfatCalculator {...props} />
    case 'water':   return <WaterCalculator {...props} />
    default:        return null
  }
}

export default async function CalculatorPage(
  props: PageProps<'/[lang]/[category]/[calc]'>,
) {
  const { lang, category: catSlug, calc: calcSlug } = await props.params
  if (!isValidLocale(lang)) notFound()

  const cat = categories.find((c) => c.slug[lang] === catSlug)
  if (!cat) notFound()

  const calcMeta = calculators.find((c) => c.categoryId === cat.id && c.slug[lang] === calcSlug)
  if (!calcMeta) notFound()

  const [common, calcDict] = await Promise.all([
    getDictionaryForLocale(lang),
    getCalcDictionary(calcMeta.id as CalcId),
  ])

  const commonDict = common.common as Record<string, string>
  const nav = common.nav as Record<string, string>
  const d = calcDict as Record<string, unknown>
  const faqDict = d.faq as Record<string, string>
  const href = generateHreflangMeta(lang, '', calcMeta.id, cat.slug)
  const pageUrl = href.canonical

  // Build FAQ array for JSON-LD
  const faqs = [1, 2, 3, 4, 5].map((n) => ({
    q: faqDict[`q${n}`] ?? '',
    a: faqDict[`a${n}`] ?? '',
  }))

  const relatedCalcs = getCalculatorsByCategory(cat.id).filter((c) => c.id !== calcMeta.id)

  // JSON-LD schemas
  const schemas = [
    buildWebAppSchema(calcMeta.title[lang], calcMeta.description[lang], pageUrl),
    buildFaqSchema(faqs),
    buildBreadcrumbSchema([
      { name: (common.nav as Record<string, string>).home, url: `${SITE_URL}/${lang}` },
      { name: nav[cat.id] ?? cat.id, url: `${SITE_URL}/${lang}/${catSlug}` },
      { name: calcMeta.title[lang], url: pageUrl },
    ]),
  ]

  return (
    <>
      {/* JSON-LD */}
      {schemas.map((schema, i) => (
        <Script key={i} id={`schema-${i}`} type="application/ld+json" strategy="beforeInteractive">
          {JSON.stringify(schema)}
        </Script>
      ))}

      <div className="container" style={{ paddingBlock: '2rem 4rem' }}>
        {/* Breadcrumb */}
        <nav className="breadcrumb" aria-label="Breadcrumb" style={{ marginBottom: '2rem' }}>
          <Link href={`/${lang}`}>{nav.home}</Link>
          <span aria-hidden="true">/</span>
          <Link href={`/${lang}/${catSlug}`}>{nav[cat.id] ?? cat.id}</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{calcMeta.title[lang]}</span>
        </nav>

        {/* 1. H1 */}
        <h1
          style={{
            fontSize: 'clamp(1.75rem, 4vw, 2.75rem)',
            fontWeight: 900,
            color: 'var(--text-primary)',
            lineHeight: 1.2,
            margin: '0 0 0.75rem',
          }}
        >
          {(d.h1 as string)}{' '}
          <span className="text-gradient">{d.h1Accent as string}</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.0625rem', maxWidth: 640, marginBottom: '2.5rem' }}>
          {d.intro as string}
        </p>

        {/* 2. Calculator (client component) */}
        {getCalculatorComponent(calcMeta.id, lang, d, commonDict)}

        {/* 3. Result interpretation + ranges table */}
        {(d.ranges as Record<string, string> | undefined) && (
          <section style={{ marginTop: '3rem' }}>
            <h2 style={{ fontSize: '1.375rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--text-primary)' }}>
              {commonDict.rangesTable}
            </h2>
            <div className="card" style={{ padding: '0.5rem', overflowX: 'auto' }}>
              <RangesTable lang={lang} d={d} />
            </div>
          </section>
        )}

        {/* 4. Formula */}
        {(d.formula as Record<string, string> | undefined) && (
          <section style={{ marginTop: '3rem' }}>
            <h2 style={{ fontSize: '1.375rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--text-primary)' }}>
              {commonDict.formula}
            </h2>
            <div className="card" style={{ padding: '1.5rem' }}>
              <FormulaSection d={d} />
            </div>
          </section>
        )}

        {/* 5. FAQ */}
        <section style={{ marginTop: '3rem' }}>
          <h2 style={{ fontSize: '1.375rem', fontWeight: 800, marginBottom: '1.5rem', color: 'var(--text-primary)' }}>
            {faqDict.title}
          </h2>
          <div className="card" style={{ padding: '0 1.5rem' }}>
            {faqs.filter(f => f.q).map((faq, i) => (
              <FaqItem key={i} question={faq.q} answer={faq.a} />
            ))}
          </div>
        </section>

        {/* 6. Related calculators */}
        {relatedCalcs.length > 0 && (
          <section style={{ marginTop: '3rem' }}>
            <h2 style={{ fontSize: '1.375rem', fontWeight: 800, marginBottom: '1.25rem', color: 'var(--text-primary)' }}>
              {(d.related as Record<string, string>).title}
            </h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
              {relatedCalcs.map((rc) => (
                <Link
                  key={rc.id}
                  href={`/${lang}/${catSlug}/${rc.slug[lang]}`}
                  className="btn-ghost"
                  style={{ textDecoration: 'none' }}
                >
                  {rc.title[lang]}
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* 7. Medical disclaimer */}
        <aside
          style={{
            marginTop: '3rem',
            padding: '1.25rem 1.5rem',
            background: 'rgba(239,68,68,0.04)',
            border: '1px solid rgba(239,68,68,0.12)',
            borderRadius: 12,
          }}
          role="note"
          aria-label={commonDict.disclaimer}
        >
          <h3 style={{ fontWeight: 700, fontSize: '0.9375rem', color: '#DC2626', marginBottom: '0.5rem', marginTop: 0 }}>
            ⚕️ {commonDict.disclaimer}
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.7 }}>
            {commonDict.disclaimerText}
          </p>
        </aside>
      </div>
    </>
  )
}

// ── Sub-components (server, no 'use client') ──────────────────────────

function RangesTable({ lang, d }: { lang: string; d: Record<string, unknown> }) {
  const ranges = d.ranges as Record<string, string>
  // BMI ranges table
  if ('underweight' in ranges) {
    const labels =
      lang === 'ar'
        ? { cat: 'الفئة', range: 'النطاق' }
        : lang === 'es'
          ? { cat: 'Categoría', range: 'Rango' }
          : { cat: 'Category', range: 'Range' }
    const rows = [
      { cat: lang === 'ar' ? 'نقص الوزن' : lang === 'es' ? 'Bajo peso' : 'Underweight', range: ranges.underweight, color: '#3B82F6' },
      { cat: lang === 'ar' ? 'وزن صحي' : lang === 'es' ? 'Saludable' : 'Healthy', range: ranges.healthy, color: '#10B981' },
      { cat: lang === 'ar' ? 'زيادة الوزن' : lang === 'es' ? 'Sobrepeso' : 'Overweight', range: ranges.overweight, color: '#F59E0B' },
      { cat: lang === 'ar' ? 'سمنة' : lang === 'es' ? 'Obesidad' : 'Obese', range: ranges.obese, color: '#EF4444' },
    ]
    return (
      <table className="ranges-table">
        <thead><tr><th>{labels.cat}</th><th>{labels.range}</th></tr></thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.cat}>
              <td style={{ fontWeight: 600, color: row.color }}>{row.cat}</td>
              <td>{row.range}</td>
            </tr>
          ))}
        </tbody>
      </table>
    )
  }
  // Body fat ranges table
  if ('essential' in ranges) {
    return (
      <ul style={{ listStyle: 'none', margin: 0, padding: '0.5rem 0.75rem' }}>
        {['essential','athlete','fitness','acceptable','obese'].map((key) => (
          ranges[key] ? <li key={key} style={{ padding: '0.5rem 0', fontSize: '0.875rem', color: 'var(--text-secondary)', borderBottom: '1px solid var(--card-border)' }}>{ranges[key]}</li> : null
        ))}
      </ul>
    )
  }
  return null
}

function FormulaSection({ d }: { d: Record<string, unknown> }) {
  const formula = d.formula as Record<string, string>
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
      {formula.metric && (
        <code style={{ display: 'block', background: 'rgba(99,102,241,0.06)', borderRadius: 8, padding: '0.75rem 1rem', fontSize: '0.9rem', color: 'var(--text-primary)', fontFamily: 'monospace' }}>
          {formula.metric}
        </code>
      )}
      {formula.imperial && (
        <code style={{ display: 'block', background: 'rgba(99,102,241,0.06)', borderRadius: 8, padding: '0.75rem 1rem', fontSize: '0.9rem', color: 'var(--text-primary)', fontFamily: 'monospace' }}>
          {formula.imperial}
        </code>
      )}
      {formula.male && (
        <code style={{ display: 'block', background: 'rgba(99,102,241,0.06)', borderRadius: 8, padding: '0.75rem 1rem', fontSize: '0.85rem', color: 'var(--text-primary)', fontFamily: 'monospace', wordBreak: 'break-all' }}>
          {formula.male}
        </code>
      )}
      {formula.female && (
        <code style={{ display: 'block', background: 'rgba(99,102,241,0.06)', borderRadius: 8, padding: '0.75rem 1rem', fontSize: '0.85rem', color: 'var(--text-primary)', fontFamily: 'monospace', wordBreak: 'break-all' }}>
          {formula.female}
        </code>
      )}
      <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.7 }}>
        {formula.explanation}
      </p>
    </div>
  )
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  return (
    <details className="faq-item" style={{ paddingInline: '0' }}>
      <summary className="faq-question">
        {question}
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true" style={{ flexShrink: 0 }}>
          <path d="M6 9l6 6 6-6" />
        </svg>
      </summary>
      <p className="faq-answer">{answer}</p>
    </details>
  )
}
