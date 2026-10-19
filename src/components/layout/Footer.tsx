import Link from 'next/link'
import type { Locale } from '@/config/i18n'
import { locales, localeConfig } from '@/config/i18n'
import type { Category } from '@/config/registry'

type FooterProps = {
  lang: Locale
  dict: Record<string, unknown>
  categories: Category[]
}

type NavDict = { home: string; fitness: string; pregnancy: string; finance: string; math: string }
type FooterDict = { categories: string; languages: string; rights: string; disclaimer: string }
type CommonDict = { disclaimer: string }

export default function Footer({ lang, dict, categories }: FooterProps) {
  const nav = dict.nav as NavDict
  const footer = dict.footer as FooterDict
  const siteName = dict.siteName as string
  const year = new Date().getFullYear()

  return (
    <footer
      style={{
        borderTop: '1px solid var(--card-border)',
        background: 'rgba(248,250,255,0.9)',
        backdropFilter: 'blur(12px)',
        marginTop: '4rem',
        paddingBlock: '3rem 2rem',
        position: 'relative',
        zIndex: 1,
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '2rem',
            marginBottom: '2.5rem',
          }}
        >
          {/* Brand */}
          <div>
            <Link
              href={`/${lang}`}
              style={{ fontWeight: 800, fontSize: '1.125rem', textDecoration: 'none', display: 'block', marginBottom: '0.5rem' }}
            >
              <span className="text-gradient">{siteName}</span>
            </Link>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
              {dict.tagline as string}
            </p>
          </div>

          {/* Categories */}
          <div>
            <h3 style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.875rem', marginTop: 0 }}>
              {footer.categories}
            </h3>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {categories.map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/${lang}/${cat.slug[lang]}`}
                    style={{ fontSize: '0.875rem', color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.15s' }}
                  >
                    {nav[cat.id as keyof NavDict] ?? cat.id}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Languages */}
          <div>
            <h3 style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.875rem', marginTop: 0 }}>
              {footer.languages}
            </h3>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {locales.map((locale) => (
                <li key={locale}>
                  <Link
                    href={`/${locale}`}
                    lang={locale}
                    style={{
                      fontSize: '0.875rem',
                      color: locale === lang ? 'var(--text-primary)' : 'var(--text-muted)',
                      fontWeight: locale === lang ? 600 : 400,
                      textDecoration: 'none',
                      transition: 'color 0.15s',
                    }}
                  >
                    {localeConfig[locale].nativeName}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Disclaimer */}
        <div
          style={{
            background: 'rgba(99,102,241,0.04)',
            border: '1px solid var(--card-border)',
            borderRadius: 12,
            padding: '1rem 1.25rem',
            marginBottom: '1.5rem',
          }}
        >
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.7 }}>
            {footer.disclaimer}
          </p>
        </div>

        {/* Copyright */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
            © {year} {siteName}. {footer.rights}
          </p>
        </div>
      </div>
    </footer>
  )
}
