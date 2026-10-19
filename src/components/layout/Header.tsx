'use client'

import Link from 'next/link'
import { useState } from 'react'
import type { Locale } from '@/config/i18n'
import { locales, localeConfig } from '@/config/i18n'
import type { Category, CalculatorMeta } from '@/config/registry'

type HeaderProps = {
  lang: Locale
  dict: Record<string, unknown>
  calculators: CalculatorMeta[]
  categories: Category[]
}

type NavDict = {
  home: string
  fitness: string
  pregnancy: string
  finance: string
  math: string
}

export default function Header({ lang, dict, categories }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const nav = dict.nav as NavDict
  const siteName = dict.siteName as string

  const navLinks: { href: string; label: string }[] = [
    { href: `/${lang}`, label: nav.home },
    ...categories.map((cat) => ({
      href: `/${lang}/${cat.slug[lang]}`,
      label: nav[cat.id as keyof NavDict] ?? cat.id,
    })),
  ]

  return (
    <header className="site-header">
      <div className="container">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingBlock: '0.875rem',
            gap: '1rem',
          }}
        >
          {/* Logo */}
          <Link
            href={`/${lang}`}
            style={{
              fontWeight: 800,
              fontSize: '1.25rem',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
            aria-label={siteName}
          >
            <span
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: 'var(--grad-primary)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
              aria-hidden="true"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18" />
              </svg>
            </span>
            <span className="text-gradient">{siteName}</span>
          </Link>

          {/* Desktop Nav */}
          <nav aria-label="Primary" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <div className="desktop-nav">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{
                    padding: '0.375rem 0.875rem',
                    borderRadius: 9999,
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: 'var(--text-secondary)',
                    textDecoration: 'none',
                    transition: 'background 0.15s, color 0.15s',
                  }}
                  className="nav-link"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Language Switcher */}
            <div style={{ display: 'flex', gap: '0.25rem', marginInlineStart: '0.75rem', borderInlineStart: '1px solid var(--card-border)', paddingInlineStart: '0.75rem' }}>
              {locales.map((locale) => (
                <Link
                  key={locale}
                  href={`/${locale}`}
                  lang={locale}
                  aria-label={`Switch to ${localeConfig[locale].nativeName}`}
                  aria-current={locale === lang ? 'true' : undefined}
                  style={{
                    padding: '0.25rem 0.625rem',
                    borderRadius: 9999,
                    fontSize: '0.75rem',
                    fontWeight: locale === lang ? 700 : 500,
                    textDecoration: 'none',
                    background: locale === lang ? 'var(--grad-primary)' : 'transparent',
                    color: locale === lang ? '#fff' : 'var(--text-muted)',
                    transition: 'background 0.15s, color 0.15s',
                  }}
                >
                  {locale.toUpperCase()}
                </Link>
              ))}
            </div>

            {/* Mobile menu button */}
            <button
              className="mobile-menu-btn btn-ghost"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-expanded={menuOpen}
              aria-label="Toggle menu"
              style={{ marginInlineStart: '0.5rem' }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                {menuOpen ? (
                  <>
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </>
                ) : (
                  <>
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <line x1="3" y1="12" x2="21" y2="12" />
                    <line x1="3" y1="18" x2="21" y2="18" />
                  </>
                )}
              </svg>
            </button>
          </nav>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <nav aria-label="Mobile navigation" style={{ paddingBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                style={{
                  padding: '0.625rem 0.875rem',
                  borderRadius: 12,
                  fontSize: '0.9375rem',
                  fontWeight: 500,
                  color: 'var(--text-secondary)',
                  textDecoration: 'none',
                }}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}
      </div>

      <style>{`
        @media (min-width: 768px) { .mobile-menu-btn { display: none !important; } }
        @media (max-width: 767px) { .desktop-nav { display: none !important; } }
        .desktop-nav { display: flex; align-items: center; gap: 0.125rem; }
        .nav-link:hover { background: rgba(99,102,241,0.07) !important; color: var(--text-primary) !important; }
      `}</style>
    </header>
  )
}
