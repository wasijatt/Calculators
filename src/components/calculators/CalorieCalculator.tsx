'use client'

import { useState } from 'react'
import { calculateCalories, type Sex, type ActivityLevel, type Goal, type CalorieResult } from '@/lib/calculators/calorie'

type CalorieDict = {
  form: Record<string, string>
  result: Record<string, string>
}

type Props = { lang: string; dict: Record<string, unknown>; common: Record<string, string> }

export default function CalorieCalculator({ lang, dict }: Props) {
  const d = dict as unknown as CalorieDict
  const f = d.form || {}
  const r = d.result || {}

  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric')
  const [sex, setSex] = useState<Sex>('male')
  const [age, setAge] = useState('')
  const [weightKg, setWeightKg] = useState('')
  const [heightCm, setHeightCm] = useState('')
  const [weightLb, setWeightLb] = useState('')
  const [heightFt, setHeightFt] = useState('')
  const [heightIn, setHeightIn] = useState('')
  const [activity, setActivity] = useState<ActivityLevel>('moderate')
  const [goal, setGoal] = useState<Goal>('maintain')

  const [result, setResult] = useState<CalorieResult | null>(null)
  const [error, setError] = useState('')

  const isRtl = lang === 'ar'

  function calculate() {
    setError('')
    try {
      let finalWeightKg = parseFloat(weightKg)
      let finalHeightCm = parseFloat(heightCm)

      if (unit === 'imperial') {
        const lb = parseFloat(weightLb)
        const ft = parseFloat(heightFt)
        const inch = parseFloat(heightIn || '0')
        finalWeightKg = lb * 0.45359237
        finalHeightCm = (ft * 12 + inch) * 2.54
      }

      const ageNum = parseInt(age, 10)

      if (isNaN(finalWeightKg) || isNaN(finalHeightCm) || isNaN(ageNum)) {
        setError(
          lang === 'ar'
            ? 'يرجى ملء جميع الحقول المطلوبة'
            : lang === 'es'
              ? 'Por favor completa todos los campos requeridos'
              : 'Please fill in all required fields'
        )
        return
      }

      const res = calculateCalories({
        weightKg: finalWeightKg,
        heightCm: finalHeightCm,
        age: ageNum,
        sex,
        activity,
        goal,
      })
      setResult(res)
    } catch (e) {
      setError((e as Error).message)
    }
  }

  function reset() {
    setAge('')
    setWeightKg('')
    setHeightCm('')
    setWeightLb('')
    setHeightFt('')
    setHeightIn('')
    setActivity('moderate')
    setGoal('maintain')
    setResult(null)
    setError('')
  }

  return (
    <div className="card calc-layout" style={{ padding: '2rem', gap: '2rem' }}>
      {/* Form panel */}
      <div>
        {/* Unit toggle */}
        <div className="unit-toggle" style={{ marginBottom: '1.5rem' }} role="group" aria-label="Unit system">
          <button
            className="unit-tab"
            aria-pressed={unit === 'metric'}
            onClick={() => { setUnit('metric'); setResult(null) }}
            id="calorie-unit-metric"
          >
            {lang === 'ar' ? 'متري' : lang === 'es' ? 'Métrico' : 'Metric'}
          </button>
          <button
            className="unit-tab"
            aria-pressed={unit === 'imperial'}
            onClick={() => { setUnit('imperial'); setResult(null) }}
            id="calorie-unit-imperial"
          >
            {lang === 'ar' ? 'إمبراطوري' : lang === 'es' ? 'Imperial' : 'Imperial'}
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.125rem' }}>
          {/* Sex Selection */}
          <div>
            <label className="input-label">{f.sex || 'Sex'}</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              <button
                type="button"
                className={`btn-ghost ${sex === 'male' ? 'active-tab' : ''}`}
                style={{
                  justifyContent: 'center',
                  background: sex === 'male' ? 'rgba(99, 102, 241, 0.12)' : 'transparent',
                  borderColor: sex === 'male' ? 'var(--input-border)' : 'var(--card-border)',
                  fontWeight: sex === 'male' ? 600 : 500,
                  color: sex === 'male' ? 'var(--text-primary)' : 'var(--text-secondary)',
                }}
                onClick={() => { setSex('male'); setResult(null) }}
                id="calorie-sex-male"
              >
                {f.male || 'Male'}
              </button>
              <button
                type="button"
                className={`btn-ghost ${sex === 'female' ? 'active-tab' : ''}`}
                style={{
                  justifyContent: 'center',
                  background: sex === 'female' ? 'rgba(99, 102, 241, 0.12)' : 'transparent',
                  borderColor: sex === 'female' ? 'var(--input-border)' : 'var(--card-border)',
                  fontWeight: sex === 'female' ? 600 : 500,
                  color: sex === 'female' ? 'var(--text-primary)' : 'var(--text-secondary)',
                }}
                onClick={() => { setSex('female'); setResult(null) }}
                id="calorie-sex-female"
              >
                {f.female || 'Female'}
              </button>
            </div>
          </div>

          {/* Age */}
          <div>
            <label htmlFor="calorie-age" className="input-label">{f.age || 'Age'}</label>
            <input
              id="calorie-age"
              className="input"
              type="number"
              inputMode="numeric"
              min="10"
              max="120"
              placeholder={isRtl ? 'مثال: 28' : 'e.g. 28'}
              value={age}
              onChange={(e) => { setAge(e.target.value); setResult(null) }}
            />
          </div>

          {/* Height and Weight */}
          {unit === 'metric' ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label htmlFor="calorie-height-cm" className="input-label">{f.height || 'Height'} (cm)</label>
                <input
                  id="calorie-height-cm"
                  className="input"
                  type="number"
                  inputMode="decimal"
                  min="50"
                  max="280"
                  placeholder={isRtl ? '175' : '175'}
                  value={heightCm}
                  onChange={(e) => { setHeightCm(e.target.value); setResult(null) }}
                />
              </div>
              <div>
                <label htmlFor="calorie-weight-kg" className="input-label">{f.weight || 'Weight'} (kg)</label>
                <input
                  id="calorie-weight-kg"
                  className="input"
                  type="number"
                  inputMode="decimal"
                  min="20"
                  max="400"
                  placeholder={isRtl ? '70' : '70'}
                  value={weightKg}
                  onChange={(e) => { setWeightKg(e.target.value); setResult(null) }}
                />
              </div>
            </div>
          ) : (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label htmlFor="calorie-height-ft" className="input-label">{lang === 'ar' ? 'قدم' : lang === 'es' ? 'Pies' : 'Feet'}</label>
                  <input
                    id="calorie-height-ft"
                    className="input"
                    type="number"
                    inputMode="numeric"
                    min="1"
                    max="9"
                    placeholder="5"
                    value={heightFt}
                    onChange={(e) => { setHeightFt(e.target.value); setResult(null) }}
                  />
                </div>
                <div>
                  <label htmlFor="calorie-height-in" className="input-label">{lang === 'ar' ? 'بوصة' : lang === 'es' ? 'Pulgadas' : 'Inches'}</label>
                  <input
                    id="calorie-height-in"
                    className="input"
                    type="number"
                    inputMode="numeric"
                    min="0"
                    max="11"
                    placeholder="9"
                    value={heightIn}
                    onChange={(e) => { setHeightIn(e.target.value); setResult(null) }}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="calorie-weight-lb" className="input-label">{f.weight || 'Weight'} (lbs)</label>
                <input
                  id="calorie-weight-lb"
                  className="input"
                  type="number"
                  inputMode="decimal"
                  min="40"
                  placeholder="150"
                  value={weightLb}
                  onChange={(e) => { setWeightLb(e.target.value); setResult(null) }}
                />
              </div>
            </>
          )}

          {/* Activity Level */}
          <div>
            <label htmlFor="calorie-activity" className="input-label">{f.activity || 'Activity Level'}</label>
            <select
              id="calorie-activity"
              className="input"
              value={activity}
              onChange={(e) => { setActivity(e.target.value as ActivityLevel); setResult(null) }}
              style={{ cursor: 'pointer' }}
            >
              <option value="sedentary">{f.sedentary || 'Sedentary'}</option>
              <option value="light">{f.light || 'Lightly active'}</option>
              <option value="moderate">{f.moderate || 'Moderately active'}</option>
              <option value="active">{f.active || 'Very active'}</option>
              <option value="veryActive">{f.veryActive || 'Super active'}</option>
            </select>
          </div>

          {/* Goal */}
          <div>
            <label htmlFor="calorie-goal" className="input-label">{f.goal || 'Goal'}</label>
            <select
              id="calorie-goal"
              className="input"
              value={goal}
              onChange={(e) => { setGoal(e.target.value as Goal); setResult(null) }}
              style={{ cursor: 'pointer' }}
            >
              <option value="lose">{f.lose || 'Lose weight'}</option>
              <option value="maintain">{f.maintain || 'Maintain weight'}</option>
              <option value="gain">{f.gain || 'Gain muscle'}</option>
            </select>
          </div>
        </div>

        {error && (
          <p role="alert" style={{ color: 'var(--status-danger)', fontSize: '0.85rem', marginTop: '0.75rem' }}>
            {error}
          </p>
        )}

        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.75rem', flexWrap: 'wrap' }}>
          <button className="btn-primary" onClick={calculate} id="calorie-calculate-btn">
            {f.calculate || 'Calculate'}
          </button>
          <button className="btn-ghost" onClick={reset} id="calorie-reset-btn">
            {f.reset || 'Reset'}
          </button>
        </div>
      </div>

      {/* Result panel */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 280,
          background: result ? 'rgba(99,102,241,0.03)' : 'rgba(99,102,241,0.02)',
          borderRadius: 12,
          border: '1px dashed var(--card-border)',
          padding: '2rem',
          textAlign: 'center',
          transition: 'background 0.3s',
        }}
        aria-live="polite"
        aria-atomic="true"
      >
        {result ? (
          <div style={{ animation: 'fadeIn 0.35s ease', width: '100%' }}>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.25rem', marginTop: 0 }}>
              {r.target || 'Daily Calorie Target'}
            </p>
            <div className="bmi-number" style={{ marginBottom: '0.5rem', fontSize: '3rem' }}>
              {result.target.toLocaleString()} <span style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-secondary)' }}>kcal</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', margin: '1.25rem 0', padding: '1rem', background: 'rgba(255, 255, 255, 0.6)', borderRadius: 12, border: '1px solid var(--card-border)' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>{r.bmr || 'BMR'}</div>
                <div style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)' }}>{result.bmr.toLocaleString()} kcal</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>{r.tdee || 'TDEE'}</div>
                <div style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)' }}>{result.tdee.toLocaleString()} kcal</div>
              </div>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.5rem', lineHeight: 1.5 }}>
              {goal === 'lose' && (r.deficit || 'For weight loss we suggest a 500 kcal/day deficit.')}
              {goal === 'gain' && (r.surplus || 'For muscle gain we suggest a 300 kcal/day surplus.')}
              {goal === 'maintain' && (lang === 'ar' ? 'للحفاظ على وزنك الحالي، تناول سعرات تماثل إجمالي استهلاكك اليومي (TDEE).' : lang === 'es' ? 'Para mantener tu peso actual, consume calorías iguales a tu gasto diario total (TDEE).' : 'To maintain your current weight, eat calories equal to your TDEE.')}
            </p>
          </div>
        ) : (
          <div style={{ color: 'var(--text-muted)', textAlign: 'center' }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" style={{ opacity: 0.4, marginBottom: '0.75rem' }} aria-hidden="true">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
            <p style={{ fontSize: '0.9rem', margin: 0 }}>
              {lang === 'ar' ? 'أدخل بياناتك لحساب السعرات الحرارية اليومية' : lang === 'es' ? 'Ingresa tus datos para calcular tus calorías diarias' : 'Enter your details to calculate your daily calories'}
            </p>
          </div>
        )}
      </div>
      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }`}</style>
    </div>
  )
}
