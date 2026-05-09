import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import { DossierMark } from '../components/DossierMark'

export function Recovery() {
  const { P } = useTheme()
  const navigate = useNavigate()
  const [phase, setPhase] = useState<'intro' | 'enter' | 'verified'>('intro')
  const [inputs, setInputs] = useState<string[]>(Array(24).fill(''))
  const [error, setError] = useState('')

  const handleVerify = () => {
    const allFilled = inputs.every(w => w.trim().length > 0)
    if (!allFilled) { setError('All 24 words are required.'); return }
    setError('')
    setPhase('verified')
  }

  return (
    <div style={{ width: '100%', height: '100vh', background: P.paper, color: P.ink, fontFamily: "'Newsreader', 'Source Serif 4', Georgia, serif", overflow: 'auto' }}>
      {/* Header */}
      <div style={{ height: 64, padding: '0 22px', borderBottom: `1px solid ${P.rule}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: P.paperRaised }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <DossierMark size={28} P={P} />
          <div style={{ fontSize: 17, fontStyle: 'italic', fontWeight: 600 }}>Recovery</div>
        </div>
        <button onClick={() => navigate('/lock')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'Newsreader', serif", fontStyle: 'italic', fontSize: 14, color: P.inkSoft }}>← Lock screen</button>
      </div>

      <div style={{ maxWidth: 680, margin: '0 auto', padding: '48px 24px' }}>
        {phase === 'intro' && (
          <div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: P.inkMuted, letterSpacing: '0.18em', marginBottom: 8 }}>ACCOUNT RECOVERY</div>
            <h1 style={{ fontSize: 34, fontStyle: 'italic', fontWeight: 600, margin: '0 0 12px', letterSpacing: '-0.012em' }}>Use your recovery key</h1>
            <p style={{ fontSize: 15, color: P.inkSoft, lineHeight: 1.6, margin: '0 0 32px', maxWidth: 480 }}>
              If you've forgotten your passphrase, your 24-word recovery key can restore access. This key was shown once when you created the case.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 32 }}>
              {[
                { icon: '⚠', text: 'Vitni does not store your passphrase or recovery key. If you\'ve lost both, access cannot be restored.' },
                { icon: '◐', text: 'After recovery, you\'ll be prompted to set a new passphrase. Your recovery key remains the same.' },
                { icon: '✦', text: 'Your case data is preserved — only the access credential changes.' },
              ].map(({ icon, text }) => (
                <div key={icon} style={{ display: 'flex', gap: 14, padding: '14px 16px', background: P.paperRaised, border: `1px solid ${P.ruleSoft}`, borderRadius: 3 }}>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 14, color: P.inkMuted, flexShrink: 0 }}>{icon}</span>
                  <span style={{ fontSize: 14, color: P.inkSoft, lineHeight: 1.5 }}>{text}</span>
                </div>
              ))}
            </div>

            <button onClick={() => setPhase('enter')} style={{ padding: '12px 28px', background: P.stamp, color: P.mode === 'dark' ? '#1c1812' : '#f3ebd8', border: 'none', borderRadius: 4, fontFamily: "'Newsreader', serif", fontStyle: 'italic', fontSize: 16, fontWeight: 600, cursor: 'pointer' }}>
              Enter recovery key →
            </button>
          </div>
        )}

        {phase === 'enter' && (
          <div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: P.inkMuted, letterSpacing: '0.18em', marginBottom: 8 }}>ENTER RECOVERY KEY</div>
            <h1 style={{ fontSize: 28, fontStyle: 'italic', fontWeight: 600, margin: '0 0 8px' }}>24-word recovery key</h1>
            <p style={{ fontSize: 14, color: P.inkSoft, margin: '0 0 24px', lineHeight: 1.55 }}>
              Enter each word in the correct order, exactly as written.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 20 }}>
              {inputs.map((val, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 10px', background: P.paperRaised, border: `1px solid ${val ? P.rule : P.ruleSoft}`, borderRadius: 3 }}>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: P.inkMuted, width: 18, flexShrink: 0 }}>{i + 1}.</span>
                  <input
                    value={val}
                    onChange={e => {
                      const next = [...inputs]; next[i] = e.target.value.toLowerCase(); setInputs(next)
                    }}
                    style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontFamily: "'Newsreader', serif", fontStyle: 'italic', fontSize: 14, color: P.ink, minWidth: 0 }}
                    placeholder={`word ${i + 1}`}
                  />
                </div>
              ))}
            </div>

            {error && (
              <div style={{ padding: '10px 14px', background: P.stampSoft, border: `1px solid ${P.stamp}`, borderRadius: 3, fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, color: P.stamp, marginBottom: 16 }}>{error}</div>
            )}

            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <button onClick={handleVerify} style={{ padding: '12px 28px', background: P.stamp, color: P.mode === 'dark' ? '#1c1812' : '#f3ebd8', border: 'none', borderRadius: 4, fontFamily: "'Newsreader', serif", fontStyle: 'italic', fontSize: 16, fontWeight: 600, cursor: 'pointer' }}>
                Verify key →
              </button>
              <button onClick={() => setPhase('intro')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'Newsreader', serif", fontStyle: 'italic', fontSize: 14, color: P.inkSoft }}>← Back</button>
            </div>
          </div>
        )}

        {phase === 'verified' && (
          <div style={{ textAlign: 'center', paddingTop: 40 }}>
            <div style={{ width: 60, height: 60, borderRadius: '50%', background: P.asserted, margin: '0 auto 20px', display: 'grid', placeItems: 'center' }}>
              <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="white" strokeWidth="2.5"><path d="M4 12l5 5 11-11"/></svg>
            </div>
            <h1 style={{ fontSize: 30, fontStyle: 'italic', fontWeight: 600, margin: '0 0 12px' }}>Recovery key verified</h1>
            <p style={{ fontSize: 15, color: P.inkSoft, lineHeight: 1.6, margin: '0 auto 32px', maxWidth: 400 }}>
              Set a new passphrase for this casebook.
            </p>

            <div style={{ maxWidth: 380, margin: '0 auto', textAlign: 'left' }}>
              {[['NEW PASSPHRASE', 'Enter new passphrase…'], ['CONFIRM PASSPHRASE', 'Repeat passphrase…']].map(([label, ph]) => (
                <div key={label} style={{ marginBottom: 16 }}>
                  <label style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.16em', color: P.inkMuted, display: 'block', marginBottom: 8 }}>{label}</label>
                  <input type="password" placeholder={ph} style={{ width: '100%', padding: '12px 14px', background: P.paperRaised, border: `1px solid ${P.rule}`, borderRadius: 4, fontFamily: "'Newsreader', serif", fontSize: 16, color: P.ink, outline: 'none', boxSizing: 'border-box' }} />
                </div>
              ))}
              <button onClick={() => navigate('/investigation')} style={{ width: '100%', padding: '12px 14px', background: P.stamp, color: P.mode === 'dark' ? '#1c1812' : '#f3ebd8', border: 'none', borderRadius: 4, fontFamily: "'Newsreader', serif", fontStyle: 'italic', fontSize: 16, fontWeight: 600, cursor: 'pointer', marginTop: 8 }}>
                Set passphrase and open case →
              </button>
            </div>
          </div>
        )}

        <div style={{ marginTop: 48, paddingTop: 18, borderTop: `1px solid ${P.ruleSoft}`, fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: P.inkMuted, letterSpacing: '0.14em' }}>
          AES-256-GCM · LOCAL ONLY · v0.6
        </div>
      </div>
    </div>
  )
}
