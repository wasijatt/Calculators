'use client'

import { useState } from 'react'
import {
  calculateProtein,
  type ProteinActivityLevel,
  type ProteinGoal,
  type ProteinResult,
} from '@/lib/calculators/protein'

type ProteinDict = {
  form: Record<string, string>
  result: Record<string, string>
}

type Props = { lang: string; dict: Record<string, unknown>; common: Record<string, string> }

export default function ProteinCalculator({ lang, dict }: Props) {
  const d = dict as unknown as ProteinDict
  const f = d.form || {}
  const r = d.result || {}

  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric')
  const [weightKg, setWeightKg] = useState('')
  const [weightLb, setWeightLb] = useState('')
  const [activity, setActivity] = useState<ProteinActivityLevel>('moderate')
  const [goal, setGoal] = useState<ProteinGoal>('maintain')

  const [result, setResult] = useState<ProteinResult | null>(null)
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

      const res = calculateProtein({
        weightKg: finalWeightKg,
        activity,
        goal,
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
            id="protein-unit-metric"
          >
            {lang === 'ar' ? 'متري (كجم)' : lang === 'es' ? 'Métrico (kg)' : 'Metric (kg)'}
          </button>
          <button
            className="unit-tab"
            aria-pressed={unit === 'imperial'}
            onClick={() => { setUnit('imperial'); setResult(null) }}
            id="protein-unit-imperial"
          >
            {lang === 'ar' ? 'إمبراطوري (رطل)' : lang === 'es' ? 'Imperial (lbs)' : 'Imperial (lbs)'}
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.125rem' }}>
          {/* Weight */}
          <div>
            <label htmlFor="protein-weight" className="input-label">
              {f.weight || 'Body Weight'} ({unit === 'metric' ? 'kg' : 'lbs'})
            </label>
            <input
              id="protein-weight"
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
            <label htmlFor="protein-activity" className="input-label">{f.activity || 'Activity Level'}</label>
            <select
              id="protein-activity"
              className="input"
              value={activity}
              onChange={(e) => { setActivity(e.target.value as ProteinActivityLevel); setResult(null) }}
              style={{ cursor: 'pointer' }}
            >
              <option value="sedentary">{f.sedentary || 'Sedentary'}</option>
              <option value="light">{f.light || 'Light exercise'}</option>
              <option value="moderate">{f.moderate || 'Moderate exercise'}</option>
              <option value="active">{f.active || 'Heavy exercise'}</option>
              <option value="athlete">{f.athlete || 'Athlete / endurance sport'}</option>
            </select>
          </div>

          {/* Goal */}
          <div>
            <label htmlFor="protein-goal" className="input-label">{f.goal || 'Goal'}</label>
            <select
              id="protein-goal"
              className="input"
              value={goal}
              onChange={(e) => { setGoal(e.target.value as ProteinGoal); setResult(null) }}
              style={{ cursor: 'pointer' }}
            >
              <option value="lose">{f.lose || 'Fat loss'}</option>
              <option value="maintain">{f.maintain || 'Maintenance'}</option>
              <option value="gain">{f.gain || 'Muscle gain'}</option>
            </select>
          </div>
        </div>

        {error && (
          <p role="alert" style={{ color: 'var(--status-danger)', fontSize: '0.85rem', marginTop: '0.75rem' }}>
            {error}
          </p>
        )}

        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.75rem', flexWrap: 'wrap' }}>
          <button className="btn-primary" onClick={calculate} id="protein-calculate-btn">
            {f.calculate || 'Calculate'}
          </button>
          <button className="btn-ghost" onClick={reset} id="protein-reset-btn">
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
              {r.grams ? `${f.calculate?.replace(/^Calculate\s*/i, '') || 'Daily Protein'} (${r.grams})` : 'Recommended Daily Protein'}
            </p>
            <div className="bmi-number" style={{ marginBottom: '0.5rem', fontSize: '2.75rem' }}>
              {result.minGrams} – {result.maxGrams} <span style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-secondary)' }}>g</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', margin: '1.25rem 0', padding: '0.875rem', background: 'rgba(255, 255, 255, 0.6)', borderRadius: 12, border: '1px solid var(--card-border)' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>{r.min || 'Minimum'}</div>
                <div style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)' }}>{result.minGrams}g <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-muted)' }}>({result.minPerKg} g/kg)</span></div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>{r.max || 'Maximum'}</div>
                <div style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)' }}>{result.maxGrams}g <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-muted)' }}>({result.maxPerKg} g/kg)</span></div>
              </div>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.75rem', lineHeight: 1.5 }}>
              {r.tip || 'Spread your protein across 3–5 meals for optimal muscle protein synthesis.'}
            </p>
          </div>
        ) : (
          <div style={{ color: 'var(--text-muted)', textAlign: 'center' }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" style={{ opacity: 0.4, marginBottom: '0.75rem' }} aria-hidden="true">
              <path d="M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8zM6 1v3M10 1v3M14 1v3" />
            </svg>
            <p style={{ fontSize: '0.9rem', margin: 0 }}>
              {lang === 'ar' ? 'أدخل وزنك وهدفك لحساب احتياجك اليومي من البروتين' : lang === 'es' ? 'Ingresa tu peso y objetivo para calcular tu proteína diaria' : 'Enter your weight and goal to calculate your daily protein needs'}
            </p>
          </div>
        )}
      </div>
      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }`}</style>
    </div>
  )
}
