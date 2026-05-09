import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import { caseData } from '../data/caseData'

const C = caseData

interface Props { onClose: () => void }

interface ActionItem { icon: string; label: string; hint: string; path: string | null }
interface ActionGroup { group: string; items: ActionItem[] }

const actions: ActionGroup[] = [
  { group: 'Actions', items: [
    { icon: '+', label: 'Add fact…', hint: '⌘F', path: null },
    { icon: '+', label: 'Add entity…', hint: '⌘E', path: null },
    { icon: '↗', label: 'Import CSV…', hint: '', path: null },
    { icon: '⌥', label: 'Run WHOIS on selection', hint: '', path: null },
  ]},
  { group: 'Jump to', items: [
    { icon: '◐', label: 'Investigation', hint: '1', path: '/investigation' },
    { icon: '☰', label: 'Timeline', hint: '2', path: '/timeline' },
    { icon: '✓', label: 'Review queue', hint: '3', path: '/review' },
    { icon: '≡', label: 'Reports', hint: '4', path: '/reports' },
    { icon: '⚙', label: 'Settings', hint: '⌘,', path: '/settings' },
  ]},
  { group: 'In sources', items: [
    { icon: '✦', label: 'Bank stmt 08-2025', hint: 'PDF · 14pp', path: '/source' },
    { icon: '✦', label: 'CCTV M3-09-03.mp4', hint: '04:51', path: '/source' },
    { icon: '✦', label: 'Telenor CDR export', hint: 'CSV', path: '/source' },
    { icon: '✦', label: 'Witness statement · A. Holm', hint: 'Statement', path: '/source' },
  ]},
]

export function CommandPalette({ onClose }: Props) {
  const { P } = useTheme()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [cursor, setCursor] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const flat = actions.flatMap(g => g.items)
  const filtered = query ? flat.filter(i => i.label.toLowerCase().includes(query.toLowerCase())) : flat

  useEffect(() => { inputRef.current?.focus() }, [])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowDown') setCursor(c => Math.min(c + 1, filtered.length - 1))
      if (e.key === 'ArrowUp') setCursor(c => Math.max(c - 1, 0))
      if (e.key === 'Enter' && filtered[cursor]?.path) { navigate(filtered[cursor].path!); onClose() }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [cursor, filtered, navigate, onClose])

  const previewItem = filtered[cursor]
  const previewNode = previewItem?.label ? C.nodes.find(n => n.label.toLowerCase().includes(previewItem.label.toLowerCase().split(' ')[0])) : null

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 100, background: P.mode === 'dark' ? 'rgba(0,0,0,0.55)' : 'rgba(28,24,18,0.22)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: 120, fontFamily: "'Newsreader', 'Source Serif 4', Georgia, serif" }}>
      <div onClick={e => e.stopPropagation()} style={{ width: 880, background: P.paperRaised, border: `1px solid ${P.rule}`, borderRadius: 5, boxShadow: P.shadowLg, display: 'grid', gridTemplateColumns: '1fr 280px', overflow: 'hidden', maxHeight: '70vh' }}>
        {/* Left: search + results */}
        <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', borderRight: `1px solid ${P.rule}` }}>
          {/* Input */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px', borderBottom: `1px solid ${P.ruleSoft}` }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={P.inkMuted} strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="m20 20-3-3" /></svg>
            <input ref={inputRef} value={query} onChange={e => { setQuery(e.target.value); setCursor(0) }} placeholder="Actions, entities, sources…" style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontFamily: "'Newsreader', serif", fontSize: 18, fontStyle: 'italic', color: P.ink }} />
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: P.inkMuted, border: `1px solid ${P.ruleSoft}`, padding: '2px 6px', borderRadius: 3 }}>Esc</span>
          </div>

          {/* Results */}
          <div style={{ overflow: 'auto', flex: 1 }}>
            {(query ? [{ group: 'Results', items: filtered }] : actions).map(g => (
              <div key={g.group}>
                <div style={{ padding: '10px 18px 4px', fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: P.inkMuted, letterSpacing: '0.18em' }}>{g.group.toUpperCase()}</div>
                {g.items.map((item, i) => {
                  const idx = flat.indexOf(item)
                  const active = idx === cursor
                  return (
                    <button key={i} onClick={() => { if (item.path) { navigate(item.path); onClose() } }} onMouseEnter={() => setCursor(idx)} style={{ display: 'grid', gridTemplateColumns: '24px 1fr auto', alignItems: 'center', gap: 12, width: '100%', padding: '10px 18px', background: active ? P.stampSoft : 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
                      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: active ? P.stamp : P.inkMuted }}>{item.icon}</span>
                      <span style={{ fontSize: 15, fontStyle: active ? 'italic' : 'normal', color: active ? P.ink : P.inkSoft }}>{item.label}</span>
                      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: P.inkMuted }}>{item.hint}</span>
                    </button>
                  )
                })}
              </div>
            ))}
          </div>

          {/* Recent */}
          {!query && (
            <div style={{ borderTop: `1px solid ${P.ruleSoft}`, padding: '10px 18px', display: 'flex', gap: 8, alignItems: 'center' }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: P.inkMuted, letterSpacing: '0.14em' }}>RECENT:</span>
              {['Glass Harbor Holdings', 'CCTV M3', 'Wire €150k'].map(r => (
                <span key={r} style={{ fontSize: 12, fontStyle: 'italic', color: P.inkSoft, padding: '2px 8px', border: `1px solid ${P.ruleSoft}`, borderRadius: 3, cursor: 'pointer' }}>{r}</span>
              ))}
            </div>
          )}
        </div>

        {/* Right: preview */}
        <div style={{ padding: '20px 18px', background: P.paperSunk, overflow: 'auto' }}>
          {previewNode ? (
            <>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: P.inkMuted, letterSpacing: '0.18em', marginBottom: 8 }}>{C.typeMeta[previewNode.type].label.toUpperCase()} · {previewNode.id.toUpperCase()}</div>
              <div style={{ fontSize: 20, fontStyle: 'italic', fontWeight: 600, marginBottom: 6 }}>{previewNode.label}</div>
              <div style={{ fontSize: 13, color: P.inkSoft, marginBottom: 14 }}>{previewNode.sub}</div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: P.inkMuted, letterSpacing: '0.12em', marginBottom: 8 }}>{C.getAssertions(previewNode.id).length} FACTS · {C.edges.filter(e => e.a === previewNode.id || e.b === previewNode.id).length} LINKS</div>
              {C.getAssertions(previewNode.id).slice(0, 2).map(a => (
                <div key={a.id} style={{ padding: '8px 10px', background: P.paper, border: `1px solid ${P.ruleSoft}`, borderRadius: 3, marginBottom: 6, fontSize: 12.5, fontStyle: 'italic', color: P.ink, lineHeight: 1.4 }}>"{a.text.length > 80 ? a.text.slice(0, 78) + '…' : a.text}"</div>
              ))}
            </>
          ) : (
            <div style={{ color: P.inkMuted, fontSize: 13, fontStyle: 'italic', textAlign: 'center', paddingTop: 40 }}>
              {previewItem ? `→ ${previewItem.label}` : 'Start typing to search'}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
