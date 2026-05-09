import { useState, useMemo } from 'react'
import { useTheme } from '../context/ThemeContext'
import { TopBar } from '../components/TopBar'
import { Stamp } from '../components/Stamp'
import { caseData } from '../data/caseData'
import { statusMeta } from '../design/palette'
import type { AssertionStatus } from '../design/palette'
import type { NodeType } from '../data/caseData'

const C = caseData

// ─── Graph
function Graph({ selected, setSelected, filter, P }: {
  selected: string; setSelected: (id: string) => void; filter: string; P: ReturnType<typeof useTheme>['P']
}) {
  const visible = useMemo(() => filter === 'all'
    ? new Set(C.nodes.map(n => n.id))
    : new Set(C.nodes.filter(n => n.type === filter).map(n => n.id)),
    [filter])
  const visEdges = C.edges.filter(e => visible.has(e.a) && visible.has(e.b))
  const visNodes = C.nodes.filter(n => visible.has(n.id))

  return (
    <svg width="100%" height="100%" viewBox="0 0 880 580" style={{ display: 'block', background: 'transparent' }}>
      <defs>
        <pattern id={`paper-${P.mode}`} width="6" height="6" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="0.4" fill={P.texture} />
        </pattern>
        <radialGradient id={`vig-${P.mode}`} cx="50%" cy="40%" r="70%">
          <stop offset="0%" stopColor={P.paper} stopOpacity="0" />
          <stop offset="100%" stopColor="#000" stopOpacity={P.mode === 'dark' ? 0.18 : 0.04} />
        </radialGradient>
        <filter id={`shadow-${P.mode}`} x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="1.5" stdDeviation="1.2"
            floodColor={P.mode === 'dark' ? '#000' : '#1c1812'}
            floodOpacity={P.mode === 'dark' ? 0.5 : 0.10} />
        </filter>
      </defs>
      <rect width="880" height="580" fill={`url(#paper-${P.mode})`} />
      <rect width="880" height="580" fill={`url(#vig-${P.mode})`} pointerEvents="none" />

      {visEdges.map((e, i) => {
        const a = C.findNode(e.a), b = C.findNode(e.b)
        if (!a || !b) return null
        const dash = e.status === 'review' ? '4 4' : e.status === 'disputed' ? '1 3' : undefined
        const involves = e.a === selected || e.b === selected
        const stroke = (involves || e.status === 'disputed') ? P.stamp : P.ink
        const opacity = selected ? (involves ? 0.95 : 0.18) : (e.status === 'review' ? 0.4 : 0.55)
        const sw = involves ? 1.2 : 0.9
        const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2
        return (
          <g key={i}>
            <line x1={a.x} y1={a.y} x2={b.x} y2={b.y}
              stroke={stroke} strokeWidth={sw} strokeDasharray={dash} opacity={opacity} />
            {involves && (
              <text x={mx} y={my - 5} textAnchor="middle"
                fontFamily="'Newsreader', serif" fontStyle="italic" fontSize="10.5" fill={P.inkSoft}>
                <tspan style={{ paintOrder: 'stroke', stroke: P.paper, strokeWidth: 4 }}>{e.label}</tspan>
              </text>
            )}
          </g>
        )
      })}

      {visNodes.map(n => {
        const isSel = n.id === selected
        const isSubject = n.ring === 'subject'
        const dim = Boolean(selected) && !isSel
          && !visEdges.some(e => (e.a === selected && e.b === n.id) || (e.b === selected && e.a === n.id))
        const r = isSubject ? 28 : 22
        return (
          <g key={n.id} transform={`translate(${n.x},${n.y})`}
            style={{ cursor: 'pointer', opacity: dim ? 0.32 : 1, transition: 'opacity 150ms' }}
            onClick={() => setSelected(n.id)}>
            {isSubject && <circle r={r + 6} fill="none" stroke={P.stamp} strokeWidth="1" strokeDasharray="2 3" />}
            <circle r={r} fill={isSel ? P.ink : P.paperRaised} stroke={P.ink}
              strokeWidth={isSubject ? 1.8 : 1.1} filter={`url(#shadow-${P.mode})`} />
            <text textAnchor="middle" y="3" fontFamily="'Newsreader', serif" fontStyle="italic"
              fontSize={isSubject ? 14 : 12} fontWeight="600" fill={isSel ? P.paper : P.ink}>
              {C.typeMeta[n.type].icon}
            </text>
            <text textAnchor="middle" y={r + 16} fontFamily="'Newsreader', serif"
              fontSize="12.5" fill={P.ink} fontWeight="500">{n.label}</text>
            <text textAnchor="middle" y={r + 30} fontFamily="'JetBrains Mono', monospace"
              fontSize="9" fill={P.inkMuted} letterSpacing="0.04em">{n.sub.toUpperCase()}</text>
          </g>
        )
      })}

      <g fontFamily="'JetBrains Mono', monospace" fontSize="9" fill={P.inkMuted} letterSpacing="0.1em">
        <text x="20" y="20">FIG. 1 · CASE LATTICE</text>
        <text x="860" y="570" textAnchor="end">EXH. A — {C.caseId}</text>
      </g>
    </svg>
  )
}

// ─── Inspector
function Inspector({ nodeId, tab, setTab, assertionStatus, cycleStatus, P }: {
  nodeId: string; tab: string; setTab: (t: string) => void
  assertionStatus: Record<string, AssertionStatus>
  cycleStatus: (id: string, s: AssertionStatus) => void
  P: ReturnType<typeof useTheme>['P']
}) {
  const node = C.findNode(nodeId)
  if (!node) return null
  const all = C.getAssertions(nodeId)
  const tabs = ['Overview', 'Assertions', 'Sources', 'Activity']
  const SM = statusMeta(P)

  return (
    <div style={{ height: '100%', background: P.paperRaised, borderLeft: `1px solid ${P.rule}`, display: 'flex', flexDirection: 'column', fontFamily: "'Newsreader', 'Source Serif 4', Georgia, serif", color: P.ink, overflow: 'hidden' }}>
      <div style={{ padding: '20px 22px 14px', borderBottom: `1px solid ${P.ruleSoft}`, flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, letterSpacing: '0.16em', color: P.inkMuted }}>
            {C.typeMeta[node.type].label.toUpperCase()} · {node.id.toUpperCase()}
          </span>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: P.inkMuted }}>
            {all.length} facts · {C.edges.filter(e => e.a === node.id || e.b === node.id).length} links
          </span>
        </div>
        <div style={{ fontSize: 26, fontWeight: 600, lineHeight: 1.12, fontStyle: 'italic', letterSpacing: '-0.012em' }}>
          {node.label}
        </div>
        <div style={{ fontSize: 13, color: P.inkSoft, marginTop: 4 }}>{node.sub}</div>
        {node.ring === 'subject' && (
          <div style={{ display: 'flex', gap: 8, marginTop: 12, alignItems: 'center' }}>
            <Stamp status="disputed" rotate={-3} P={P} />
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: P.inkMuted, letterSpacing: '0.08em' }}>CASE SUBJECT</span>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', borderBottom: `1px solid ${P.ruleSoft}`, padding: '0 14px', background: P.paperSunk, flexShrink: 0 }}>
        {tabs.map(t => {
          const active = t === tab
          return (
            <button key={t} onClick={() => setTab(t)} style={{
              background: 'transparent', border: 'none', padding: '11px 11px',
              fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5,
              letterSpacing: '0.14em', textTransform: 'uppercase',
              color: active ? P.ink : P.inkMuted,
              borderBottom: active ? `2px solid ${P.stamp}` : '2px solid transparent',
              marginBottom: -1, cursor: 'pointer', fontWeight: active ? 600 : 500,
            }}>{t}</button>
          )
        })}
      </div>

      <div style={{ padding: '18px 20px', overflow: 'auto', flex: 1 }}>
        {tab === 'Overview' && (
          <div>
            <p style={{ fontSize: 14, lineHeight: 1.55, color: P.inkSoft, margin: 0 }}>
              {node.id === 'lena'
                ? 'Subject of the case. Disputed beneficial owner of Glass Harbor Holdings; appears at the marina on the day of the wire transfer; communicates with Marko Reiter approximately four minutes prior to the transfer.'
                : `${node.label} is connected into the case via ${C.edges.filter(e => e.a === node.id || e.b === node.id).length} relationships.`}
            </p>
            <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '10px 16px', fontSize: 13 }}>
              {([['Type', C.typeMeta[node.type].label], ['Case ID', C.caseId], ['Created', '2025-08-09'], ['Updated', '2 days ago'], ['Aliases', node.id === 'lena' ? '"L.V." · Magdalena' : '—']] as [string, string][]).map(([k, v]) => (
                <div key={k} style={{ display: 'contents' }}>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.12em', color: P.inkMuted, paddingTop: 2 }}>{k.toUpperCase()}</div>
                  <div style={{ borderBottom: `1px dotted ${P.ruleSoft}`, paddingBottom: 6 }}>{v}</div>
                </div>
              ))}
            </div>
            <button style={{ marginTop: 18, width: '100%', padding: '10px 12px', background: P.stamp, color: P.mode === 'dark' ? '#1c1812' : '#f3ebd8', border: 'none', borderRadius: 4, fontFamily: "'Newsreader', serif", fontStyle: 'italic', fontSize: 14, fontWeight: 600, cursor: 'pointer', boxShadow: P.shadow }}>
              + Promote a field to fact
            </button>
          </div>
        )}

        {tab === 'Assertions' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {all.map((a, i) => {
              const st = assertionStatus[a.id] ?? a.status
              return (
                <div key={a.id} style={{ padding: '14px 14px 12px', background: P.paper, borderRadius: 4, border: `1px solid ${P.ruleSoft}`, boxShadow: P.shadow }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: P.inkMuted, letterSpacing: '0.08em', marginBottom: 8 }}>
                    <span>§{i + 1} · FACT-{String(i + 1).padStart(2, '0')}</span>
                    <span>{a.by} · {a.at}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <div style={{ fontSize: 14.5, lineHeight: 1.45, fontStyle: 'italic', flex: 1, color: P.ink }}>"{a.text}"</div>
                    <div style={{ flexShrink: 0 }}><Stamp status={st as AssertionStatus} rotate={i % 2 ? 2 : -2} P={P} /></div>
                  </div>
                  <div style={{ marginTop: 10, fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: P.inkMuted, letterSpacing: '0.08em' }}>SOURCES · {a.sources.length}</div>
                  <ul style={{ margin: '6px 0 0', padding: 0, listStyle: 'none' }}>
                    {a.sources.map((s, j) => (
                      <li key={j} style={{ fontSize: 12.5, color: P.inkSoft, padding: '4px 0', borderBottom: `1px dotted ${P.ruleSoft}`, display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s}</span>
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: P.inkMuted, flexShrink: 0 }}>S-{(i + 1) * 10 + j}</span>
                      </li>
                    ))}
                  </ul>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(0, 1fr))', gap: 4, marginTop: 12 }}>
                    {(['verified', 'asserted', 'review', 'disputed', 'rejected'] as AssertionStatus[]).map(s => {
                      const m = SM[s]
                      const active = st === s
                      return (
                        <button key={s} onClick={() => cycleStatus(a.id, s)} style={{
                          fontFamily: "'JetBrains Mono', monospace", fontSize: 8.5, letterSpacing: '0.12em', padding: '5px 4px',
                          border: `1px solid ${active ? m.fg : P.ruleSoft}`,
                          color: active ? (P.mode === 'dark' ? P.paper : m.fg) : P.inkMuted,
                          background: active ? (P.mode === 'dark' ? m.fg : 'rgba(243,235,216,0.5)') : 'transparent',
                          cursor: 'pointer', borderRadius: 3, fontWeight: 600,
                          minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        }}>{m.label}</button>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {tab === 'Sources' && (
          <div style={{ fontSize: 13, color: P.inkSoft }}>
            <p style={{ margin: 0, fontStyle: 'italic' }}>Bibliographic register of every source touching this node, in citation order.</p>
            <ol style={{ paddingLeft: 22, marginTop: 14, lineHeight: 1.7 }}>
              {['Cyprus registry filing, ref. CY-2024-0314 (PDF, 8pp.)', 'Whistle-blower memo, anonymous, 2025-04-07.', 'Anmeldung scan, Bezirksamt Berlin, 2021-06-22.', 'Telenor CDR export, 2025-09-03 (CSV).', 'CCTV M3-09-03.mp4, Harborside Marina, 09:38–09:47.', 'Witness statement · Anika Holm, 2025-09-04.', 'Pass-photo (DE), Bundesdruckerei, 2018.'].map((s, i) =>
                <li key={i} style={{ paddingBottom: 6, borderBottom: `1px dotted ${P.ruleSoft}`, marginBottom: 6 }}>{s}</li>)}
            </ol>
          </div>
        )}

        {tab === 'Activity' && (
          <div style={{ fontSize: 12.5, color: P.inkSoft, lineHeight: 1.7 }}>
            {[['09:14', 'C. Madsen', 'promoted §3 to verified'], ['08:51', 'C. Madsen', 'attached source S-43 to §3'], ['08:30', 'system', 'imported 14 rows from CDR-09-03.csv'], ['Yest.', 'C. Madsen', 'created §4'], ['2 d.', 'C. Madsen', 'disputed §1 with citation S-12']].map(([t, who, what], i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '52px 100px 1fr', gap: 10, padding: '6px 0', borderBottom: `1px dotted ${P.ruleSoft}` }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: P.inkMuted }}>{t}</span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5 }}>{who}</span>
                <span>{what}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Investigation page
export function Investigation({ onSearch, onAvatar }: { onSearch?: () => void; onAvatar?: () => void }) {
  const { P } = useTheme()
  const [selected, setSelected] = useState('lena')
  const [tab, setTab] = useState('Assertions')
  const [filter, setFilter] = useState<string>('all')
  const [view, setView] = useState('overview')
  const [assertionStatus, setAS] = useState<Record<string, AssertionStatus>>({})
  const cycleStatus = (id: string, s: AssertionStatus) => setAS(p => ({ ...p, [id]: s }))

  const filterTypes: (string | NodeType)[] = ['all', 'person', 'org', 'account', 'device', 'location', 'event', 'evidence']

  return (
    <div style={{ width: '100%', height: '100vh', background: P.paper, color: P.ink, fontFamily: "'Newsreader', 'Source Serif 4', Georgia, serif", display: 'grid', gridTemplateColumns: '232px 1fr 400px', gridTemplateRows: '64px 1fr 56px', gridTemplateAreas: "'top top top' 'left main right' 'bot bot right'", overflow: 'hidden' }}>
      <div style={{ gridArea: 'top' }}>
        <TopBar P={P} onAvatarClick={onAvatar} onSearchClick={onSearch} />
      </div>

      {/* LEFT RAIL */}
      <div style={{ gridArea: 'left', background: P.paperSunk, borderRight: `1px solid ${P.rule}`, padding: '20px 18px', overflow: 'auto', display: 'flex', flexDirection: 'column', gap: 22 }}>
        <div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: P.inkMuted, letterSpacing: '0.18em' }}>SAVED VIEWS</div>
          <ul style={{ listStyle: 'none', margin: '10px 0 0', padding: 0, display: 'flex', flexDirection: 'column', gap: 1 }}>
            {C.savedViews.map(v => {
              const active = v.id === view
              return (
                <li key={v.id} onClick={() => setView(v.id)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '7px 10px', cursor: 'pointer', borderRadius: 3, background: active ? P.stampSoft : 'transparent', borderLeft: active ? `2px solid ${P.stamp}` : '2px solid transparent', marginLeft: -2, paddingLeft: 12 }}>
                  <span style={{ fontSize: 14, fontStyle: active ? 'italic' : 'normal', color: active ? P.ink : P.inkSoft }}>{v.label}</span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: active ? P.stamp : P.inkMuted }}>{v.count}</span>
                </li>
              )
            })}
          </ul>
        </div>

        <div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: P.inkMuted, letterSpacing: '0.18em' }}>NODE TYPES</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 10 }}>
            {filterTypes.map(t => {
              const active = filter === t
              const count = t === 'all' ? C.nodes.length : C.nodes.filter(n => n.type === t).length
              return (
                <button key={t} onClick={() => setFilter(t)} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, padding: '5px 8px', cursor: 'pointer', borderRadius: 3, border: `1px solid ${active ? P.ink : P.ruleSoft}`, background: active ? P.ink : 'transparent', color: active ? P.paper : P.inkSoft, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{t} · {count}</button>
              )
            })}
          </div>
        </div>

        <div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: P.inkMuted, letterSpacing: '0.18em' }}>TOOLS</div>
          <ul style={{ listStyle: 'none', margin: '10px 0 0', padding: 0, display: 'flex', flexDirection: 'column', gap: 2, fontSize: 13, color: P.inkSoft }}>
            {['WHOIS lookup', 'DNS history', 'IP geolocation', 'Reverse image', 'CSV import'].map(t =>
              <li key={t} style={{ padding: '5px 4px', borderBottom: `1px dotted ${P.ruleSoft}`, display: 'flex', justifyContent: 'space-between', cursor: 'pointer' }}>
                <span>{t}</span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: P.inkMuted }}>↗</span>
              </li>)}
          </ul>
        </div>

        <div style={{ marginTop: 'auto', fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: P.inkMuted, letterSpacing: '0.16em', borderTop: `1px solid ${P.ruleSoft}`, paddingTop: 10, display: 'flex', justifyContent: 'space-between' }}>
          <span>● LOCAL · ENCRYPTED</span><span>v0.6</span>
        </div>
      </div>

      {/* MAIN */}
      <div style={{ gridArea: 'main', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 14, left: 18, right: 18, display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 2, pointerEvents: 'none' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: P.inkMuted, letterSpacing: '0.16em', background: P.paperRaised, padding: '4px 10px', borderRadius: 3, border: `1px solid ${P.ruleSoft}`, pointerEvents: 'auto' }}>
            {C.savedViews.find(v => v.id === view)?.label.toUpperCase()} · {C.nodes.length} ENTITIES
          </div>
          <div style={{ display: 'flex', gap: 4, pointerEvents: 'auto' }}>
            {['Layout', 'Cluster', 'Hide labels'].map(b =>
              <button key={b} style={{ fontFamily: "'Newsreader', serif", fontStyle: 'italic', fontSize: 12, padding: '5px 12px', border: `1px solid ${P.ruleSoft}`, borderRadius: 3, background: P.paperRaised, color: P.inkSoft, cursor: 'pointer', boxShadow: P.shadow }}>{b}</button>)}
          </div>
        </div>
        <Graph selected={selected} setSelected={setSelected} filter={filter} P={P} />
      </div>

      {/* INSPECTOR */}
      <div style={{ gridArea: 'right', overflow: 'hidden', gridRow: '2 / 4' }}>
        <Inspector nodeId={selected} tab={tab} setTab={setTab} assertionStatus={assertionStatus} cycleStatus={cycleStatus} P={P} />
      </div>

      {/* TIMELINE STRIP */}
      <div style={{ gridArea: 'bot', background: P.paperSunk, borderTop: `1px solid ${P.rule}`, padding: '0 22px', display: 'flex', alignItems: 'center', gap: 18, fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: P.inkMuted, letterSpacing: '0.12em' }}>
        <span>CHRONO</span>
        <div style={{ position: 'relative', flex: 1, height: 28 }}>
          <div style={{ position: 'absolute', left: 0, right: 0, top: 14, height: 1, background: P.ruleStrong, opacity: 0.5 }} />
          {[{ x: 0.05, label: '2025-06' }, { x: 0.20, label: 'Jul' }, { x: 0.36, label: 'Aug' }, { x: 0.52, label: 'Sep' }, { x: 0.70, label: 'Oct' }, { x: 0.88, label: 'Nov' }].map(t => (
            <div key={t.label} style={{ position: 'absolute', left: `${t.x * 100}%`, top: 8 }}>
              <div style={{ width: 1, height: 12, background: P.ruleStrong, opacity: 0.6 }} />
              <div style={{ marginTop: 2, fontSize: 9 }}>{t.label.toUpperCase()}</div>
            </div>
          ))}
          {[{ x: 0.30, label: 'Wire €150k', major: true }, { x: 0.55, label: 'Marina · 09-03', major: true }, { x: 0.40, label: 'Memo' }, { x: 0.62, label: 'CCTV' }, { x: 0.18, label: 'GH formed' }].map(e => (
            <div key={e.label} style={{ position: 'absolute', left: `${e.x * 100}%`, top: 6, transform: 'translateX(-50%)' }}>
              <div style={{ width: e.major ? 9 : 5, height: e.major ? 9 : 5, background: e.major ? P.stamp : P.ink, border: `1px solid ${P.paperSunk}`, borderRadius: '50%', boxShadow: P.shadow }} />
            </div>
          ))}
        </div>
        <span>NOW</span>
      </div>
    </div>
  )
}
