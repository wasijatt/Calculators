/** Calorie Calculator — BMR (Mifflin-St Jeor) + TDEE */

export type Sex = 'male' | 'female'

export type ActivityLevel =
  | 'sedentary'   // ×1.2
  | 'light'       // ×1.375
  | 'moderate'    // ×1.55
  | 'active'      // ×1.725
  | 'veryActive'  // ×1.9

export type Goal = 'lose' | 'maintain' | 'gain'

export type CalorieInput = {
  weightKg: number
  heightCm: number
  age: number
  sex: Sex
  activity: ActivityLevel
  goal: Goal
}

export type CalorieResult = {
  bmr: number
  tdee: number
  target: number
}

const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  veryActive: 1.9,
}

const GOAL_ADJUSTMENTS: Record<Goal, number> = {
  lose: -500,
  maintain: 0,
  gain: 300,
}

/** Mifflin-St Jeor BMR formula */
export function calculateBmr(
  weightKg: number,
  heightCm: number,
  age: number,
  sex: Sex,
): number {
  if (weightKg <= 0 || heightCm <= 0 || age <= 0) {
    throw new RangeError('Inputs must be positive')
  }
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age
  return Math.round(sex === 'male' ? base + 5 : base - 161)
}

export function calculateCalories(input: CalorieInput): CalorieResult {
  const bmr = calculateBmr(input.weightKg, input.heightCm, input.age, input.sex)
  const tdee = Math.round(bmr * ACTIVITY_MULTIPLIERS[input.activity])
  const target = Math.round(tdee + GOAL_ADJUSTMENTS[input.goal])
  return { bmr, tdee, target }
}
