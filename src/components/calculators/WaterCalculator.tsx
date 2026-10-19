'use client'

import { useState } from 'react'
import {
  calculateWater,
  type WaterActivityLevel,
  type Climate,
  type WaterResult,
} from '@/lib/calculators/water'

type WaterDict = {
  form: Record<string, string>
  result: Record<string, string>
}

type Props = { lang: string; dict: Record<string, unknown>; common: Record<string, string> }

export default function WaterCalculator({ lang, dict }: Props) {
  const d = dict as unknown as WaterDict
  const f = d.form || {}
  const r = d.result || {}

  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric')
  const [weightKg, setWeightKg] = useState('')
  const [weightLb, setWeightLb] = useState('')
  const [activity, setActivity] = useState<WaterActivityLevel>('moderate')
  const [climate, setClimate] = useState<Climate>('temperate')

  const [result, setResult] = useState<WaterResult | null>(null)
  const [error, setError] = useState('')

  const isRtl = lang === 'ar'

  function calculate() {
    setError('')
    try {
      let finalWeightKg = parseFloat(weightKg)

      if (unit === 'imperial') {
        const lb = parseFloat(weightLb)
        finalWeightKg = lb * 0.45359237
      }

      if (isNaN(finalWeightKg) || finalWeightKg <= 0) {
        setError(
          lang === 'ar'
            ? 'يرجى إدخال وزن صحيح'
            : lang === 'es'
              ? 'Por favor ingresa un peso válido'
              : 'Please enter a valid weight'
        )
        return
      }

      const res = calculateWater({
        weightKg: finalWeightKg,
        activity,
        climate,
      })
      setResult(res)
    } catch (e) {
      setError((e as Error).message)
    }
  }

  function reset() {
    setWeightKg('')
    setWeightLb('')
    setActivity('moderate')
    setClimate('temperate')
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
            id="water-unit-metric"
          >
            {lang === 'ar' ? 'متري (كجم)' : lang === 'es' ? 'Métrico (kg)' : 'Metric (kg)'}
          </button>
          <button
            className="unit-tab"
            aria-pressed={unit === 'imperial'}
            onClick={() => { setUnit('imperial'); setResult(null) }}
            id="water-unit-imperial"
          >
            {lang === 'ar' ? 'إمبراطوري (رطل)' : lang === 'es' ? 'Imperial (lbs)' : 'Imperial (lbs)'}
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.125rem' }}>
          {/* Weight */}
          <div>
            <label htmlFor="water-weight" className="input-label">
              {f.weight || 'Body Weight'} ({unit === 'metric' ? 'kg' : 'lbs'})
            </label>
            <input
              id="water-weight"
              className="input"
              type="number"
              inputMode="decimal"
              min="10"
              max="600"
              placeholder={unit === 'metric' ? (isRtl ? '70' : '70') : '154'}
              value={unit === 'metric' ? weightKg : weightLb}
              onChange={(e) => {
                if (unit === 'metric') setWeightKg(e.target.value)
                else setWeightLb(e.target.value)
                setResult(null)
              }}
            />
          </div>

          {/* Activity Level */}
          <div>
            <label htmlFor="water-activity" className="input-label">{f.activity || 'Activity Level'}</label>
            <select
              id="water-activity"
              className="input"
              value={activity}
              onChange={(e) => { setActivity(e.target.value as WaterActivityLevel); setResult(null) }}
              style={{ cursor: 'pointer' }}
            >
              <option value="sedentary">{f.sedentary || 'Sedentary'}</option>
              <option value="light">{f.light || 'Light exercise'}</option>
              <option value="moderate">{f.moderate || 'Moderate exercise'}</option>
              <option value="active">{f.active || 'Heavy exercise'}</option>
              <option value="veryActive">{f.veryActive || 'Very active / athlete'}</option>
            </select>
          </div>

          {/* Climate */}
          <div>
            <label htmlFor="water-climate" className="input-label">{f.climate || 'Climate'}</label>
            <select
              id="water-climate"
              className="input"
              value={climate}
              onChange={(e) => { setClimate(e.target.value as Climate); setResult(null) }}
              style={{ cursor: 'pointer' }}
            >
              <option value="temperate">{f.temperate || 'Temperate'}</option>
              <option value="hot">{f.hot || 'Hot / humid'}</option>
            </select>
          </div>
        </div>

        {error && (
          <p role="alert" style={{ color: 'var(--status-danger)', fontSize: '0.85rem', marginTop: '0.75rem' }}>
            {error}
          </p>
        )}

        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.75rem', flexWrap: 'wrap' }}>
          <button className="btn-primary" onClick={calculate} id="water-calculate-btn">
            {f.calculate || 'Calculate'}
          </button>
          <button className="btn-ghost" onClick={reset} id="water-reset-btn">
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
              {r.daily || 'Daily Water Intake'}
            </p>
            <div className="bmi-number" style={{ marginBottom: '0.5rem', fontSize: '3rem' }}>
              {result.liters} <span style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{r.liters || 'L'}</span>
            </div>

            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: 'rgba(59, 130, 246, 0.1)', color: '#2563EB', borderRadius: 9999, fontWeight: 600, fontSize: '0.875rem', marginBottom: '1rem' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
              </svg>
              <span>≈ {result.glasses} {r.glasses || 'glasses (250 ml)'}</span>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.5rem', lineHeight: 1.5 }}>
              {r.tip || 'Drink more if you are sweating heavily, breastfeeding, or feeling thirsty.'}
            </p>
          </div>
        ) : (
          <div style={{ color: 'var(--text-muted)', textAlign: 'center' }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" style={{ opacity: 0.4, marginBottom: '0.75rem' }} aria-hidden="true">
              <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
            </svg>
            <p style={{ fontSize: '0.9rem', margin: 0 }}>
              {lang === 'ar' ? 'أدخل وزنك ومستوى نشاطك لحساب احتياجك اليومي من الماء' : lang === 'es' ? 'Ingresa tus datos para calcular tu ingesta diaria de agua' : 'Enter your weight and activity to calculate your daily water intake'}
            </p>
          </div>
        )}
      </div>
      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }`}</style>
    </div>
  )
}
