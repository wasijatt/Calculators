/** Water Intake Calculator */

export type WaterActivityLevel =
  | 'sedentary'
  | 'light'
  | 'moderate'
  | 'active'
  | 'veryActive'

export type Climate = 'temperate' | 'hot'

export type WaterInput = {
  weightKg: number
  activity: WaterActivityLevel
  climate: Climate
}

export type WaterResult = {
  liters: number
  glasses: number // 250 ml glasses
}

const ACTIVITY_EXTRA_ML: Record<WaterActivityLevel, number> = {
  sedentary: 0,
  light: 350,
  moderate: 600,
  active: 900,
  veryActive: 1200,
}

const CLIMATE_EXTRA_ML: Record<Climate, number> = {
  temperate: 0,
  hot: 500,
}

const BASE_ML_PER_KG = 35

export function calculateWater(input: WaterInput): WaterResult {
  if (input.weightKg <= 0) throw new RangeError('Weight must be positive')

  const totalMl =
    input.weightKg * BASE_ML_PER_KG +
    ACTIVITY_EXTRA_ML[input.activity] +
    CLIMATE_EXTRA_ML[input.climate]

  const liters = Math.round(totalMl / 100) / 10
  const glasses = Math.round(totalMl / 250)

  return { liters, glasses }
}
