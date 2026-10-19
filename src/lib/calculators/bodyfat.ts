/** Body Fat Calculator — US Navy Circumference Method */

import type { Sex } from './calorie'

export type BodyfatInput = {
  sex: Sex
  heightCm: number
  neckCm: number
  waistCm: number
  hipCm?: number // required for female
}

export type BodyfatCategory =
  | 'essential'
  | 'athlete'
  | 'fitness'
  | 'acceptable'
  | 'obese'

export type BodyfatResult = {
  percentage: number
  fatMassKg?: number
  leanMassKg?: number
  category: BodyfatCategory
  weightKg?: number
}

const CATEGORY_RANGES = {
  male: [
    { max: 5, category: 'essential' as BodyfatCategory },
    { max: 13, category: 'athlete' as BodyfatCategory },
    { max: 17, category: 'fitness' as BodyfatCategory },
    { max: 24, category: 'acceptable' as BodyfatCategory },
  ],
  female: [
    { max: 13, category: 'essential' as BodyfatCategory },
    { max: 20, category: 'athlete' as BodyfatCategory },
    { max: 24, category: 'fitness' as BodyfatCategory },
    { max: 31, category: 'acceptable' as BodyfatCategory },
  ],
}

function log10(n: number) {
  return Math.log(n) / Math.log(10)
}

export function calculateBodyfat(
  input: BodyfatInput,
  weightKg?: number,
): BodyfatResult {
  const { sex, heightCm, neckCm, waistCm, hipCm } = input

  if (heightCm <= 0 || neckCm <= 0 || waistCm <= 0) {
    throw new RangeError('Measurements must be positive')
  }
  if (sex === 'female' && (!hipCm || hipCm <= 0)) {
    throw new RangeError('Hip measurement is required for female')
  }
  if (sex === 'male' && waistCm <= neckCm) {
    throw new RangeError('Waist must be greater than neck for male formula')
  }

  let percentage: number
  if (sex === 'male') {
    percentage =
      495 / (1.0324 - 0.19077 * log10(waistCm - neckCm) + 0.15456 * log10(heightCm)) - 450
  } else {
    percentage =
      495 / (1.29579 - 0.35004 * log10(waistCm + hipCm! - neckCm) + 0.221 * log10(heightCm)) -
      450
  }

  percentage = Math.round(percentage * 10) / 10

  const ranges = CATEGORY_RANGES[sex]
  const match = ranges.find((r) => percentage <= r.max)
  const category: BodyfatCategory = match?.category ?? 'obese'

  const result: BodyfatResult = { percentage, category }

  if (weightKg && weightKg > 0) {
    const fatMassKg = Math.round((percentage / 100) * weightKg * 10) / 10
    result.fatMassKg = fatMassKg
    result.leanMassKg = Math.round((weightKg - fatMassKg) * 10) / 10
    result.weightKg = weightKg
  }

  return result
}
