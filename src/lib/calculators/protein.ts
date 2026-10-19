/** Protein Intake Calculator — ISSN guidelines */

export type ProteinActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'athlete'
export type ProteinGoal = 'lose' | 'maintain' | 'gain'

export type ProteinInput = {
  weightKg: number
  activity: ProteinActivityLevel
  goal: ProteinGoal
}

export type ProteinResult = {
  minGrams: number
  maxGrams: number
  minPerKg: number
  maxPerKg: number
}

// g/kg [min, max] indexed by [activity][goal]
const PROTEIN_RANGES: Record<ProteinActivityLevel, Record<ProteinGoal, [number, number]>> = {
  sedentary: { lose: [1.2, 1.6], maintain: [0.8, 1.2], gain: [1.4, 1.8] },
  light:     { lose: [1.4, 1.8], maintain: [1.0, 1.4], gain: [1.6, 2.0] },
  moderate:  { lose: [1.6, 2.0], maintain: [1.2, 1.6], gain: [1.8, 2.2] },
  active:    { lose: [1.8, 2.2], maintain: [1.4, 1.8], gain: [2.0, 2.4] },
  athlete:   { lose: [2.0, 2.4], maintain: [1.6, 2.0], gain: [2.2, 2.6] },
}

export function calculateProtein(input: ProteinInput): ProteinResult {
  if (input.weightKg <= 0) throw new RangeError('Weight must be positive')

  const [minPerKg, maxPerKg] = PROTEIN_RANGES[input.activity][input.goal]
  return {
    minGrams: Math.round(minPerKg * input.weightKg),
    maxGrams: Math.round(maxPerKg * input.weightKg),
    minPerKg,
    maxPerKg,
  }
}
