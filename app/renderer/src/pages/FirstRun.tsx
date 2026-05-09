import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import { DossierMark } from '../components/DossierMark'
import { useAppStore } from '../store/appStore'

export function FirstRun() {
  const { P } = useTheme()
  const navigate = useNavigate()
  const { cases, loadCases, openCase } = useAppStore()

  useEffect(() => { loadCases() }, [loadCases])

  const handleOpen = async (id: string) => {
    await openCase(id)
    navigate('/investigation')
  }

  const cards = [
    { kind: 'NEW · BLANK', title: 'Start a new case', body: 'A clean dossier. You bring the subject, sources, and structure.', cta: 'New case', primary: true, kbd: '⌘ N', action: () => navigate('/new-case') },
    { kind: 'NEW · STARTER', title: 'Use a starter', body: 'Subject brief · financial trace · missing person. Pre-shaped folders, prompts, and a starting subject.', cta: 'Pick a starter', primary: false, kbd: null, action: () => navigate('/new-case') },
    { kind: 'OPEN · DISK', title: 'Open an existing case', body: 'A .casebook archive on disk. Vitni opens it offline; you choose whether to unlock now.', cta: 'Open from file…', primary: false, kbd: '⌘ O', action: () => navigate('/new-case') },
  ]

  return (
    <div style={{ width: '100%', height: '100vh', background: P.paper, color: P.ink, fontFamily: "'Newsreader', 'Source Serif 4', Georgia, serif", display: 'grid', gridTemplateRows: '64px 1fr 28px', overflow: 'hidden' }}>
      {/* Top bar */}
      <div style={{ height: 64, padding: '0 22px', borderBottom: `1px solid ${P.rule}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <DossierMark size={28} P={P} />
          <div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, letterSpacing: '0.2em', color: P.inkMuted }}>VITNI · CASEBOOK</div>
            <div style={{ fontSize: 17, fontStyle: 'italic', fontWeight: 600, letterSpacing: '-0.01em', marginTop: 1 }}>No case loaded</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: P.inkMuted, letterSpacing: '0.14em' }}>v0.6 · LOCAL ONLY</span>
          <div style={{ width: 30, height: 30, borderRadius: '50%', background: P.ink, color: P.paper, display: 'grid', placeItems: 'center', fontFamily: "'Newsreader', serif", fontSize: 13, fontStyle: 'italic', boxShadow: P.shadow }}>cm</div>
        </div>
      </div>

      {/* Body */}
      <div style={{ overflow: 'auto', padding: '54px 80px 60px', display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 380px', gap: 56, alignContent: 'start' }}>
        <div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.18em', color: P.inkMuted }}>WELCOME · FIRST RUN</div>
          <h1 style={{ fontSize: 44, fontStyle: 'italic', fontWeight: 600, letterSpacing: '-0.018em', margin: '12px 0 14px', lineHeight: 1.05, maxWidth: 660 }}>
            A casebook is a place where evidence becomes <em>findings</em>.
          </h1>
          <p style={{ margin: 0, fontSize: 16, color: P.inkSoft, lineHeight: 1.55, maxWidth: 580 }}>
            Vitni keeps your sources, your notes, and the chain between them on <em>this device</em>. Every fact has provenance. Every disagreement is recorded. Nothing leaves your machine unless you say so.
          </p>

          <div style={{ marginTop: 38, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
            {cards.map(c => (
              <div key={c.kind} style={{ background: P.paperRaised, border: `1px solid ${P.rule}`, borderRadius: 4, padding: '20px 20px 18px', display: 'flex', flexDirection: 'column', gap: 10, minHeight: 250, boxShadow: c.primary ? P.shadowLg : P.shadow }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, letterSpacing: '0.18em', color: c.primary ? P.stamp : P.inkMuted }}>{c.kind}</div>
                <div style={{ fontSize: 19, fontStyle: 'italic', fontWeight: 600, letterSpacing: '-0.01em', lineHeight: 1.2 }}>{c.title}</div>
                <div style={{ fontSize: 13, color: P.inkSoft, lineHeight: 1.5, flex: 1 }}>{c.body}</div>
                <button onClick={c.action} style={{ marginTop: 8, background: c.primary ? P.stamp : 'transparent', color: c.primary ? (P.mode === 'dark' ? '#1c1812' : '#f3ebd8') : P.ink, border: c.primary ? 'none' : `1px solid ${P.ink}`, padding: '9px 14px', borderRadius: 3, cursor: 'pointer', fontFamily: "'Newsreader', serif", fontStyle: 'italic', fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span>{c.cta}</span>
                  {c.kbd && <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.06em', color: c.primary ? 'rgba(243,235,216,0.7)' : P.inkMuted }}>{c.kbd}</span>}
                </button>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 28, border: `1.5px dashed ${P.ruleStrong}`, borderRadius: 4, padding: '28px 32px', background: P.paperSunk, display: 'flex', alignItems: 'center', gap: 18 }}>
            <div style={{ width: 54, height: 54, borderRadius: '50%', border: `1px dashed ${P.ruleStrong}`, display: 'grid', placeItems: 'center', flexShrink: 0, fontFamily: "'Newsreader', serif", fontStyle: 'italic', fontSize: 26, color: P.inkSoft }}>↧</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 16, fontStyle: 'italic', fontWeight: 600 }}>Drop evidence here to begin a case from it</div>
              <div style={{ fontSize: 12.5, color: P.inkSoft, marginTop: 2, lineHeight: 1.5 }}>PDFs, photographs, CSV ledgers, MP4 clips, plain text. Vitni will extract metadata, OCR what it can, and ask you what the case is <em>about</em>.</div>
            </div>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.16em', color: P.inkMuted }}>OR PRESS ⌘ I</span>
          </div>
        </div>

        {/* Sidebar */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: 26 }}>
          {/* Recent cases */}
          <div style={{ padding: '20px', background: P.paperRaised, border: `1px solid ${P.rule}`, borderRadius: 4, boxShadow: P.shadow }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: P.inkMuted, letterSpacing: '0.18em', marginBottom: 8 }}>
              {cases.length > 0 ? 'RECENT CASES' : 'NO CASES YET'}
            </div>
            {cases.length > 0 ? (
              <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 4 }}>
                {cases.slice(0, 5).map(c => (
                  <li key={c.id}>
                    <button onClick={() => handleOpen(c.id)} style={{ width: '100%', textAlign: 'left', background: 'transparent', border: `1px solid ${P.ruleSoft}`, borderRadius: 3, padding: '10px 12px', cursor: 'pointer', fontFamily: "'Newsreader', serif" }}>
                      <div style={{ fontSize: 15, fontStyle: 'italic', fontWeight: 600, color: P.ink }}>{c.title}</div>
                      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: P.inkMuted, marginTop: 4, letterSpacing: '0.08em' }}>{c.id.slice(0, 12)} · {c.updatedAt.slice(0, 10)}</div>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div style={{ fontSize: 13, color: P.inkSoft, lineHeight: 1.5, marginBottom: 14 }}>Create your first case to get started.</div>
            )}
            <button onClick={() => navigate('/new-case')} style={{ marginTop: cases.length > 0 ? 12 : 0, width: '100%', padding: '9px 14px', background: 'transparent', color: P.ink, border: `1px solid ${P.rule}`, borderRadius: 3, cursor: 'pointer', fontFamily: "'Newsreader', serif", fontStyle: 'italic', fontSize: 13, fontWeight: 600 }}>New case →</button>
          </div>

          {/* Privacy promise */}
          <div style={{ padding: '18px', background: P.paperSunk, border: `1px solid ${P.ruleSoft}`, borderRadius: 4 }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: P.inkMuted, letterSpacing: '0.18em', marginBottom: 10 }}>LOCAL-FIRST PROMISE</div>
            {[['No cloud sync', 'Your data never leaves this device unless you export it.'], ['Encrypted at rest', 'AES-256 behind the passphrase you set at case creation.'], ['Auditable', 'Every change is signed and logged in a tamper-evident chain.'], ['Yours', 'Delete the app; the archive stays. Open the archive elsewhere.']].map(([k, v]) => (
              <div key={k} style={{ marginBottom: 10, paddingBottom: 10, borderBottom: `1px dotted ${P.ruleSoft}` }}>
                <div style={{ fontSize: 13, fontWeight: 600, fontStyle: 'italic' }}>{k}</div>
                <div style={{ fontSize: 12, color: P.inkSoft, marginTop: 2, lineHeight: 1.4 }}>{v}</div>
              </div>
            ))}
          </div>

          {/* Recovery key status */}
          <div style={{ padding: '14px 18px', background: P.stampSoft, border: `1px solid ${P.stamp}`, borderRadius: 4, display: 'flex', gap: 10, alignItems: 'center' }}>
            <span style={{ fontSize: 18, color: P.stamp }}>⚿</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600, fontStyle: 'italic', color: P.ink }}>No recovery key set</div>
              <div style={{ fontSize: 11.5, color: P.inkSoft, marginTop: 2 }}>Set one after creating your first case.</div>
            </div>
          </div>
        </aside>
      </div>

      {/* Footer */}
      <div style={{ height: 28, background: P.paperSunk, borderTop: `1px solid ${P.rule}`, padding: '0 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: P.inkMuted, letterSpacing: '0.16em' }}>
        <span>● LOCAL · ENCRYPTED · v0.6</span>
        <span>NO RECOVERY KEY · ENCRYPTED AT REST</span>
      </div>
    </div>
  )
}
