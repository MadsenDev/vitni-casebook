import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import { DossierMark } from '../components/DossierMark'

const steps = ['Name', 'Starter', 'Evidence', 'Passphrase']

const starters = [
  { id: 'blank', icon: '☐', title: 'Blank case', body: 'A clean dossier. Name it, then build from scratch.' },
  { id: 'subject', icon: '◐', title: 'Single-subject brief', body: 'One entity at the centre. Pre-built: subjects folder, biography assertion, one relationship prompt.' },
  { id: 'financial', icon: '▢', title: 'Financial trace', body: 'Shell company tree, transfer log, beneficial-ownership checklist.' },
  { id: 'missing', icon: '◇', title: 'Missing person', body: 'Timeline-first layout: last-seen event, contact map, media log.' },
]

export function NewCase() {
  const { P } = useTheme()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [selectedStarter, setSelectedStarter] = useState('blank')
  const [caseName, setCaseName] = useState('')

  return (
    <div style={{ width: '100%', height: '100vh', background: P.paper, color: P.ink, fontFamily: "'Newsreader', 'Source Serif 4', Georgia, serif", display: 'grid', gridTemplateRows: '64px 1fr 28px', overflow: 'hidden' }}>
      {/* Top bar */}
      <div style={{ height: 64, padding: '0 22px', borderBottom: `1px solid ${P.rule}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <DossierMark size={28} P={P} />
          <div style={{ fontSize: 17, fontStyle: 'italic', fontWeight: 600 }}>New case</div>
        </div>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'Newsreader', serif", fontStyle: 'italic', fontSize: 14, color: P.inkSoft }}>Cancel</button>
      </div>

      {/* Body */}
      <div style={{ overflow: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '48px 32px' }}>
        {/* Step indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 48, width: '100%', maxWidth: 720, justifyContent: 'center' }}>
          {steps.map((s, i) => {
            const done = i < step, active = i === step
            return (
              <div key={s} style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: done ? P.asserted : active ? P.ink : P.paperSunk, border: `1px solid ${done ? P.asserted : active ? P.ink : P.rule}`, display: 'grid', placeItems: 'center', fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: (done || active) ? P.paper : P.inkMuted }}>{done ? '✓' : String(i + 1)}</div>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: active ? P.ink : P.inkMuted, letterSpacing: '0.12em', whiteSpace: 'nowrap' }}>{s.toUpperCase()}</span>
                </div>
                {i < steps.length - 1 && <div style={{ width: 60, height: 1, background: i < step ? P.asserted : P.rule, margin: '0 8px', marginBottom: 18 }} />}
              </div>
            )
          })}
        </div>

        {/* Step content */}
        <div style={{ width: '100%', maxWidth: 720 }}>
          {step === 0 && (
            <div>
              <h2 style={{ fontSize: 28, fontStyle: 'italic', fontWeight: 600, margin: '0 0 6px' }}>Name your case</h2>
              <p style={{ color: P.inkSoft, fontSize: 15, margin: '0 0 24px' }}>This appears in the top bar and on your case list. You can change it later.</p>
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.16em', color: P.inkMuted, display: 'block', marginBottom: 8 }}>CASE NAME</label>
                <input value={caseName} onChange={e => setCaseName(e.target.value)} placeholder="e.g. Operation Glass Harbor" style={{ width: '100%', padding: '12px 14px', background: P.paperRaised, border: `1px solid ${P.rule}`, borderRadius: 4, fontFamily: "'Newsreader', serif", fontStyle: 'italic', fontSize: 18, color: P.ink, outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div style={{ marginBottom: 24 }}>
                <label style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.16em', color: P.inkMuted, display: 'block', marginBottom: 8 }}>CASE ID (auto-generated)</label>
                <div style={{ padding: '10px 14px', background: P.paperSunk, border: `1px solid ${P.rule}`, borderRadius: 4, fontFamily: "'JetBrains Mono', monospace", fontSize: 14, color: P.inkMuted }}>C-2025-0143</div>
              </div>
            </div>
          )}

          {step === 1 && (
            <div>
              <h2 style={{ fontSize: 28, fontStyle: 'italic', fontWeight: 600, margin: '0 0 6px' }}>Pick a starter</h2>
              <p style={{ color: P.inkSoft, fontSize: 15, margin: '0 0 24px' }}>Starters give you a pre-shaped case folder, assertions, and a starting entity. Or go blank.</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 24 }}>
                {starters.map(s => {
                  const active = selectedStarter === s.id
                  return (
                    <div key={s.id} onClick={() => setSelectedStarter(s.id)} style={{ padding: '20px', background: active ? P.stampSoft : P.paperRaised, border: `1px solid ${active ? P.stamp : P.rule}`, borderRadius: 4, cursor: 'pointer', boxShadow: active ? P.shadowLg : P.shadow }}>
                      <div style={{ fontSize: 24, marginBottom: 10, color: active ? P.stamp : P.inkMuted }}>{s.icon}</div>
                      <div style={{ fontSize: 17, fontStyle: 'italic', fontWeight: 600, marginBottom: 6 }}>{s.title}</div>
                      <div style={{ fontSize: 13, color: P.inkSoft, lineHeight: 1.45 }}>{s.body}</div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 style={{ fontSize: 28, fontStyle: 'italic', fontWeight: 600, margin: '0 0 6px' }}>Add initial evidence</h2>
              <p style={{ color: P.inkSoft, fontSize: 15, margin: '0 0 24px' }}>Optional. You can always add more later.</p>
              <div style={{ border: `1.5px dashed ${P.ruleStrong}`, borderRadius: 4, padding: '40px 32px', background: P.paperSunk, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                <div style={{ fontSize: 36, color: P.inkSoft }}>↧</div>
                <div style={{ fontSize: 16, fontStyle: 'italic', fontWeight: 600, textAlign: 'center' }}>Drop files here</div>
                <div style={{ fontSize: 13, color: P.inkSoft, textAlign: 'center' }}>PDFs, images, CSV, MP4. Vitni extracts metadata and OCRs what it can.</div>
                <button style={{ padding: '8px 20px', border: `1px solid ${P.rule}`, borderRadius: 3, background: 'transparent', color: P.inkSoft, fontFamily: "'Newsreader', serif", fontStyle: 'italic', fontSize: 13, cursor: 'pointer' }}>Browse…</button>
              </div>
              <button onClick={() => setStep(s => s + 1)} style={{ color: P.inkMuted, background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'Newsreader', serif", fontStyle: 'italic', fontSize: 14 }}>Skip for now →</button>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 style={{ fontSize: 28, fontStyle: 'italic', fontWeight: 600, margin: '0 0 6px' }}>Set a passphrase</h2>
              <p style={{ color: P.inkSoft, fontSize: 15, margin: '0 0 24px' }}>Your case is encrypted with this passphrase. You'll need it to unlock the workspace. Store it safely — Vitni cannot recover it.</p>
              {[['PASSPHRASE', 'Enter passphrase…'], ['CONFIRM PASSPHRASE', 'Repeat passphrase…']].map(([label, placeholder]) => (
                <div key={label} style={{ marginBottom: 16 }}>
                  <label style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.16em', color: P.inkMuted, display: 'block', marginBottom: 8 }}>{label}</label>
                  <input type="password" placeholder={placeholder} style={{ width: '100%', padding: '12px 14px', background: P.paperRaised, border: `1px solid ${P.rule}`, borderRadius: 4, fontFamily: "'Newsreader', serif", fontSize: 16, color: P.ink, outline: 'none', boxSizing: 'border-box' }} />
                </div>
              ))}
              <div style={{ padding: '12px 16px', background: P.stampSoft, border: `1px solid ${P.stamp}`, borderRadius: 4, marginTop: 8, fontSize: 13, color: P.inkSoft, lineHeight: 1.5 }}>
                <strong style={{ color: P.stamp }}>Recovery key: </strong>You'll receive a 24-word phrase after creating the case. Store it somewhere offline.
              </div>
            </div>
          )}

          {/* Navigation */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 32 }}>
            <button onClick={() => step > 0 ? setStep(s => s - 1) : navigate(-1)} style={{ padding: '9px 20px', border: `1px solid ${P.rule}`, borderRadius: 3, background: 'transparent', color: P.inkSoft, fontFamily: "'Newsreader', serif", fontStyle: 'italic', fontSize: 14, cursor: 'pointer' }}>{step === 0 ? 'Cancel' : '← Back'}</button>
            <button onClick={() => step < 3 ? setStep(s => s + 1) : navigate('/investigation')} style={{ padding: '9px 28px', background: P.stamp, color: P.mode === 'dark' ? '#1c1812' : '#f3ebd8', border: 'none', borderRadius: 3, fontFamily: "'Newsreader', serif", fontStyle: 'italic', fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>{step < 3 ? 'Continue →' : 'Create case'}</button>
          </div>
        </div>
      </div>

      <div style={{ height: 28, background: P.paperSunk, borderTop: `1px solid ${P.rule}`, padding: '0 22px', display: 'flex', alignItems: 'center', fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: P.inkMuted, letterSpacing: '0.16em' }}>
        <span>● LOCAL · ENCRYPTED · v0.6</span>
      </div>
    </div>
  )
}
