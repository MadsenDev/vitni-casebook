import { useState } from 'react'
import { useTheme } from '../context/ThemeContext'
import { TopBar } from '../components/TopBar'
import { caseData } from '../data/caseData'
import { Stamp } from '../components/Stamp'

const C = caseData

const templates = [
  { id: 'narrative', title: 'Chronological narrative', sub: 'A time-ordered account of events with inline citations and evidence references. Suitable for a court submission or editorial brief.', icon: '☰', badges: ['PDF', 'Word', 'Markdown'] },
  { id: 'brief', title: 'Subject brief', sub: 'A one-page profile of a single entity — background, relationships, assertions, and confidence ratings. Good for a briefing note.', icon: '◐', badges: ['PDF', 'One-page'] },
  { id: 'register', title: 'Assertions register', sub: 'A tabular register of every fact: status, confidence, source count, and author. Designed for a review meeting or legal handover.', icon: '≡', badges: ['PDF', 'CSV'] },
]

const resumeDrafts = [
  { title: 'Op. Glass Harbor — Narrative v2', modified: '2 hours ago', status: 'draft' },
  { title: 'Voss subject brief', modified: '3 days ago', status: 'draft' },
  { title: 'Final assertions register', modified: '1 week ago', status: 'final' },
]

function Gallery({ onPick, P }: { onPick: (id: string) => void; P: ReturnType<typeof useTheme>['P'] }) {
  return (
    <div style={{ overflow: 'auto', padding: '40px 60px', flex: 1 }}>
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: P.inkMuted, letterSpacing: '0.18em', marginBottom: 4 }}>BOOK IV · DELIVERABLE</div>
      <h1 style={{ margin: '0 0 6px', fontSize: 36, fontStyle: 'italic', fontWeight: 600, letterSpacing: '-0.012em' }}>Reports</h1>
      <p style={{ margin: '0 0 36px', fontSize: 15, color: P.inkSoft, lineHeight: 1.5 }}>Choose a template, then edit the prose with live citations pulled from your dossier.</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginBottom: 48 }}>
        {templates.map(t => (
          <div key={t.id} onClick={() => onPick(t.id)} style={{ padding: '24px 22px', background: P.paperRaised, border: `1px solid ${P.rule}`, borderRadius: 4, cursor: 'pointer', boxShadow: P.shadow, display: 'flex', flexDirection: 'column', gap: 10, minHeight: 200 }}>
            <div style={{ fontSize: 28, color: P.stamp }}>{t.icon}</div>
            <div style={{ fontSize: 19, fontStyle: 'italic', fontWeight: 600, lineHeight: 1.2 }}>{t.title}</div>
            <div style={{ fontSize: 13, color: P.inkSoft, lineHeight: 1.5, flex: 1 }}>{t.sub}</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {t.badges.map(b => <span key={b} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: '0.14em', padding: '2px 7px', border: `1px solid ${P.ruleSoft}`, borderRadius: 2, color: P.inkMuted }}>{b}</span>)}
            </div>
          </div>
        ))}
      </div>

      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: P.inkMuted, letterSpacing: '0.18em', marginBottom: 12 }}>RESUME DRAFT</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {resumeDrafts.map(d => (
          <div key={d.title} onClick={() => onPick('narrative')} style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: 18, alignItems: 'center', padding: '12px 16px', background: P.paper, border: `1px solid ${P.ruleSoft}`, borderRadius: 3, cursor: 'pointer', boxShadow: P.shadow }}>
            <div style={{ fontSize: 14, fontStyle: 'italic' }}>{d.title}</div>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: P.inkMuted }}>{d.modified}</span>
            <Stamp status={d.status === 'final' ? 'verified' : 'review'} rotate={0} P={P} />
          </div>
        ))}
      </div>
    </div>
  )
}

function NarrativeEditor({ P }: { P: ReturnType<typeof useTheme>['P'] }) {
  const outline = ['I. Background', 'II. Corporate structure', 'III. Wire transfer', 'IV. Marina meeting', 'V. Witness testimony', 'VI. Disputed ownership', 'VII. Findings']
  const [activeChapter, setActiveChapter] = useState(0)

  const bodyParagraphs = [
    `The investigation concerns a suspected layered transfer of €150,000 via shell entities, with Lena Voss as the primary subject. The transfer originated from Glass Harbor Holdings LLC, a private limited company registered in Limassol, Cyprus, on 14 July 2022 (see §c1).`,
    `Glass Harbor wired the sum to Marina Trust S.A. on 12 August 2025 at 14:31 CEST (see §w1, §w2). The originating account at Hellenic Bank carries the reference line redacted in the SWIFT MT103 obtained from the bank (Source S-01).`,
    `On 3 September 2025, the subject's mobile number registered on the Kiel-Nord cell tower at 09:38, consistent with arrival at Harborside Marina. A four-minute call to Marko Reiter followed at 09:42 (see §a3). CCTV camera M3 recorded two figures at Berth 14 at 09:47 (see §c in CCTV exhibit).`,
  ]

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr 280px', height: '100%', overflow: 'hidden' }}>
      {/* Outline rail */}
      <div style={{ background: P.paperSunk, borderRight: `1px solid ${P.rule}`, padding: '20px 16px', overflow: 'auto' }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: P.inkMuted, letterSpacing: '0.18em', marginBottom: 10 }}>OUTLINE</div>
        {outline.map((ch, i) => {
          const active = i === activeChapter
          return <button key={i} onClick={() => setActiveChapter(i)} style={{ display: 'block', width: '100%', textAlign: 'left', padding: '8px 10px', borderRadius: 3, background: active ? P.stampSoft : 'transparent', borderLeft: active ? `2px solid ${P.stamp}` : '2px solid transparent', marginLeft: -2, border: 'none', cursor: 'pointer', fontSize: 13, fontStyle: active ? 'italic' : 'normal', color: active ? P.ink : P.inkSoft, marginBottom: 2 }}>{ch}</button>
        })}
        <div style={{ marginTop: 20, paddingTop: 14, borderTop: `1px solid ${P.ruleSoft}` }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: P.inkMuted, letterSpacing: '0.18em', marginBottom: 8 }}>EXPORT</div>
          {['Download PDF', 'Download Word', 'Copy Markdown'].map(b => <button key={b} style={{ display: 'block', width: '100%', marginBottom: 6, padding: '7px 10px', border: `1px solid ${P.ruleSoft}`, borderRadius: 3, background: 'transparent', color: P.inkSoft, fontFamily: "'Newsreader', serif", fontStyle: 'italic', fontSize: 12, cursor: 'pointer', textAlign: 'left' }}>{b}</button>)}
        </div>
      </div>

      {/* Paper sheet */}
      <div style={{ overflow: 'auto', padding: '40px 54px', background: P.paper }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: P.inkMuted, letterSpacing: '0.18em', marginBottom: 18 }}>
          <span>OPERATION GLASS HARBOR · NARRATIVE REPORT</span>
          <span>{C.caseId} · DRAFT</span>
        </div>
        <h1 style={{ margin: '0 0 6px', fontSize: 32, fontStyle: 'italic', fontWeight: 600, letterSpacing: '-0.012em' }}>{outline[activeChapter]}</h1>
        <div style={{ width: 48, height: 1, background: P.stamp, marginBottom: 24 }} />
        {bodyParagraphs.map((p, i) => (
          <p key={i} style={{ margin: '0 0 18px', fontSize: 15, lineHeight: 1.65, color: P.ink }}>{p}</p>
        ))}
        {/* Citation chip example */}
        <div style={{ margin: '24px 0', padding: '14px 18px', background: P.paperRaised, border: `1px solid ${P.ruleSoft}`, borderRadius: 3, borderLeft: `3px solid ${P.stamp}` }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: P.stamp, letterSpacing: '0.14em', marginBottom: 6 }}>§a1 · FACT CITATION</div>
          <div style={{ fontSize: 14, fontStyle: 'italic', color: P.ink }}>"Beneficial owner of Glass Harbor Holdings LLC."</div>
          <div style={{ marginTop: 8, display: 'flex', gap: 6 }}>
            <Stamp status="disputed" rotate={0} P={P} />
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: P.inkMuted }}>conf. 55% · 2 sources</span>
          </div>
        </div>
      </div>

      {/* Exhibits rail */}
      <div style={{ background: P.paperSunk, borderLeft: `1px solid ${P.rule}`, padding: '20px 16px', overflow: 'auto' }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: P.inkMuted, letterSpacing: '0.18em', marginBottom: 10 }}>SUGGESTED EXHIBITS</div>
        {[{ label: 'Bank stmt 08-2025', type: 'PDF', ref: 'EXH-01' }, { label: 'SWIFT MT103', type: 'Doc', ref: 'EXH-02' }, { label: 'CCTV M3-09-03.mp4', type: 'Video', ref: 'EXH-03' }, { label: 'Witness · A. Holm', type: 'Statement', ref: 'EXH-04' }].map(ex => (
          <div key={ex.ref} style={{ padding: '10px 10px', marginBottom: 8, background: P.paper, border: `1px solid ${P.ruleSoft}`, borderRadius: 3, cursor: 'pointer' }}>
            <div style={{ fontSize: 12, fontStyle: 'italic' }}>{ex.label}</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: P.inkMuted }}>
              <span>{ex.type}</span><span>{ex.ref}</span>
            </div>
          </div>
        ))}
        <div style={{ marginTop: 14, paddingTop: 14, borderTop: `1px solid ${P.ruleSoft}` }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: P.inkMuted, letterSpacing: '0.18em', marginBottom: 8 }}>FACTS IN THIS CHAPTER</div>
          {C.getAssertions('lena').slice(0, 3).map(a => (
            <div key={a.id} style={{ marginBottom: 8, padding: '8px 10px', background: P.paper, border: `1px solid ${P.ruleSoft}`, borderRadius: 3 }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: P.stamp, marginBottom: 3 }}>§{a.id.toUpperCase()}</div>
              <div style={{ fontSize: 11.5, fontStyle: 'italic', color: P.ink, lineHeight: 1.35 }}>{a.text.length > 60 ? a.text.slice(0, 58) + '…' : a.text}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function Reports({ onSearch, onAvatar }: { onSearch?: () => void; onAvatar?: () => void }) {
  const { P } = useTheme()
  const [view, setView] = useState<'gallery' | 'narrative'>('gallery')

  return (
    <div style={{ width: '100%', height: '100vh', background: P.paper, color: P.ink, fontFamily: "'Newsreader', 'Source Serif 4', Georgia, serif", display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <TopBar P={P} onAvatarClick={onAvatar} onSearchClick={onSearch} />
      {view === 'gallery'
        ? <Gallery onPick={() => setView('narrative')} P={P} />
        : (
          <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '8px 22px', background: P.paperSunk, borderBottom: `1px solid ${P.rule}`, display: 'flex', alignItems: 'center', gap: 14, fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: P.inkMuted }}>
              <button onClick={() => setView('gallery')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: P.inkSoft, fontFamily: "'Newsreader', serif", fontStyle: 'italic', fontSize: 13 }}>← Reports</button>
              <span style={{ color: P.ruleSoft }}>|</span>
              <span style={{ letterSpacing: '0.12em' }}>CHRONOLOGICAL NARRATIVE · DRAFT</span>
              <span style={{ marginLeft: 'auto' }}>Last saved 2 min ago</span>
            </div>
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <NarrativeEditor P={P} />
            </div>
          </div>
        )}
    </div>
  )
}
