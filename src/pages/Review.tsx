import { useState } from 'react'
import { useTheme } from '../context/ThemeContext'
import { TopBar } from '../components/TopBar'
import { Stamp } from '../components/Stamp'
import { caseData } from '../data/caseData'
import type { AssertionStatus } from '../design/palette'

const C = caseData

interface QueueItem {
  node: ReturnType<typeof C.findNode>
  aId: string; priority: 'high' | 'med' | 'low'; age: string; evidence: string; thumb: 'cctv' | 'memo' | 'doc'
  assertion: { id: string; text: string; sources: string[]; status: AssertionStatus; confidence: number; by: string; at: string }
}

function buildQueue(): QueueItem[] {
  const items: QueueItem[] = []
  const targets: Array<{ node: string; aId: string; priority: QueueItem['priority']; age: string; evidence: string; thumb: QueueItem['thumb'] }> = [
    { node: 'lena',  aId: 'a1', priority: 'high', age: '2 days ago', evidence: 'Whistle-blower memo · 8 pp.', thumb: 'memo' },
    { node: 'lena',  aId: 'a4', priority: 'high', age: '4 hours ago', evidence: 'CCTV M3-09-03.mp4 · 04:51',  thumb: 'cctv' },
    { node: 'marko', aId: 'b2', priority: 'med',  age: '4 hours ago', evidence: 'CCTV M3-09-03.mp4 · 04:51',  thumb: 'cctv' },
    { node: 'lena',  aId: 'a2', priority: 'low',  age: '5 days ago',  evidence: 'Anmeldung scan · 1 pp.',      thumb: 'doc' },
  ]
  for (const t of targets) {
    const node = C.findNode(t.node)
    const a = (C.assertions[t.node] ?? []).find(x => x.id === t.aId)
    if (!a || !node) continue
    items.push({ ...t, node, assertion: a })
  }
  items.push({ node: C.findNode('marko'), aId: 'r-marina', priority: 'med', age: 'today', evidence: 'CCTV M3-09-03.mp4 · 04:51', thumb: 'cctv', assertion: { id: 'r-marina', text: 'Marko Reiter and Lena Voss were physically co-located at Berth 14 on 2025-09-03.', sources: ['CCTV M3-09-03.mp4', 'Witness · A. Holm', 'Telenor CDR'], status: 'review', confidence: 0.62, by: 'C. Madsen', at: 'today' } })
  items.push({ node: C.findNode('lena'), aId: 'r-cyp', priority: 'low', age: 'today', evidence: 'Cyprus registry letter', thumb: 'doc', assertion: { id: 'r-cyp', text: 'Beneficial-owner declaration absent from Cyprus filings.', sources: ['Cyprus registry letter CY-OUT-1142'], status: 'review', confidence: 0.45, by: 'C. Madsen', at: 'today' } })
  return items
}

const queue = buildQueue()

function Thumb({ kind, P }: { kind: QueueItem['thumb']; P: ReturnType<typeof useTheme>['P'] }) {
  const stroke = P.inkSoft
  return (
    <div style={{ width: 84, height: 64, flexShrink: 0, background: P.paperSunk, borderRadius: 3, border: `1px solid ${P.ruleSoft}`, overflow: 'hidden' }}>
      {kind === 'cctv' && (
        <svg viewBox="0 0 84 64" width="100%" height="100%">
          <rect x="6" y="8" width="72" height="48" fill="none" stroke={stroke} strokeWidth="0.8" strokeDasharray="2 2"/>
          <circle cx="42" cy="32" r="9" fill="none" stroke={P.stamp} strokeWidth="1"/>
          <circle cx="42" cy="32" r="4" fill={P.stamp} opacity="0.6"/>
          <text x="9" y="16" fontFamily="'JetBrains Mono', monospace" fontSize="6" fill={P.inkMuted}>M3 · 09:42:11</text>
          <text x="78" y="55" fontFamily="'JetBrains Mono', monospace" fontSize="6" fill={P.inkMuted} textAnchor="end">REC ●</text>
        </svg>
      )}
      {kind === 'memo' && (
        <svg viewBox="0 0 84 64" width="100%" height="100%">
          <rect x="14" y="6" width="56" height="52" fill={P.paper} stroke={stroke} strokeWidth="0.8"/>
          {[14, 20, 26, 32, 38, 44, 50].map(y => <line key={y} x1="20" y1={y} x2={y === 14 ? 50 : 64} y2={y} stroke={stroke} strokeWidth="0.5" opacity="0.6"/>)}
        </svg>
      )}
      {kind === 'doc' && (
        <svg viewBox="0 0 84 64" width="100%" height="100%">
          <rect x="20" y="6" width="44" height="52" fill={P.paper} stroke={stroke} strokeWidth="0.8"/>
          <rect x="20" y="6" width="44" height="10" fill={P.ruleSoft}/>
          {[22, 28, 34, 40, 46].map(y => <line key={y} x1="24" y1={y} x2={y === 28 ? 50 : 60} y2={y} stroke={stroke} strokeWidth="0.5" opacity="0.55"/>)}
        </svg>
      )}
    </div>
  )
}

function FactCard({ item, active, onSelect, decision, P }: { item: QueueItem; active: boolean; onSelect: (action?: string) => void; decision?: string; P: ReturnType<typeof useTheme>['P'] }) {
  const a = item.assertion
  return (
    <div onClick={() => onSelect()} style={{ padding: '16px 18px', background: active ? P.paperRaised : P.paper, border: `1px solid ${active ? P.stamp : P.ruleSoft}`, borderRadius: 4, cursor: 'pointer', boxShadow: active ? P.shadowLg : P.shadow, position: 'relative' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: P.inkMuted, letterSpacing: '0.12em', marginBottom: 10 }}>
        <span style={{ width: 7, height: 7, borderRadius: '50%', background: item.priority === 'high' ? P.disputed : item.priority === 'med' ? P.review : P.inkMuted, display: 'inline-block' }} />
        <span>{item.priority.toUpperCase()} PRIORITY</span>
        <span style={{ color: P.ruleStrong }}>·</span>
        <span style={{ fontStyle: 'italic', fontFamily: "'Newsreader', serif", fontSize: 12, color: P.inkSoft, letterSpacing: 'normal' }}>on {item.node?.label}</span>
        <span style={{ marginLeft: 'auto' }}>{a.by} · {item.age}</span>
      </div>
      <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
        <Thumb kind={item.thumb} P={P} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: "'Newsreader', serif", fontStyle: 'italic', fontSize: 16, lineHeight: 1.4, color: P.ink }}>"{a.text}"</div>
          <div style={{ marginTop: 10, fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: P.inkMuted, letterSpacing: '0.1em', display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {a.sources.slice(0, 3).map((s, i) => (
              <span key={i} style={{ padding: '2px 8px', border: `1px solid ${P.ruleSoft}`, borderRadius: 2, background: P.paperSunk }}>S-{String(i + 1).padStart(2, '0')} · {s.length > 28 ? s.slice(0, 26) + '…' : s}</span>
            ))}
            {a.sources.length > 3 && <span style={{ padding: '2px 8px', color: P.inkSoft }}>+{a.sources.length - 3} more</span>}
          </div>
          <div style={{ marginTop: 12, display: 'grid', gridTemplateColumns: '110px 1fr 60px', gap: 12, alignItems: 'center' }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: P.inkMuted, letterSpacing: '0.14em' }}>CONFIDENCE</span>
            <div style={{ height: 6, background: P.paperSunk, borderRadius: 1, border: `1px solid ${P.ruleSoft}`, position: 'relative' }}>
              <div style={{ position: 'absolute', inset: 0, width: `${a.confidence * 100}%`, background: a.confidence < 0.5 ? P.disputed : a.confidence < 0.75 ? P.review : P.asserted, borderRadius: 1 }} />
            </div>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: P.ink, textAlign: 'right' }}>{Math.round(a.confidence * 100)}%</span>
          </div>
        </div>
      </div>
      <div style={{ marginTop: 14, paddingTop: 12, borderTop: `1px dotted ${P.ruleSoft}`, display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
        {[{ k: 'verified', label: 'Verify', fg: P.asserted }, { k: 'disputed', label: 'Dispute', fg: P.disputed }, { k: 'rejected', label: 'Reject', fg: P.inkMuted }, { k: 'defer', label: 'Defer', fg: P.inkSoft }].map(b => {
          const isActive = decision === b.k
          return (
            <button key={b.k} onClick={e => { e.stopPropagation(); onSelect(b.k) }} style={{ fontFamily: "'Newsreader', serif", fontSize: 13, fontStyle: 'italic', padding: '6px 14px', border: `1px solid ${isActive ? b.fg : P.ruleSoft}`, borderRadius: 3, cursor: 'pointer', background: isActive ? b.fg : 'transparent', color: isActive ? P.paper : b.fg, fontWeight: isActive ? 600 : 500 }}>{b.label}</button>
          )
        })}
        <span style={{ marginLeft: 'auto', fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: P.inkMuted, letterSpacing: '0.12em' }}>⌘1·2·3·4</span>
      </div>
      {decision && decision !== 'defer' && (
        <div style={{ position: 'absolute', top: 14, right: 14 }}>
          <Stamp status={decision as AssertionStatus} rotate={4} P={P} />
        </div>
      )}
    </div>
  )
}

function Provenance({ item, decision, P }: { item: QueueItem; decision?: string; P: ReturnType<typeof useTheme>['P'] }) {
  const a = item.assertion
  return (
    <div style={{ height: '100%', overflow: 'auto', padding: '28px 30px', background: P.paperRaised, borderLeft: `1px solid ${P.rule}`, fontFamily: "'Newsreader', 'Source Serif 4', Georgia, serif", color: P.ink }}>
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: P.inkMuted, letterSpacing: '0.18em', marginBottom: 10 }}>PROVENANCE · {a.id.toUpperCase()}</div>
      <div style={{ fontSize: 19, fontStyle: 'italic', fontWeight: 600, lineHeight: 1.25, letterSpacing: '-0.01em' }}>"{a.text}"</div>
      <div style={{ marginTop: 14, display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '8px 14px', fontSize: 13 }}>
        {([['Subject', item.node?.label ?? '—'], ['Type', item.node ? C.typeMeta[item.node.type].label : '—'], ['Author', a.by], ['Created', a.at], ['Confidence', `${Math.round(a.confidence * 100)}% (${a.sources.length} src)`], ['Status', decision ?? a.status]] as [string, string][]).map(([k, v]) => (
          <div key={k} style={{ display: 'contents' }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: P.inkMuted, letterSpacing: '0.12em', paddingTop: 2 }}>{k.toUpperCase()}</div>
            <div style={{ borderBottom: `1px dotted ${P.ruleSoft}`, paddingBottom: 5 }}>{v}</div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 22 }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: P.inkMuted, letterSpacing: '0.18em', marginBottom: 8 }}>SOURCES · {a.sources.length}</div>
        <ol style={{ margin: 0, paddingLeft: 20, fontSize: 13.5, lineHeight: 1.65, color: P.inkSoft }}>
          {a.sources.map((s, i) => (
            <li key={i} style={{ paddingBottom: 6, borderBottom: `1px dotted ${P.ruleSoft}`, marginBottom: 6 }}>
              <div>{s}</div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: P.inkMuted, marginTop: 2, letterSpacing: '0.06em' }}>S-{String(i + 1).padStart(2, '0')} · independent: {i % 2 === 0 ? 'YES' : 'NO'} · weight {Math.round((0.4 + i * 0.18) * 100) / 100}</div>
            </li>
          ))}
        </ol>
      </div>
      <div style={{ marginTop: 22 }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: P.inkMuted, letterSpacing: '0.18em', marginBottom: 8 }}>AUDIT TRAIL</div>
        <div style={{ fontSize: 12.5, color: P.inkSoft, lineHeight: 1.6 }}>
          {[['09:14', 'C. Madsen', 'attached source S-43'], ['08:51', 'C. Madsen', 'authored assertion'], ['08:30', 'system', 'imported via CSV'], ['Yest.', 'C. Madsen', 'flagged for review']].map(([t, who, what], i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '50px 90px 1fr', gap: 10, padding: '5px 0', borderBottom: `1px dotted ${P.ruleSoft}` }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: P.inkMuted }}>{t}</span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5 }}>{who}</span>
              <span>{what}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ marginTop: 22 }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: P.inkMuted, letterSpacing: '0.18em', marginBottom: 8 }}>REVIEWER NOTE</div>
        <div style={{ padding: '12px 14px', minHeight: 84, border: `1px dashed ${P.rule}`, borderRadius: 4, background: P.paper, fontStyle: 'italic', fontSize: 13.5, color: P.inkSoft, lineHeight: 1.5 }}>
          {a.id === 'a1' ? 'Memo unsigned. Need a second corroborating source independent of the whistle-blower channel before promoting.' : a.id === 'a4' ? 'Faces partially obscured in CCTV. Cross-reference with Holm photo array, then re-rate.' : 'No note yet.'}
        </div>
      </div>
    </div>
  )
}

export function Review({ onSearch, onAvatar }: { onSearch?: () => void; onAvatar?: () => void }) {
  const { P } = useTheme()
  const [selected, setSelected] = useState(queue[0].assertion.id)
  const [decisions, setDecisions] = useState<Record<string, string>>({ [queue[2].assertion.id]: 'verified' })
  const [queueId, setQueueId] = useState('to-review')
  const setDecision = (aId: string, d: string) => setDecisions(p => ({ ...p, [aId]: d }))
  const handleCardClick = (aId: string, action?: string) => { setSelected(aId); if (action) setDecision(aId, action) }
  const item = queue.find(q => q.assertion.id === selected) ?? queue[0]
  const decided = Object.values(decisions).filter(v => v && v !== 'defer').length
  const queues = [{ id: 'to-review', label: 'To review', count: queue.length }, { id: 'disputed', label: 'Disputed', count: 1 }, { id: 'changed', label: 'Recently changed', count: 4 }, { id: 'promoted', label: 'Promoted today', count: 2 }, { id: 'rejected', label: 'Rejected', count: 0 }]

  return (
    <div style={{ width: '100%', height: '100vh', background: P.paper, color: P.ink, fontFamily: "'Newsreader', 'Source Serif 4', Georgia, serif", display: 'grid', gridTemplateColumns: '232px 1fr 420px', gridTemplateRows: '64px 1fr 56px', gridTemplateAreas: "'top top top' 'left main right' 'bot bot bot'", overflow: 'hidden' }}>
      <div style={{ gridArea: 'top' }}><TopBar P={P} searchPlaceholder="Filter facts to review…" onAvatarClick={onAvatar} onSearchClick={onSearch} /></div>
      <div style={{ gridArea: 'left', background: P.paperSunk, borderRight: `1px solid ${P.rule}`, padding: '20px 18px', overflow: 'auto', display: 'flex', flexDirection: 'column', gap: 22 }}>
        <div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: P.inkMuted, letterSpacing: '0.18em' }}>QUEUES</div>
          <ul style={{ listStyle: 'none', margin: '10px 0 0', padding: 0, display: 'flex', flexDirection: 'column', gap: 1 }}>
            {queues.map(v => {
              const active = v.id === queueId
              return (
                <li key={v.id} onClick={() => setQueueId(v.id)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '7px 10px', cursor: 'pointer', borderRadius: 3, background: active ? P.stampSoft : 'transparent', borderLeft: active ? `2px solid ${P.stamp}` : '2px solid transparent', marginLeft: -2, paddingLeft: 12 }}>
                  <span style={{ fontSize: 14, fontStyle: active ? 'italic' : 'normal', color: active ? P.ink : P.inkSoft }}>{v.label}</span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: active ? P.stamp : P.inkMuted }}>{v.count}</span>
                </li>
              )
            })}
          </ul>
        </div>
        <div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: P.inkMuted, letterSpacing: '0.18em' }}>PRIORITY</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '6px 12px', marginTop: 10, fontSize: 13, color: P.inkSoft }}>
            {[['High', queue.filter(q => q.priority === 'high').length, P.disputed], ['Medium', queue.filter(q => q.priority === 'med').length, P.review], ['Low', queue.filter(q => q.priority === 'low').length, P.inkMuted]].map(([k, c, col]) => (
              <div key={k as string} style={{ display: 'contents' }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}><span style={{ width: 8, height: 8, borderRadius: '50%', background: col as string, display: 'inline-block' }} />{k}</div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: P.inkMuted }}>{c as number}</div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: P.inkMuted, letterSpacing: '0.18em' }}>FILTER BY SUBJECT</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 10 }}>
            {['All', 'Voss', 'Reiter', 'Glass Harbor', 'Marina'].map((t, i) => (
              <button key={t} style={{ fontFamily: "'Newsreader', serif", fontSize: 12, fontStyle: 'italic', padding: '5px 10px', cursor: 'pointer', borderRadius: 3, border: `1px solid ${i === 0 ? P.ink : P.ruleSoft}`, background: i === 0 ? P.ink : 'transparent', color: i === 0 ? P.paper : P.inkSoft }}>{t}</button>
            ))}
          </div>
        </div>
        <div style={{ marginTop: 'auto', fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: P.inkMuted, letterSpacing: '0.16em', borderTop: `1px solid ${P.ruleSoft}`, paddingTop: 10, display: 'flex', justifyContent: 'space-between' }}>
          <span>● LOCAL · ENCRYPTED</span><span>v0.6</span>
        </div>
      </div>
      <div style={{ gridArea: 'main', overflow: 'auto', padding: '28px 36px', fontFamily: "'Newsreader', 'Source Serif 4', Georgia, serif" }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 18, paddingBottom: 10, borderBottom: `1px solid ${P.rule}` }}>
          <div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: P.inkMuted, letterSpacing: '0.18em' }}>BOOK III · REVIEW QUEUE</div>
            <h1 style={{ margin: '4px 0 0', fontSize: 26, fontWeight: 600, fontStyle: 'italic', letterSpacing: '-0.012em' }}>{queues.find(q => q.id === queueId)?.label} · {queue.length} pending</h1>
          </div>
          <div style={{ display: 'flex', gap: 4 }}>
            {['Sort: priority', 'Group: subject'].map(b => <button key={b} style={{ fontFamily: "'Newsreader', serif", fontStyle: 'italic', fontSize: 12, padding: '5px 12px', border: `1px solid ${P.ruleSoft}`, borderRadius: 3, background: P.paperRaised, color: P.inkSoft, cursor: 'pointer', boxShadow: P.shadow }}>{b}</button>)}
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingBottom: 20 }}>
          {queue.map(q => <FactCard key={q.assertion.id} item={q} active={q.assertion.id === selected} decision={decisions[q.assertion.id]} onSelect={(action) => handleCardClick(q.assertion.id, action)} P={P} />)}
        </div>
      </div>
      <div style={{ gridArea: 'right', overflow: 'hidden' }}><Provenance item={item} decision={decisions[item.assertion.id]} P={P} /></div>
      <div style={{ gridArea: 'bot', background: P.paperSunk, borderTop: `1px solid ${P.rule}`, padding: '0 22px', display: 'flex', alignItems: 'center', gap: 18, fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: P.inkMuted, letterSpacing: '0.12em' }}>
        <span>SESSION · {decided} OF {queue.length} DECIDED</span>
        <div style={{ flex: 1, height: 6, background: P.paper, borderRadius: 1, border: `1px solid ${P.ruleSoft}`, position: 'relative' }}>
          <div style={{ position: 'absolute', inset: 0, width: `${(decided / queue.length) * 100}%`, background: P.asserted, borderRadius: 1 }} />
        </div>
        <span>{Math.round((decided / queue.length) * 100)}%</span>
        <span style={{ width: 1, height: 18, background: P.ruleSoft, display: 'inline-block' }} />
        {['NEXT ↓', 'VERIFY ⌘1', 'DISPUTE ⌘2', 'REJECT ⌘3'].map(s => <span key={s} style={{ color: P.inkSoft }}>{s}</span>)}
      </div>
    </div>
  )
}
