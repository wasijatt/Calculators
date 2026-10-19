'use client'

import { useState } from 'react'
import {
  calculateBodyfat,
  type BodyfatCategory,
  type BodyfatResult,
} from '@/lib/calculators/bodyfat'
import type { Sex } from '@/lib/calculators/calorie'

type BodyfatDict = {
  form: Record<string, string>
  result: Record<string, string>
}

type Props = { lang: string; dict: Record<string, unknown>; common: Record<string, string> }

const STATUS_BADGE = {
  essential: 'result-badge result-badge--warning',
  athlete: 'result-badge result-badge--healthy',
  fitness: 'result-badge result-badge--healthy',
  acceptable: 'result-badge result-badge--healthy',
  obese: 'result-badge result-badge--danger',
} as const

export default function BodyfatCalculator({ lang, dict }: Props) {
  const d = dict as unknown as BodyfatDict
  const f = d.form || {}
  const r = d.result || {}

  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric')
  const [sex, setSex] = useState<Sex>('male')
  const [height, setHeight] = useState('')
  const [neck, setNeck] = useState('')
  const [waist, setWaist] = useState('')
  const [hip, setHip] = useState('')
  const [weight, setWeight] = useState('')

  const [result, setResult] = useState<BodyfatResult | null>(null)
  const [error, setError] = useState('')

  const isRtl = lang === 'ar'

  function calculate() {
    setError('')
    try {
      let h = parseFloat(height)
      let n = parseFloat(neck)
      let w = parseFloat(waist)
      let hp = hip ? parseFloat(hip) : undefined
      let wt = weight ? parseFloat(weight) : undefined

      // Imperial to cm / kg conversion
      if (unit === 'imperial') {
        h = h * 2.54
        n = n * 2.54
        w = w * 2.54
        if (hp !== undefined) hp = hp * 2.54
        if (wt !== undefined) wt = wt * 0.45359237
      }

      if (isNaN(h) || isNaN(n) || isNaN(w)) {
        setError(
          lang === 'ar'
            ? 'يرجى إدخال جميع القياسات الأساسية'
            : lang === 'es'
              ? 'Por favor ingresa todas las medidas requeridas'
              : 'Please enter all required measurements'
        )
        return
      }

      if (sex === 'female' && (hp === undefined || isNaN(hp))) {
        setError(
          lang === 'ar'
            ? 'محيط الورك مطلوب للإناث'
            : lang === 'es'
              ? 'La circunferencia de cadera es requerida para mujeres'
              : 'Hip circumference is required for females'
        )
        return
      }

      const res = calculateBodyfat(
        {
          sex,
          heightCm: h,
          neckCm: n,
          waistCm: w,
          hipCm: hp,
        },
        wt
      )

      setResult(res)
    } catch (e) {
      setError((e as Error).message)
    }
  }

  function reset() {
    setHeight('')
    setNeck('')
    setWaist('')
    setHip('')
    setWeight('')
    setResult(null)
    setError('')
  }

  const categoryLabels: Record<BodyfatCategory, { en: string; es: string; ar: string }> = {
    essential: { en: 'Essential Fat', es: 'Grasa esencial', ar: 'دهون أساسية' },
    athlete: { en: 'Athlete', es: 'Atleta', ar: 'رياضي' },
    fitness: { en: 'Fitness', es: 'لياقة بدنية', ar: 'لياقة بدنية' },
    acceptable: { en: 'Acceptable', es: 'Aceptable', ar: 'مقبول' },
    obese: { en: 'Obese', es: 'Obesidad', ar: 'سمنة' },
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
            id="bodyfat-unit-metric"
          >
            {lang === 'ar' ? 'متري (سم)' : lang === 'es' ? 'Métrico (cm)' : 'Metric (cm)'}
          </button>
          <button
            className="unit-tab"
            aria-pressed={unit === 'imperial'}
            onClick={() => { setUnit('imperial'); setResult(null) }}
            id="bodyfat-unit-imperial"
          >
            {lang === 'ar' ? 'إمبراطوري (بوصة)' : lang === 'es' ? 'Imperial (pulg)' : 'Imperial (in)'}
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.125rem' }}>
          {/* Sex Selection */}
          <div>
            <label className="input-label">{f.sex || 'Sex'}</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              <button
                type="button"
                className="btn-ghost"
                style={{
                  justifyContent: 'center',
                  background: sex === 'male' ? 'rgba(99, 102, 241, 0.12)' : 'transparent',
                  borderColor: sex === 'male' ? 'var(--input-border)' : 'var(--card-border)',
                  fontWeight: sex === 'male' ? 600 : 500,
                  color: sex === 'male' ? 'var(--text-primary)' : 'var(--text-secondary)',
                }}
                onClick={() => { setSex('male'); setResult(null) }}
                id="bodyfat-sex-male"
              >
                {f.male || 'Male'}
              </button>
              <button
                type="button"
                className="btn-ghost"
                style={{
                  justifyContent: 'center',
                  background: sex === 'female' ? 'rgba(99, 102, 241, 0.12)' : 'transparent',
                  borderColor: sex === 'female' ? 'var(--input-border)' : 'var(--card-border)',
                  fontWeight: sex === 'female' ? 600 : 500,
                  color: sex === 'female' ? 'var(--text-primary)' : 'var(--text-secondary)',
                }}
                onClick={() => { setSex('female'); setResult(null) }}
                id="bodyfat-sex-female"
              >
                {f.female || 'Female'}
              </button>
            </div>
          </div>

          {/* Height */}
          <div>
            <label htmlFor="bodyfat-height" className="input-label">
              {f.height || 'Height'} ({unit === 'metric' ? 'cm' : 'in'})
            </label>
            <input
              id="bodyfat-height"
              className="input"
              type="number"
              inputMode="decimal"
              min="50"
              max="280"
              placeholder={unit === 'metric' ? (isRtl ? '175' : '175') : '69'}
              value={height}
              onChange={(e) => { setHeight(e.target.value); setResult(null) }}
            />
          </div>

          {/* Neck */}
          <div>
            <label htmlFor="bodyfat-neck" className="input-label">
              {f.neck || 'Neck circumference'} ({unit === 'metric' ? 'cm' : 'in'})
            </label>
            <input
              id="bodyfat-neck"
              className="input"
              type="number"
              inputMode="decimal"
              min="15"
              max="80"
              placeholder={unit === 'metric' ? (isRtl ? '38' : '38') : '15'}
              value={neck}
              onChange={(e) => { setNeck(e.target.value); setResult(null) }}
            />
          </div>

          {/* Waist */}
          <div>
            <label htmlFor="bodyfat-waist" className="input-label">
              {f.waist || 'Waist circumference'} ({unit === 'metric' ? 'cm' : 'in'})
            </label>
            <input
              id="bodyfat-waist"
              className="input"
              type="number"
              inputMode="decimal"
              min="30"
              max="200"
              placeholder={unit === 'metric' ? (isRtl ? '84' : '84') : '33'}
              value={waist}
              onChange={(e) => { setWaist(e.target.value); setResult(null) }}
            />
          </div>

          {/* Hip (for females) */}
          {sex === 'female' && (
            <div>
              <label htmlFor="bodyfat-hip" className="input-label">
                {f.hip || 'Hip circumference (women)'} ({unit === 'metric' ? 'cm' : 'in'})
              </label>
              <input
                id="bodyfat-hip"
                className="input"
                type="number"
                inputMode="decimal"
                min="40"
                max="250"
                placeholder={unit === 'metric' ? (isRtl ? '96' : '96') : '38'}
                value={hip}
                onChange={(e) => { setHip(e.target.value); setResult(null) }}
              />
            </div>
          )}

          {/* Optional Weight */}
          <div>
            <label htmlFor="bodyfat-weight" className="input-label">
              {lang === 'ar' ? 'الوزن (اختياري، لحساب كتلة الدهون والكتلة الصافية)' : lang === 'es' ? 'Peso (opcional, para masa grasa y magra)' : 'Body Weight (optional, for fat & lean mass)'} ({unit === 'metric' ? 'kg' : 'lbs'})
            </label>
            <input
              id="bodyfat-weight"
              className="input"
              type="number"
              inputMode="decimal"
              min="20"
              placeholder={unit === 'metric' ? (isRtl ? '70' : '70') : '154'}
              value={weight}
              onChange={(e) => { setWeight(e.target.value); setResult(null) }}
            />
          </div>
        </div>

        {error && (
          <p role="alert" style={{ color: 'var(--status-danger)', fontSize: '0.85rem', marginTop: '0.75rem' }}>
            {error}
          </p>
        )}

        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.75rem', flexWrap: 'wrap' }}>
          <button className="btn-primary" onClick={calculate} id="bodyfat-calculate-btn">
            {f.calculate || 'Calculate'}
          </button>
          <button className="btn-ghost" onClick={reset} id="bodyfat-reset-btn">
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
              {r.bodyfat || 'Estimated Body Fat'}
            </p>
            <div className="bmi-number" style={{ marginBottom: '0.75rem' }}>
              {result.percentage}%
            </div>

            <span className={STATUS_BADGE[result.category] ?? 'result-badge'}>
              <span aria-hidden="true">●</span>
              {categoryLabels[result.category]?.[lang as 'en' | 'es' | 'ar'] ?? result.category}
            </span>

            {result.fatMassKg !== undefined && result.leanMassKg !== undefined && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '1.25rem', padding: '0.875rem', background: 'rgba(255, 255, 255, 0.6)', borderRadius: 12, border: '1px solid var(--card-border)' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>{r.fatMass || 'Fat Mass'}</div>
                  <div style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {unit === 'metric' ? `${result.fatMassKg} kg` : `${Math.round(result.fatMassKg * 2.20462 * 10) / 10} lbs`}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>{r.leanMass || 'Lean Mass'}</div>
                  <div style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {unit === 'metric' ? `${result.leanMassKg} kg` : `${Math.round(result.leanMassKg * 2.20462 * 10) / 10} lbs`}
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div style={{ color: 'var(--text-muted)', textAlign: 'center' }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" style={{ opacity: 0.4, marginBottom: '0.75rem' }} aria-hidden="true">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
              <path d="M2 12h20" />
            </svg>
            <p style={{ fontSize: '0.9rem', margin: 0 }}>
              {lang === 'ar' ? 'أدخل القياسات لحساب نسبة الدهون في الجسم' : lang === 'es' ? 'Ingresa tus medidas para calcular tu porcentaje de grasa' : 'Enter measurements to calculate your body fat percentage'}
            </p>
          </div>
        )}
      </div>
      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }`}</style>
    </div>
  )
}
