'use client'

import { useState } from 'react'
import { calculateBmi, imperialToMetric } from '@/lib/calculators/bmi'

type BmiDict = {
  form: Record<string, string>
  result: Record<string, string>
}

type Props = { lang: string; dict: Record<string, unknown>; common: Record<string, string> }

const STATUS_COLOR = {
  underweight: 'var(--status-healthy)',
  healthy: 'var(--status-healthy)',
  overweight: 'var(--status-warning)',
  obese: 'var(--status-danger)',
} as const

const STATUS_BADGE = {
  underweight: 'result-badge result-badge--warning',
  healthy: 'result-badge result-badge--healthy',
  overweight: 'result-badge result-badge--warning',
  obese: 'result-badge result-badge--danger',
} as const

export default function BmiCalculator({ lang, dict, common }: Props) {
  const d = dict as unknown as BmiDict
  const f = d.form
  const r = d.result

  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric')
  const [weightKg, setWeightKg] = useState('')
  const [heightCm, setHeightCm] = useState('')
  const [weightLb, setWeightLb] = useState('')
  const [heightFt, setHeightFt] = useState('')
  const [heightIn, setHeightIn] = useState('')
  const [result, setResult] = useState<{ bmi: number; category: string } | null>(null)
  const [error, setError] = useState('')

  const isRtl = lang === 'ar'

  function calculate() {
    setError('')
    try {
      let input
      if (unit === 'metric') {
        input = { weightKg: parseFloat(weightKg), heightCm: parseFloat(heightCm) }
      } else {
        input = imperialToMetric(parseFloat(weightLb), parseFloat(heightFt), parseFloat(heightIn || '0'))
      }
      if (isNaN(input.weightKg) || isNaN(input.heightCm)) {
        setError(lang === 'ar' ? 'يرجى ملء جميع الحقول' : lang === 'es' ? 'Por favor completa todos los campos' : 'Please fill in all fields')
        return
      }
      setResult(calculateBmi(input))
    } catch (e) {
      setError((e as Error).message)
    }
  }

  function reset() {
    setWeightKg(''); setHeightCm(''); setWeightLb(''); setHeightFt(''); setHeightIn(''); setResult(null); setError('')
  }

  const catKey = result?.category as keyof typeof STATUS_COLOR | undefined

  return (
    <div className="card calc-layout" style={{ padding: '2rem', gap: '2rem' }}>
      {/* Form panel */}
      <div>
        {/* Unit toggle */}
        <div className="unit-toggle" style={{ marginBottom: '1.75rem' }} role="group" aria-label="Unit system">
          <button
            className="unit-tab"
            aria-pressed={unit === 'metric'}
            onClick={() => { setUnit('metric'); setResult(null) }}
            id="unit-metric"
          >
            {lang === 'ar' ? 'متري' : lang === 'es' ? 'Métrico' : 'Metric'}
          </button>
          <button
            className="unit-tab"
            aria-pressed={unit === 'imperial'}
            onClick={() => { setUnit('imperial'); setResult(null) }}
            id="unit-imperial"
          >
            {lang === 'ar' ? 'إمبراطوري' : lang === 'es' ? 'Imperial' : 'Imperial'}
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.125rem' }}>
          {unit === 'metric' ? (
            <>
              <div>
                <label htmlFor="bmi-height-cm" className="input-label">{f.heightCm}</label>
                <input
                  id="bmi-height-cm"
                  className="input"
                  type="number"
                  inputMode="decimal"
                  min="50"
                  max="280"
                  placeholder={isRtl ? 'مثال: 175' : 'e.g. 175'}
                  value={heightCm}
                  onChange={(e) => { setHeightCm(e.target.value); setResult(null) }}
                />
              </div>
              <div>
                <label htmlFor="bmi-weight-kg" className="input-label">{f.weightKg}</label>
                <input
                  id="bmi-weight-kg"
                  className="input"
                  type="number"
                  inputMode="decimal"
                  min="1"
                  max="500"
                  placeholder={isRtl ? 'مثال: 70' : 'e.g. 70'}
                  value={weightKg}
                  onChange={(e) => { setWeightKg(e.target.value); setResult(null) }}
                />
              </div>
            </>
          ) : (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label htmlFor="bmi-height-ft" className="input-label">{f.heightFt}</label>
                  <input
                    id="bmi-height-ft"
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
                  <label htmlFor="bmi-height-in" className="input-label">{f.heightIn}</label>
                  <input
                    id="bmi-height-in"
                    className="input"
                    type="number"
                    inputMode="numeric"
                    min="0"
                    max="11"
                    placeholder="10"
                    value={heightIn}
                    onChange={(e) => { setHeightIn(e.target.value); setResult(null) }}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="bmi-weight-lb" className="input-label">{f.weightLb}</label>
                <input
                  id="bmi-weight-lb"
                  className="input"
                  type="number"
                  inputMode="decimal"
                  min="1"
                  placeholder="154"
                  value={weightLb}
                  onChange={(e) => { setWeightLb(e.target.value); setResult(null) }}
                />
              </div>
            </>
          )}
        </div>

        {error && (
          <p role="alert" style={{ color: 'var(--status-danger)', fontSize: '0.85rem', marginTop: '0.75rem' }}>
            {error}
          </p>
        )}

        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.75rem', flexWrap: 'wrap' }}>
          <button className="btn-primary" onClick={calculate} id="bmi-calculate-btn">
            {f.calculate}
          </button>
          <button className="btn-ghost" onClick={reset} id="bmi-reset-btn">
            {f.reset}
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
          minHeight: 240,
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
          <div style={{ animation: 'fadeIn 0.35s ease' }}>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.5rem', marginTop: 0 }}>
              {r.yourBmi}
            </p>
            <div className="bmi-number" style={{ marginBottom: '0.75rem' }}>{result.bmi}</div>
            <span className={STATUS_BADGE[result.category as keyof typeof STATUS_BADGE] ?? 'result-badge'}>
              <span aria-hidden="true">●</span>
              {catKey && (
                lang === 'ar'
                  ? { underweight: 'نقص الوزن', healthy: 'وزن صحي', overweight: 'زيادة في الوزن', obese: 'سمنة' }[catKey]
                  : lang === 'es'
                    ? { underweight: 'Bajo peso', healthy: 'Saludable', overweight: 'Sobrepeso', obese: 'Obesidad' }[catKey]
                    : { underweight: 'Underweight', healthy: 'Healthy', overweight: 'Overweight', obese: 'Obese' }[catKey]
              )}
            </span>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '1rem', lineHeight: 1.6 }}>
              {r.tip}
            </p>
          </div>
        ) : (
          <div style={{ color: 'var(--text-muted)', textAlign: 'center' }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" style={{ opacity: 0.4, marginBottom: '0.75rem' }} aria-hidden="true">
              <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18" />
            </svg>
            <p style={{ fontSize: '0.9rem', margin: 0 }}>
              {lang === 'ar' ? 'أدخل قياساتك لرؤية نتيجتك' : lang === 'es' ? 'Ingresa tus medidas para ver tu resultado' : 'Enter your measurements to see your result'}
            </p>
          </div>
        )}
      </div>
      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }`}</style>
    </div>
  )
}
