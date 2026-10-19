import 'server-only'
import { lang } from 'next/root-params'
import { notFound } from 'next/navigation'
import type { Locale } from '@/config/i18n'
import { isValidLocale } from '@/config/i18n'

// Lazy-load each locale's common namespace
const commonDictionaries = {
  en: () => import('./en/common.json').then((m) => m.default),
  es: () => import('./es/common.json').then((m) => m.default),
  ar: () => import('./ar/common.json').then((m) => m.default),
} as const

export async function getLocale(): Promise<Locale> {
  const locale = await lang()
  if (!isValidLocale(locale)) notFound()
  return locale
}

export async function getDictionary() {
  const locale = await getLocale()
  return commonDictionaries[locale]()
}

export async function getDictionaryForLocale(locale: Locale) {
  return commonDictionaries[locale]()
}

// Calculator-specific dictionaries loaded on demand
const calcDictionaries = {
  bmi: {
    en: () => import('./en/bmi.json').then((m) => m.default),
    es: () => import('./es/bmi.json').then((m) => m.default),
    ar: () => import('./ar/bmi.json').then((m) => m.default),
  },
  calorie: {
    en: () => import('./en/calorie.json').then((m) => m.default),
    es: () => import('./es/calorie.json').then((m) => m.default),
    ar: () => import('./ar/calorie.json').then((m) => m.default),
  },
  protein: {
    en: () => import('./en/protein.json').then((m) => m.default),
    es: () => import('./es/protein.json').then((m) => m.default),
    ar: () => import('./ar/protein.json').then((m) => m.default),
  },
  bodyfat: {
    en: () => import('./en/bodyfat.json').then((m) => m.default),
    es: () => import('./es/bodyfat.json').then((m) => m.default),
    ar: () => import('./ar/bodyfat.json').then((m) => m.default),
  },
  water: {
    en: () => import('./en/water.json').then((m) => m.default),
    es: () => import('./es/water.json').then((m) => m.default),
    ar: () => import('./ar/water.json').then((m) => m.default),
  },
} as const

export type CalcId = keyof typeof calcDictionaries

export async function getCalcDictionary(calcId: CalcId) {
  const locale = await getLocale()
  return calcDictionaries[calcId][locale]()
}
