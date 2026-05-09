import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import { DossierMark } from '../components/DossierMark'


export function Lock() {
  const { P } = useTheme()
  const navigate = useNavigate()
  const [passphrase, setPassphrase] = useState('')

  const stamps = [
    { label: 'LOCAL ONLY', rotate: -8, top: '14%', left: '10%' },
    { label: 'ENCRYPTED', rotate: 5, top: '38%', left: '6%' },
    { label: 'HALT · IDENTIFY', rotate: -4, top: '62%', left: '12%' },
  ]

  return (
    <div style={{ width: '100%', height: '100vh', background: P.paper, color: P.ink, fontFamily: "'Newsreader', 'Source Serif 4', Georgia, serif", display: 'grid', gridTemplateColumns: '1fr 1fr', overflow: 'hidden' }}>
      {/* Left — stamp art */}
      <div style={{ background: P.paperSunk, borderRight: `1px solid ${P.rule}`, position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 48 }}>
        {stamps.map(s => (
          <div key={s.label} style={{ position: 'absolute', top: s.top, left: s.left, padding: '8px 20px', border: `2px solid ${P.stamp}`, color: P.stamp, fontFamily: "'JetBrains Mono', monospace", fontSize: 14, letterSpacing: '0.22em', fontWeight: 700, transform: `rotate(${s.rotate}deg)`, boxShadow: `inset 0 0 0 1px ${P.stamp}` }}>
            {s.label}
          </div>
        ))}
        <div style={{ textAlign: 'center' }}>
          <DossierMark size={72} P={P} />
          <h1 style={{ marginTop: 24, fontSize: 36, fontStyle: 'italic', fontWeight: 600, letterSpacing: '-0.012em', lineHeight: 1.05 }}>
            Halt.<br />Identify yourself.
          </h1>
          <p style={{ marginTop: 14, fontSize: 14, color: P.inkSoft, lineHeight: 1.55, maxWidth: 320 }}>
            This casebook is locked. Enter your passphrase to resume your investigation. Nothing inside can be read without it.
          </p>
        </div>
      </div>

      {/* Right — unlock form */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 64 }}>
        <div style={{ width: '100%', maxWidth: 380 }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: P.inkMuted, letterSpacing: '0.18em', marginBottom: 4 }}>ACTIVE CASE</div>
          <div style={{ fontSize: 22, fontStyle: 'italic', fontWeight: 600, marginBottom: 32 }}>{'No case'}</div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.16em', color: P.inkMuted, display: 'block', marginBottom: 8 }}>PASSPHRASE</label>
            <input type="password" value={passphrase} onChange={e => setPassphrase(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') navigate('/investigation') }} placeholder="Enter passphrase…" autoFocus style={{ width: '100%', padding: '13px 14px', background: P.paperRaised, border: `1px solid ${P.rule}`, borderRadius: 4, fontFamily: "'Newsreader', serif", fontStyle: 'italic', fontSize: 18, color: P.ink, outline: 'none', boxSizing: 'border-box' }} />
          </div>

          <button onClick={() => navigate('/investigation')} style={{ width: '100%', padding: '12px 14px', background: P.stamp, color: P.mode === 'dark' ? '#1c1812' : '#f3ebd8', border: 'none', borderRadius: 4, fontFamily: "'Newsreader', serif", fontStyle: 'italic', fontSize: 16, fontWeight: 600, cursor: 'pointer', boxShadow: P.shadow, marginBottom: 18 }}>
            Unlock workspace →
          </button>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <button onClick={() => navigate('/recovery')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'Newsreader', serif", fontStyle: 'italic', fontSize: 14, color: P.inkSoft, textAlign: 'left', padding: '4px 0' }}>Forgot passphrase? Use recovery key →</button>
            <button onClick={() => navigate('/pair')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'Newsreader', serif", fontStyle: 'italic', fontSize: 14, color: P.inkSoft, textAlign: 'left', padding: '4px 0' }}>Unlock via paired device →</button>
          </div>

          <div style={{ marginTop: 36, paddingTop: 18, borderTop: `1px solid ${P.ruleSoft}`, fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: P.inkMuted, letterSpacing: '0.14em' }}>
            AES-256-GCM · LOCAL ONLY · v0.6
          </div>
        </div>
      </div>
    </div>
  )
}
