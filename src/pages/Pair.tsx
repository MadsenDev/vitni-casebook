import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import { DossierMark } from '../components/DossierMark'

export function Pair() {
  const { P } = useTheme()
  const navigate = useNavigate()
  const [step, setStep] = useState<'scan' | 'code' | 'done'>('scan')

  const wordCode = ['amber', 'marble', 'signal', 'eleven', 'frost', 'candle']

  return (
    <div style={{ width: '100%', height: '100vh', background: P.paper, color: P.ink, fontFamily: "'Newsreader', 'Source Serif 4', Georgia, serif", display: 'grid', gridTemplateColumns: '1fr 1fr', overflow: 'hidden' }}>
      {/* Left — instructions */}
      <div style={{ background: P.paperSunk, borderRight: `1px solid ${P.rule}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 48 }}>
        <DossierMark size={56} P={P} />
        <h1 style={{ marginTop: 20, fontSize: 30, fontStyle: 'italic', fontWeight: 600, letterSpacing: '-0.012em', lineHeight: 1.1, textAlign: 'center' }}>
          Pair a device
        </h1>
        <p style={{ marginTop: 12, fontSize: 14, color: P.inkSoft, lineHeight: 1.6, maxWidth: 320, textAlign: 'center' }}>
          Pairing lets you unlock this casebook using a trusted mobile device. No passphrase entry required — the paired device holds the key fragment.
        </p>

        <div style={{ marginTop: 32, width: '100%', maxWidth: 320, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[
            { n: '1', text: 'Open the Vitni mobile app on your phone' },
            { n: '2', text: 'Go to Settings → Pair desktop casebook' },
            { n: '3', text: 'Scan the QR code or enter the word code' },
          ].map(({ n, text }) => (
            <div key={n} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <div style={{ width: 24, height: 24, borderRadius: '50%', border: `1px solid ${P.stamp}`, color: P.stamp, fontFamily: "'JetBrains Mono', monospace", fontSize: 11, display: 'grid', placeItems: 'center', flexShrink: 0 }}>{n}</div>
              <div style={{ fontSize: 14, color: P.inkSoft, paddingTop: 3, lineHeight: 1.45 }}>{text}</div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 32, padding: '10px 16px', background: P.paperRaised, border: `1px solid ${P.ruleSoft}`, borderRadius: 3, width: '100%', maxWidth: 320, fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: P.inkMuted, letterSpacing: '0.12em', lineHeight: 1.7 }}>
          PAIRING IS DEVICE-LOCAL · NO DATA LEAVES YOUR MACHINE · KEY SPLIT VIA DIFFE-HELLMAN
        </div>
      </div>

      {/* Right — QR / code display */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 64 }}>
        <div style={{ width: '100%', maxWidth: 380 }}>
          {/* Tab switcher */}
          <div style={{ display: 'flex', gap: 0, marginBottom: 28, border: `1px solid ${P.rule}`, borderRadius: 4, overflow: 'hidden' }}>
            {(['scan', 'code'] as const).map(t => (
              <button key={t} onClick={() => setStep(t)} style={{ flex: 1, padding: '9px 0', background: step === t ? P.ink : 'transparent', color: step === t ? P.paper : P.inkSoft, border: 'none', cursor: 'pointer', fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.14em' }}>
                {t === 'scan' ? 'QR CODE' : 'WORD CODE'}
              </button>
            ))}
          </div>

          {step === 'scan' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
              {/* QR placeholder */}
              <div style={{ width: 220, height: 220, background: P.paperRaised, border: `1px solid ${P.rule}`, borderRadius: 4, display: 'grid', placeItems: 'center', position: 'relative' }}>
                <svg viewBox="0 0 80 80" width="180" height="180" fill="none">
                  {/* QR corner markers */}
                  {[[4,4],[52,4],[4,52]].map(([x,y],i) => (
                    <g key={i}>
                      <rect x={x} y={y} width={24} height={24} fill={P.ink} rx={2}/>
                      <rect x={x+4} y={y+4} width={16} height={16} fill={P.paper} rx={1}/>
                      <rect x={x+8} y={y+8} width={8} height={8} fill={P.ink} rx={1}/>
                    </g>
                  ))}
                  {/* Scattered dots suggesting QR data */}
                  {[32,34,36,38,40,42,44,46,48,50,52,54,56,58,60,62,64,66,68,70].map((x,i) => (
                    [32,36,40,44,48,52,56,60,64,68].map((y,j) => (
                      (i+j)%3 !== 0 ? null : <rect key={`${i}-${j}`} x={x} y={y} width={2} height={2} fill={P.ink} />
                    ))
                  ))}
                  {/* Bottom-right marker */}
                  <rect x={52} y={52} width={24} height={24} fill={P.ink} rx={2}/>
                  <rect x={56} y={56} width={16} height={16} fill={P.paper} rx={1}/>
                  <rect x={60} y={60} width={8} height={8} fill={P.ink} rx={1}/>
                </svg>
              </div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: P.inkMuted, letterSpacing: '0.12em', textAlign: 'center' }}>
                EXPIRES IN 4:58 · SINGLE USE
              </div>
              <button style={{ padding: '8px 20px', border: `1px solid ${P.rule}`, borderRadius: 3, background: 'transparent', color: P.inkSoft, fontFamily: "'Newsreader', serif", fontStyle: 'italic', fontSize: 14, cursor: 'pointer' }}>
                Regenerate code
              </button>
            </div>
          )}

          {step === 'code' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <p style={{ fontSize: 14, color: P.inkSoft, margin: 0, lineHeight: 1.55 }}>
                Type these six words exactly into the Vitni mobile app, in order.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {wordCode.map((w, i) => (
                  <div key={w} style={{ padding: '12px 14px', background: P.paperRaised, border: `1px solid ${P.rule}`, borderRadius: 3, display: 'flex', gap: 10, alignItems: 'center' }}>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: P.inkMuted, width: 14 }}>{i + 1}.</span>
                    <span style={{ fontSize: 16, fontStyle: 'italic', fontWeight: 600 }}>{w}</span>
                  </div>
                ))}
              </div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: P.inkMuted, letterSpacing: '0.12em', textAlign: 'center', marginTop: 4 }}>
                EXPIRES IN 4:58 · SINGLE USE
              </div>
            </div>
          )}

          <div style={{ marginTop: 28, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <button onClick={() => navigate('/lock')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'Newsreader', serif", fontStyle: 'italic', fontSize: 14, color: P.inkSoft, textAlign: 'left', padding: '4px 0' }}>← Back to lock screen</button>
          </div>

          <div style={{ marginTop: 32, paddingTop: 18, borderTop: `1px solid ${P.ruleSoft}`, fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: P.inkMuted, letterSpacing: '0.14em' }}>
            DEVICE PAIRING · LOCAL ONLY · v0.6
          </div>
        </div>
      </div>
    </div>
  )
}
