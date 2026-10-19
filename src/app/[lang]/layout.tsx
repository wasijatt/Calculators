import type { Metadata } from 'next'
import type { LayoutProps } from 'next/types'
import { Inter, IBM_Plex_Sans_Arabic } from 'next/font/google'
import { notFound } from 'next/navigation'
import { locales, localeConfig, isValidLocale } from '@/config/i18n'
import { calculators, categories } from '@/config/registry'
import { getDictionaryForLocale } from '@/dictionaries'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import '../globals.css'

const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-inter',
})

const ibmPlexArabic = IBM_Plex_Sans_Arabic({
  subsets: ['arabic'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-arabic',
})

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }))
}

export async function generateMetadata(
  props: LayoutProps<'/[lang]'>,
): Promise<Metadata> {
  const { lang } = await props.params
  if (!isValidLocale(lang)) return {}
  const dict = await getDictionaryForLocale(lang)
  return {
    metadataBase: new URL('https://calcpro.app'),
    title: { default: dict.siteName, template: `%s | ${dict.siteName}` },
    description: dict.tagline,
    robots: { index: true, follow: true },
  }
}

export default async function LangLayout(
  props: LayoutProps<'/[lang]'> & { children: React.ReactNode },
) {
  const { lang } = await props.params

  if (!isValidLocale(lang)) notFound()

  const config = localeConfig[lang]
  const dict = await getDictionaryForLocale(lang)

  // Build alternate locale URLs for hreflang — used in Header and passed down
  const hreflangAlternates = locales.reduce(
    (acc, l) => {
      acc[l] = `/${l}`
      return acc
    },
    {} as Record<string, string>,
  )

  const fontClass = lang === 'ar' ? ibmPlexArabic.variable : inter.variable

  return (
    <html
      lang={lang}
      dir={config.dir}
      className={`${fontClass} ${inter.variable}`}
    >
      <head>
        {/* hreflang links */}
        {locales.map((l) => (
          <link
            key={l}
            rel="alternate"
            hrefLang={l}
            href={`https://calcpro.app/${l}`}
          />
        ))}
        <link rel="alternate" hrefLang="x-default" href="https://calcpro.app/en" />
        <link rel="canonical" href={`https://calcpro.app/${lang}`} />
      </head>
      <body
        style={{
          fontFamily:
            lang === 'ar'
              ? 'var(--font-arabic), var(--font-inter), system-ui, sans-serif'
              : 'var(--font-inter), system-ui, sans-serif',
        }}
      >
        <a href="#main-content" className="skip-link">
          {lang === 'ar' ? 'تخطى إلى المحتوى الرئيسي' : lang === 'es' ? 'Ir al contenido principal' : 'Skip to main content'}
        </a>
        <div className="blob blob-1" aria-hidden="true" />
        <div className="blob blob-2" aria-hidden="true" />
        <Header lang={lang} dict={dict} calculators={calculators} categories={categories} />
        <main id="main-content" style={{ position: 'relative', zIndex: 1 }}>
          {props.children}
        </main>
        <Footer lang={lang} dict={dict} categories={categories} />
      </body>
    </html>
  )
}
