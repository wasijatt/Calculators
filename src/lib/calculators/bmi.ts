/** BMI Calculator — pure functions, unit-system agnostic */

export type BmiInput = {
  weightKg: number
  heightCm: number
}

export type BmiResult = {
  bmi: number
  category: 'underweight' | 'healthy' | 'overweight' | 'obese'
}

/** Convert imperial to metric */
export function imperialToMetric(weightLb: number, heightFt: number, heightIn: number) {
  return {
    weightKg: weightLb * 0.453592,
    heightCm: (heightFt * 12 + heightIn) * 2.54,
  }
}

/** Calculate BMI using metric units */
export function calculateBmi({ weightKg, heightCm }: BmiInput): BmiResult {
  if (weightKg <= 0 || heightCm <= 0) throw new RangeError('Weight and height must be positive')

  const heightM = heightCm / 100
  const bmi = weightKg / (heightM * heightM)
  const rounded = Math.round(bmi * 10) / 10

  let category: BmiResult['category']
  if (rounded < 18.5) category = 'underweight'
  else if (rounded < 25) category = 'healthy'
  else if (rounded < 30) category = 'overweight'
  else category = 'obese'

  return { bmi: rounded, category }
}
