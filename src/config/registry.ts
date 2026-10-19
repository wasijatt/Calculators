import type { Locale } from './i18n'

export type Category = {
  id: string
  /** slug differs per locale */
  slug: Record<Locale, string>
  icon: string // inline SVG path
}

export type CalculatorMeta = {
  id: string
  categoryId: string
  /** URL slug per locale */
  slug: Record<Locale, string>
  /** SEO title per locale  – TODO: native-speaker review */
  title: Record<Locale, string>
  /** SEO description per locale – TODO: native-speaker review */
  description: Record<Locale, string>
}

export const categories: Category[] = [
  {
    id: 'fitness',
    slug: { en: 'fitness', es: 'fitness', ar: 'لياقة' },
    icon: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z', // lightning bolt
  },
  // TODO: Add pregnancy, finance, math categories
]

export const calculators: CalculatorMeta[] = [
  {
    id: 'bmi',
    categoryId: 'fitness',
    slug: {
      en: 'bmi-calculator',
      es: 'calculadora-imc',
      ar: 'حاسبة-مؤشر-كتلة-الجسم',
    },
    title: {
      en: 'BMI Calculator – Body Mass Index',
      es: 'Calculadora de IMC – Índice de Masa Corporal',
      ar: 'حاسبة مؤشر كتلة الجسم',
    },
    description: {
      en: 'Calculate your Body Mass Index (BMI) and find out if your weight is healthy for your height.',
      es: 'Calcula tu Índice de Masa Corporal (IMC) y descubre si tu peso es saludable para tu estatura.', // TODO: native-speaker review
      ar: 'احسب مؤشر كتلة جسمك واكتشف ما إذا كان وزنك مناسباً لطولك.', // TODO: native-speaker review
    },
  },
  {
    id: 'calorie',
    categoryId: 'fitness',
    slug: {
      en: 'calorie-calculator',
      es: 'calculadora-calorias',
      ar: 'حاسبة-السعرات-الحرارية',
    },
    title: {
      en: 'Calorie Calculator – BMR & TDEE',
      es: 'Calculadora de Calorías – BMR y TDEE',
      ar: 'حاسبة السعرات الحرارية – BMR و TDEE',
    },
    description: {
      en: 'Calculate your Basal Metabolic Rate (BMR) and Total Daily Energy Expenditure (TDEE) to find your daily calorie needs.',
      es: 'Calcula tu Tasa Metabólica Basal (TMB) y el Gasto Energético Diario Total (GDET) para conocer tus necesidades calóricas.', // TODO: native-speaker review
      ar: 'احسب معدل الأيض الأساسي وإجمالي الإنفاق اليومي للطاقة لمعرفة احتياجاتك اليومية من السعرات الحرارية.', // TODO: native-speaker review
    },
  },
  {
    id: 'protein',
    categoryId: 'fitness',
    slug: {
      en: 'protein-calculator',
      es: 'calculadora-proteinas',
      ar: 'حاسبة-البروتين',
    },
    title: {
      en: 'Protein Intake Calculator',
      es: 'Calculadora de Ingesta de Proteínas',
      ar: 'حاسبة استهلاك البروتين',
    },
    description: {
      en: 'Find out how much protein you need daily based on your body weight, activity level and fitness goals.',
      es: 'Descubre cuánta proteína necesitas al día según tu peso, nivel de actividad y objetivos de fitness.', // TODO: native-speaker review
      ar: 'اعرف كمية البروتين التي تحتاجها يومياً بناءً على وزنك ومستوى نشاطك وأهدافك.', // TODO: native-speaker review
    },
  },
  {
    id: 'bodyfat',
    categoryId: 'fitness',
    slug: {
      en: 'body-fat-calculator',
      es: 'calculadora-grasa-corporal',
      ar: 'حاسبة-الدهون',
    },
    title: {
      en: 'Body Fat Percentage Calculator',
      es: 'Calculadora de Porcentaje de Grasa Corporal',
      ar: 'حاسبة نسبة الدهون في الجسم',
    },
    description: {
      en: 'Estimate your body fat percentage using the US Navy method based on your measurements.',
      es: 'Estima tu porcentaje de grasa corporal usando el método de la Marina de los EE.UU.', // TODO: native-speaker review
      ar: 'قدّر نسبة الدهون في جسمك باستخدام طريقة البحرية الأمريكية بناءً على قياساتك.', // TODO: native-speaker review
    },
  },
  {
    id: 'water',
    categoryId: 'fitness',
    slug: {
      en: 'water-intake-calculator',
      es: 'calculadora-agua',
      ar: 'حاسبة-شرب-الماء',
    },
    title: {
      en: 'Water Intake Calculator',
      es: 'Calculadora de Consumo de Agua',
      ar: 'حاسبة شرب الماء',
    },
    description: {
      en: 'Calculate how much water you should drink each day based on your weight, activity and climate.',
      es: 'Calcula cuánta agua deberías beber cada día según tu peso, actividad y clima.', // TODO: native-speaker review
      ar: 'احسب كمية الماء التي يجب أن تشربها يومياً بناءً على وزنك ونشاطك والمناخ.', // TODO: native-speaker review
    },
  },
  // TODO: Add pregnancy, finance, math calculators
]

/** Get all calculators for a given category */
export function getCalculatorsByCategory(categoryId: string): CalculatorMeta[] {
  return calculators.filter((c) => c.categoryId === categoryId)
}

/** Resolve a calculator from a slug+locale */
export function getCalculatorBySlug(slug: string, locale: Locale): CalculatorMeta | undefined {
  return calculators.find((c) => c.slug[locale] === slug)
}

/** Get the category by id */
export function getCategoryById(id: string): Category | undefined {
  return categories.find((c) => c.id === id)
}
