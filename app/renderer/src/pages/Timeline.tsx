import { useState, useMemo } from 'react'
import { useTheme } from '../context/ThemeContext'
import { TopBar } from '../components/TopBar'
import { Stamp } from '../components/Stamp'
import { useAppStore } from '../store/appStore'
import type { AssertionStatus } from '../design/palette'
import type { NodeType } from '../../../../shared/types'

const typeMeta: Record<NodeType, { label: string; icon: string }> = {
  person: { label: 'Person', icon: '◐' }, org: { label: 'Org', icon: '▢' },
  account: { label: 'Account', icon: '@' }, device: { label: 'Device', icon: '⌬' },
  location: { label: 'Location', icon: '◇' }, event: { label: 'Event', icon: '◬' },
  evidence: { label: 'Evidence', icon: '✦' },
}

interface TimelineEvent {
  id: string; date: string; time: string; kind: string; title: string; sub: string
  actors: string[]; sources: string[]; status: AssertionStatus; body: string; pinned?: boolean
}

const eventsRaw: TimelineEvent[] = [
  { id: 'gh-formed', date: '2022-07-14', time: '—', kind: 'incorporation', title: 'Glass Harbor Holdings registered', sub: 'Limassol, Cyprus · LLC formation', actors: ['gh'], sources: ['Cyprus registry filing CY-2024-0314'], status: 'verified', body: 'Filed as private limited company. Registered office 28 Themistokli Dervi, Limassol. Sole shareholder listed as nominee. No directors named at incorporation.' },
  { id: 'mt-director', date: '2023-11-02', time: '—', kind: 'corporate', title: 'M. Reiter named director, Marina Trust', sub: 'Panama corporate filing', actors: ['marko', 'mt'], sources: ['Panama registry'], status: 'asserted', body: 'Marko Reiter listed as sole director of Marina Trust S.A., Panama. Term 5 years.' },
  { id: 'wire', date: '2025-08-12', time: '14:31', kind: 'transfer', title: '€150,000 wire transfer', sub: 'Glass Harbor → Marina Trust', actors: ['wire', 'gh', 'mt'], sources: ['SWIFT MT103', 'Bank stmt 08-2025'], status: 'verified', body: 'Outgoing wire from Hellenic Bank account ending 4419 to BAC International, Panama. Reference line redacted. Originator: Glass Harbor Holdings LLC.', pinned: true },
  { id: 'memo', date: '2025-04-07', time: '—', kind: 'document', title: 'Whistle-blower memo received', sub: 'Anonymous · couriered', actors: [], sources: ['Whistle-blower memo, anon'], status: 'review', body: 'Eight-page typewritten memo names Lena Voss as beneficial owner of Glass Harbor. Authorship not corroborated. Filed as exhibit pending source verification.' },
  { id: 'cdr', date: '2025-09-03', time: '09:38', kind: 'comms', title: 'Telenor CDR · cell tower handoff', sub: '+47 905 33 218 · Kiel-Nord BTS', actors: ['phone', 'lena'], sources: ['Telenor CDR export 2025-09-03'], status: 'verified', body: 'Subscriber number registers on Kiel-Nord cell at 09:38:14, persists through 09:51. Coincides with marina arrival window.' },
  { id: 'call', date: '2025-09-03', time: '09:42', kind: 'comms', title: 'Call · 4m 12s · Voss ↔ Reiter', sub: 'Within 5 min of marina arrival', actors: ['lena', 'marko', 'call'], sources: ['Telenor CDR', 'CCTV timestamp'], status: 'verified', body: 'Outgoing call from +47 905 33 218 to +49 174 88 192. Duration 04:12. Originating cell consistent with Harborside Marina car park.', pinned: true },
  { id: 'cctv', date: '2025-09-03', time: '09:47', kind: 'evidence', title: 'CCTV M3 · marina footage captured', sub: 'Berth 14 · 4m 51s clip', actors: ['cctv', 'marina'], sources: ['CCTV M3-09-03.mp4'], status: 'verified', body: 'Camera M3 (north pier) records two figures matching subjects descending toward Berth 14. Faces partially obscured. Audio: none.' },
  { id: 'witness', date: '2025-09-04', time: '11:00', kind: 'witness', title: 'Statement · A. Holm', sub: 'Marina café, recorded', actors: ['anika'], sources: ['Witness statement Anika Holm 2025-09-04'], status: 'asserted', body: 'Holm describes seeing a woman matching Voss in conversation with a man on Berth 14 shortly before 10:00. Identification by photo array pending.' },
  { id: 'cy-resp', date: '2025-10-19', time: '—', kind: 'document', title: 'Cyprus registry response received', sub: 'Letter ref. CY-OUT-1142', actors: ['gh'], sources: ['Cyprus registry letter'], status: 'review', body: 'Registry confirms Glass Harbor active. Beneficial-owner declaration absent from file; pre-2024 disclosures not retained. Awaiting follow-up via legal channel.' },
  { id: 'review', date: '2025-11-04', time: '—', kind: 'note', title: 'Internal review · §1 disputed', sub: 'C. Madsen', actors: [], sources: [], status: 'disputed', body: 'Beneficial-ownership claim re: Lena Voss flagged disputed pending second corroborating source independent of the whistle-blower memo.' },
]

const events = [...eventsRaw].sort((a, b) =>
  a.date === b.date ? (a.time > b.time ? 1 : -1) : (a.date > b.date ? 1 : -1))

const monthLabel = (iso: string) => {
  const [y, m] = iso.split('-')
  return `${['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'][+m - 1]} ${y}`
}

function EventSheet({ ev, P }: { ev: TimelineEvent; P: ReturnType<typeof useTheme>['P'] }) {
  const { nodes } = useAppStore()
  const actors = ev.actors.map(id => nodes.find(n => n.id === id)).filter(Boolean)
  return (
    <div style={{ height: '100%', overflow: 'auto', padding: '34px 44px', background: P.paperRaised, borderLeft: `1px solid ${P.rule}`, fontFamily: "'Newsreader', 'Source Serif 4', Georgia, serif", color: P.ink }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: P.inkMuted, letterSpacing: '0.18em', marginBottom: 18 }}>
        <span>EXH. T · CHRONOLOGY</span>
        <span>{ev.date.replace(/-/g, ' · ')}{ev.time !== '—' ? ` · ${ev.time}` : ''}</span>
      </div>
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: P.inkMuted, letterSpacing: '0.16em', marginBottom: 4 }}>{ev.kind.toUpperCase()}</div>
      <h1 style={{ margin: 0, fontSize: 32, fontWeight: 600, fontStyle: 'italic', letterSpacing: '-0.012em', lineHeight: 1.08 }}>{ev.title}</h1>
      <div style={{ marginTop: 6, fontSize: 14, color: P.inkSoft }}>{ev.sub}</div>
      <div style={{ marginTop: 14, display: 'flex', gap: 10, alignItems: 'center' }}>
        <Stamp status={ev.status} rotate={-2} P={P} />
        {ev.pinned && <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: P.stamp, letterSpacing: '0.14em' }}>★ PINNED TO TIMELINE</span>}
      </div>
      <div style={{ marginTop: 24, fontSize: 15, lineHeight: 1.6, color: P.ink }}>{ev.body}</div>
      {actors.length > 0 && (
        <div style={{ marginTop: 26 }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: P.inkMuted, letterSpacing: '0.18em', marginBottom: 8 }}>ACTORS · {actors.length}</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 18px' }}>
            {actors.map(n => n && (
              <div key={n.id} style={{ display: 'flex', gap: 10, alignItems: 'baseline', padding: '6px 0', borderBottom: `1px dotted ${P.ruleSoft}` }}>
                <span style={{ fontFamily: "'Newsreader', serif", fontStyle: 'italic', fontSize: 14 }}>{n.label}</span>
                <span style={{ marginLeft: 'auto', fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: P.inkMuted, letterSpacing: '0.08em' }}>{(typeMeta[n.type as NodeType]?.label ?? n.type).toUpperCase()}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      <div style={{ marginTop: 22 }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: P.inkMuted, letterSpacing: '0.18em', marginBottom: 8 }}>SOURCES · {ev.sources.length}</div>
        <ol style={{ margin: 0, paddingLeft: 22, fontSize: 13.5, lineHeight: 1.7, color: P.inkSoft }}>
          {ev.sources.length > 0 ? ev.sources.map((s, i) => (
            <li key={i} style={{ paddingBottom: 5, borderBottom: `1px dotted ${P.ruleSoft}`, marginBottom: 5, display: 'flex', gap: 10 }}>
              <span style={{ flex: 1 }}>{s}</span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: P.inkMuted }}>S-T{String(i + 1).padStart(2, '0')}</span>
            </li>
          )) : <li style={{ listStyle: 'none', fontStyle: 'italic', color: P.inkMuted }}>— none on file —</li>}
        </ol>
      </div>
      <div style={{ marginTop: 22, padding: '12px 14px', background: P.paper, border: `1px solid ${P.ruleSoft}`, borderRadius: 4 }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: P.inkMuted, letterSpacing: '0.16em' }}>CF. ALSO</div>
        <div style={{ marginTop: 6, fontSize: 13, color: P.inkSoft, fontStyle: 'italic' }}>
          {ev.id === 'wire' ? 'See §c2 (Glass Harbor wired €150k…) and CCTV M3-09-03 cross-reference.' : ev.id === 'call' ? 'See §a3 (Voss used +47 905 33 218 on 2025-09-03) and witness Holm statement.' : 'No cross-references on file.'}
        </div>
      </div>
      <button style={{ marginTop: 22, padding: '9px 14px', background: P.stamp, color: P.mode === 'dark' ? '#1c1812' : '#f3ebd8', border: 'none', borderRadius: 4, fontFamily: "'Newsreader', serif", fontStyle: 'italic', fontSize: 14, fontWeight: 600, cursor: 'pointer', boxShadow: P.shadow }}>
        + Promote to fact in dossier
      </button>
    </div>
  )
}

function Ledger({ evts, selected, setSelected, P }: { evts: TimelineEvent[]; selected: string; setSelected: (id: string) => void; P: ReturnType<typeof useTheme>['P'] }) {
  const groups = useMemo(() => {
    const out: { month: string; items: TimelineEvent[] }[] = []
    let last = ''
    for (const e of evts) {
      const m = e.date.slice(0, 7)
      if (m !== last) { out.push({ month: m, items: [] }); last = m }
      out[out.length - 1].items.push(e)
    }
    return out
  }, [evts])

  return (
    <div style={{ height: '100%', overflow: 'auto', padding: '30px 36px 28px', fontFamily: "'Newsreader', 'Source Serif 4', Georgia, serif", color: P.ink }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: P.inkMuted, letterSpacing: '0.18em', marginBottom: 18 }}>
        <span>BOOK II · CHRONOLOGY OF EVENTS</span>
        <span>FOLIO 14 — {evts.length} ENTRIES</span>
      </div>
      {groups.map(g => (
        <div key={g.month} style={{ marginBottom: 26 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginBottom: 12, borderBottom: `1px solid ${P.rule}`, paddingBottom: 4 }}>
            <h2 style={{ margin: 0, fontSize: 22, fontWeight: 600, fontStyle: 'italic', letterSpacing: '-0.012em' }}>{monthLabel(g.month)}</h2>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: P.inkMuted, letterSpacing: '0.12em' }}>{g.items.length} {g.items.length === 1 ? 'ENTRY' : 'ENTRIES'}</span>
          </div>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
            {g.items.map(ev => {
              const active = ev.id === selected
              const stColor = ev.status === 'verified' ? P.asserted : ev.status === 'review' ? P.review : ev.status === 'disputed' ? P.disputed : P.inkMuted
              return (
                <li key={ev.id} onClick={() => setSelected(ev.id)} style={{ display: 'grid', gridTemplateColumns: '90px 9px 1fr auto', gap: 14, alignItems: 'baseline', padding: '10px 12px 10px 6px', cursor: 'pointer', background: active ? P.stampSoft : 'transparent', borderLeft: active ? `2px solid ${P.stamp}` : '2px solid transparent', marginLeft: -8, paddingLeft: 6, borderRadius: 3 }}>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: P.inkMuted, letterSpacing: '0.04em', paddingTop: 2 }}>{ev.date.slice(8)} · {ev.time === '—' ? '—' : ev.time}</span>
                  <span style={{ width: 9, height: 9, borderRadius: '50%', background: stColor, alignSelf: 'center', boxShadow: `0 0 0 2px ${P.paper}`, display: 'block' }} />
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 15.5, fontWeight: 500, lineHeight: 1.25, fontStyle: active ? 'italic' : 'normal' }}>
                      {ev.title}{ev.pinned && <span style={{ color: P.stamp, marginLeft: 6 }}>★</span>}
                    </div>
                    <div style={{ fontSize: 13, color: P.inkSoft, marginTop: 2 }}>{ev.sub}</div>
                  </div>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: '0.14em', color: stColor, alignSelf: 'baseline', paddingTop: 3, fontWeight: 600 }}>{ev.status.toUpperCase()}</span>
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </div>
  )
}

export function Timeline({ onSearch, onAvatar }: { onSearch?: () => void; onAvatar?: () => void }) {
  const { P } = useTheme()
  const [selected, setSelected] = useState('call')
  const [scope, setScope] = useState('all')
  const [view, setView] = useState('all-events')
  const ev = events.find(e => e.id === selected) ?? events[0]

  const lenses = [
    { id: 'all-events', label: 'All events',      count: events.length },
    { id: 'transfers',  label: 'Money trail',      count: events.filter(e => e.kind === 'transfer').length },
    { id: 'comms',      label: 'Communications',   count: events.filter(e => e.kind === 'comms').length },
    { id: 'witness',    label: 'Witnesses',         count: events.filter(e => e.kind === 'witness').length },
    { id: 'docs',       label: 'Documents',         count: events.filter(e => e.kind === 'document').length },
    { id: 'pinned',     label: 'Pinned',            count: events.filter(e => e.pinned).length },
  ]

  const start = new Date(events[0].date).getTime()
  const end   = new Date(events[events.length - 1].date).getTime()
  const span  = end - start || 1

  return (
    <div style={{ width: '100%', height: '100vh', background: P.paper, color: P.ink, fontFamily: "'Newsreader', 'Source Serif 4', Georgia, serif", display: 'grid', gridTemplateColumns: '232px 1fr 520px', gridTemplateRows: '64px 1fr 56px', gridTemplateAreas: "'top top top' 'left main right' 'bot bot bot'", overflow: 'hidden' }}>
      <div style={{ gridArea: 'top' }}><TopBar P={P} searchPlaceholder="Search dates, events, names…" onAvatarClick={onAvatar} onSearchClick={onSearch} /></div>

      <div style={{ gridArea: 'left', background: P.paperSunk, borderRight: `1px solid ${P.rule}`, padding: '20px 18px', overflow: 'auto', display: 'flex', flexDirection: 'column', gap: 22 }}>
        <div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: P.inkMuted, letterSpacing: '0.18em' }}>SCOPE</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 1, marginTop: 10 }}>
            {[['all', 'Entire case'], ['90d', 'Last 90 days'], ['key-day', '03 Sep 2025 (key day)'], ['custom', 'Custom range…']].map(([k, label]) => {
              const active = scope === k
              return (
                <button key={k} onClick={() => setScope(k)} style={{ textAlign: 'left', cursor: 'pointer', borderRadius: 3, padding: '7px 10px', background: active ? P.stampSoft : 'transparent', borderLeft: active ? `2px solid ${P.stamp}` : '2px solid transparent', marginLeft: -2, paddingLeft: 12, border: 'none', fontFamily: "'Newsreader', serif", fontSize: 14, fontStyle: active ? 'italic' : 'normal', color: active ? P.ink : P.inkSoft }}>{label}</button>
              )
            })}
          </div>
        </div>
        <div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: P.inkMuted, letterSpacing: '0.18em' }}>SAVED LENS</div>
          <ul style={{ listStyle: 'none', margin: '10px 0 0', padding: 0, display: 'flex', flexDirection: 'column', gap: 1 }}>
            {lenses.map(v => {
              const active = view === v.id
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
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: P.inkMuted, letterSpacing: '0.18em' }}>STATUS</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '6px 12px', marginTop: 10, fontSize: 13, color: P.inkSoft }}>
            {[['Verified', events.filter(e => e.status === 'verified').length, P.asserted], ['Asserted', events.filter(e => e.status === 'asserted').length, P.asserted], ['In review', events.filter(e => e.status === 'review').length, P.review], ['Disputed', events.filter(e => e.status === 'disputed').length, P.disputed]].map(([k, c, col]) => (
              <div key={k as string} style={{ display: 'contents' }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}><span style={{ width: 8, height: 8, borderRadius: '50%', background: col as string, display: 'inline-block' }} />{k}</div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: P.inkMuted }}>{c as number}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ marginTop: 'auto', fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: P.inkMuted, letterSpacing: '0.16em', borderTop: `1px solid ${P.ruleSoft}`, paddingTop: 10, display: 'flex', justifyContent: 'space-between' }}>
          <span>● LOCAL · ENCRYPTED</span><span>v0.6</span>
        </div>
      </div>

      <div style={{ gridArea: 'main', overflow: 'hidden', position: 'relative' }}>
        <Ledger evts={events} selected={selected} setSelected={setSelected} P={P} />
      </div>
      <div style={{ gridArea: 'right', overflow: 'hidden' }}>
        <EventSheet ev={ev} P={P} />
      </div>

      <div style={{ gridArea: 'bot', background: P.paperSunk, borderTop: `1px solid ${P.rule}`, padding: '0 22px', display: 'flex', alignItems: 'center', gap: 18, fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: P.inkMuted, letterSpacing: '0.12em' }}>
        <span>{events[0].date.slice(0, 7).replace('-', ' · ')}</span>
        <div style={{ position: 'relative', flex: 1, height: 28 }}>
          <div style={{ position: 'absolute', left: 0, right: 0, top: 14, height: 1, background: P.ruleStrong, opacity: 0.5 }} />
          {events.map(e => {
            const x = (new Date(e.date).getTime() - start) / span
            const isSel = e.id === selected
            const stColor = e.status === 'verified' ? P.asserted : e.status === 'review' ? P.review : e.status === 'disputed' ? P.disputed : P.ink
            const sz = e.pinned ? 11 : isSel ? 10 : 6
            return (
              <div key={e.id} onClick={() => setSelected(e.id)} style={{ position: 'absolute', left: `${x * 100}%`, top: 4, transform: 'translateX(-50%)', cursor: 'pointer' }}>
                <div style={{ width: sz, height: sz, background: isSel ? P.stamp : stColor, border: `1.5px solid ${P.paperSunk}`, borderRadius: '50%', boxShadow: P.shadow }} />
                {(isSel || e.pinned) && <div style={{ marginTop: 4, fontSize: 8.5, transform: 'translateX(-50%)', whiteSpace: 'nowrap', color: isSel ? P.stamp : P.inkSoft, position: 'absolute', left: '50%' }}>{e.date.slice(5)}</div>}
              </div>
            )
          })}
        </div>
        <span>{events[events.length - 1].date.slice(0, 7).replace('-', ' · ')}</span>
      </div>
    </div>
  )
}
