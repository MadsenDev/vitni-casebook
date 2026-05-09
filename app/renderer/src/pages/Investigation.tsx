import { useState, useEffect, useRef, useCallback } from 'react'
import { useTheme } from '../context/ThemeContext'
import { TopBar } from '../components/TopBar'
import { Stamp } from '../components/Stamp'
import { statusMeta } from '../design/palette'
import { useAppStore } from '../store/appStore'
import { relationshipCategories, categoriesForTypes } from '../lib/relationshipTypes'
import { nodeFieldDefs } from '../lib/nodeFieldDefs'
import type { AssertionStatus } from '../design/palette'
import type { NodeType, EdgeStatus } from '../../../../shared/types'

type P = ReturnType<typeof useTheme>['P']

const typeMeta: Record<NodeType, { label: string; icon: string }> = {
  person:   { label: 'Person',   icon: '◐' },
  org:      { label: 'Org',      icon: '▢' },
  account:  { label: 'Account',  icon: '@' },
  device:   { label: 'Device',   icon: '⌬' },
  location: { label: 'Location', icon: '◇' },
  event:    { label: 'Event',    icon: '◬' },
  evidence: { label: 'Evidence', icon: '✦' },
}


// ─── Edge creation dialog (preset-based)

function EdgeDialog({ sourceId, targetId, p, onConfirm, onCancel }: {
  sourceId: string; targetId: string; p: P
  onConfirm: (label: string, status: EdgeStatus, occurredAt: string | null) => void
  onCancel: () => void
}) {
  const { nodes } = useAppStore()
  const src = nodes.find(n => n.id === sourceId)
  const tgt = nodes.find(n => n.id === targetId)
  const categories = categoriesForTypes(src?.type, tgt?.type)

  const [categoryId, setCategoryId] = useState<string | null>(null)
  const [subtypeId, setSubtypeId] = useState<string | null>(null)
  const [label, setLabel] = useState('')
  const [occurredAt, setOccurredAt] = useState('')
  const [status, setStatus] = useState<EdgeStatus>('asserted')
  const statuses: EdgeStatus[] = ['verified', 'asserted', 'review', 'disputed']

  const selectedCat = categories.find(c => c.id === categoryId) ?? null

  const selectCategory = (id: string) => {
    setCategoryId(id)
    setSubtypeId(null)
    setLabel('')
  }
  const selectSubtype = (id: string, lbl: string) => {
    setSubtypeId(id)
    setLabel(lbl)
  }

  const canConfirm = label.trim().length > 0

  const mono: React.CSSProperties = { fontFamily: "'JetBrains Mono', monospace" }

  return (
    <div onClick={onCancel} style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div onClick={e => e.stopPropagation()} style={{ width: 480, background: p.paperRaised, border: `1px solid ${p.rule}`, borderRadius: 5, padding: '22px 24px', boxShadow: p.shadowLg, fontFamily: "'Newsreader', serif", maxHeight: '90vh', overflowY: 'auto' }}>

        {/* Header */}
        <div style={{ ...mono, fontSize: 9.5, color: p.inkMuted, letterSpacing: '0.18em', marginBottom: 10 }}>NEW RELATIONSHIP</div>
        <div style={{ fontSize: 14, color: p.inkSoft, marginBottom: 16, fontStyle: 'italic' }}>
          <strong style={{ color: p.ink, fontStyle: 'normal' }}>{src?.label ?? sourceId.slice(0, 8)}</strong>
          <span style={{ margin: '0 8px', opacity: 0.5 }}>→</span>
          <strong style={{ color: p.ink, fontStyle: 'normal' }}>{tgt?.label ?? targetId.slice(0, 8)}</strong>
        </div>

        {/* Category grid */}
        <div style={{ ...mono, fontSize: 9, color: p.inkMuted, letterSpacing: '0.14em', marginBottom: 8 }}>CATEGORY</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 5, marginBottom: 16 }}>
          {categories.map(c => {
            const active = c.id === categoryId
            return (
              <button key={c.id} onClick={() => selectCategory(c.id)} style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, padding: '10px 6px',
                border: `1px solid ${active ? p.stamp : p.ruleSoft}`,
                borderRadius: 4, background: active ? p.stamp + '18' : 'transparent',
                cursor: 'pointer',
              }}>
                <span style={{ fontSize: 16, lineHeight: 1 }}>{c.icon}</span>
                <span style={{ ...mono, fontSize: 8, color: active ? p.stamp : p.inkSoft, letterSpacing: '0.08em', textAlign: 'center', lineHeight: 1.3 }}>{c.label.toUpperCase()}</span>
              </button>
            )
          })}
        </div>

        {/* Subtypes */}
        {selectedCat && (
          <>
            <div style={{ ...mono, fontSize: 9, color: p.inkMuted, letterSpacing: '0.14em', marginBottom: 8 }}>SUBTYPE</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 14 }}>
              {selectedCat.subtypes.map(s => {
                const active = s.id === subtypeId
                return (
                  <button key={s.id} onClick={() => selectSubtype(s.id, s.label)} style={{
                    padding: '5px 10px', border: `1px solid ${active ? p.ink : p.ruleSoft}`,
                    borderRadius: 3, background: active ? p.ink : 'transparent',
                    color: active ? p.paper : p.inkSoft, cursor: 'pointer',
                    fontFamily: "'Newsreader', serif", fontStyle: 'italic', fontSize: 13,
                  }}>{s.label}</button>
                )
              })}
            </div>
          </>
        )}

        {/* Label (auto-filled, editable) */}
        <div style={{ ...mono, fontSize: 9, color: p.inkMuted, letterSpacing: '0.14em', marginBottom: 6 }}>LABEL</div>
        <input autoFocus={!categoryId} value={label} onChange={e => setLabel(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && canConfirm) onConfirm(label.trim(), status, occurredAt || null); if (e.key === 'Escape') onCancel() }}
          placeholder="Relationship label…"
          style={{ width: '100%', padding: '9px 12px', background: p.paperSunk, border: `1px solid ${p.rule}`, borderRadius: 4, fontFamily: "'Newsreader', serif", fontStyle: 'italic', fontSize: 15, color: p.ink, outline: 'none', boxSizing: 'border-box', marginBottom: 12 }} />

        {/* Date */}
        {(selectedCat?.supportsDate ?? true) && (
          <>
            <div style={{ ...mono, fontSize: 9, color: p.inkMuted, letterSpacing: '0.14em', marginBottom: 6 }}>DATE (optional)</div>
            <input type="date" value={occurredAt} onChange={e => setOccurredAt(e.target.value)}
              style={{ width: '100%', padding: '7px 12px', background: p.paperSunk, border: `1px solid ${p.ruleSoft}`, borderRadius: 4, fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: p.ink, outline: 'none', boxSizing: 'border-box', marginBottom: 12, colorScheme: p.mode }} />
          </>
        )}

        {/* Status */}
        <div style={{ display: 'flex', gap: 5, marginBottom: 18 }}>
          {statuses.map(s => {
            const SM = statusMeta(p)
            const active = status === s
            return (
              <button key={s} onClick={() => setStatus(s)} style={{ flex: 1, ...mono, fontSize: 9, padding: '6px 4px', borderRadius: 3, border: `1px solid ${active ? SM[s].fg : p.ruleSoft}`, background: active ? SM[s].fg + '22' : 'transparent', color: active ? SM[s].fg : p.inkMuted, cursor: 'pointer', fontWeight: active ? 700 : 400, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{s}</button>
            )
          })}
        </div>

        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button onClick={onCancel} style={{ padding: '7px 16px', background: 'transparent', border: `1px solid ${p.ruleSoft}`, borderRadius: 3, cursor: 'pointer', fontFamily: "'Newsreader', serif", fontStyle: 'italic', fontSize: 13, color: p.inkSoft }}>Cancel</button>
          <button onClick={() => canConfirm && onConfirm(label.trim(), status, occurredAt || null)} disabled={!canConfirm}
            style={{ padding: '7px 20px', background: canConfirm ? p.stamp : p.ruleSoft, border: 'none', borderRadius: 3, cursor: canConfirm ? 'pointer' : 'default', fontFamily: "'Newsreader', serif", fontStyle: 'italic', fontSize: 13, fontWeight: 600, color: p.mode === 'dark' ? '#1c1812' : '#f3ebd8', opacity: canConfirm ? 1 : 0.5 }}>Link ↵</button>
        </div>
      </div>
    </div>
  )
}

// ─── Interactive SVG Graph

interface DragState { nodeId: string; startMX: number; startMY: number; origX: number; origY: number }
interface PanState { startMX: number; startMY: number; origX: number; origY: number }
interface EdgePending { sourceId: string; mx: number; my: number }

function Graph({ selectedId, selectedEdgeId, filter, p }: { selectedId: string; selectedEdgeId: string | null; filter: string; p: P }) {
  const { nodes, edges, selectNode, selectEdge, updateNodePosition, createEdge } = useAppStore()
  const svgRef = useRef<SVGSVGElement>(null)
  const dragRef = useRef<DragState | null>(null)
  const panRef = useRef<PanState | null>(null)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [localPos, setLocalPos] = useState<Record<string, { x: number; y: number }>>({})
  const [linkMode, setLinkMode] = useState<string | null>(null)
  const [edgePending, setEdgePending] = useState<EdgePending | null>(null)
  const [edgeDialog, setEdgeDialog] = useState<{ sourceId: string; targetId: string } | null>(null)
  const [hoverId, setHoverId] = useState<string | null>(null)

  const visible = filter === 'all'
    ? new Set(nodes.map(n => n.id))
    : new Set(nodes.filter(n => n.type === filter).map(n => n.id))
  const visEdges = edges.filter(e => visible.has(e.aId) && visible.has(e.bId))
  const visNodes = nodes.filter(n => visible.has(n.id))

  const nodePos = (id: string) => {
    const lp = localPos[id]
    if (lp) return lp
    const n = nodes.find(nn => nn.id === id)
    return n ? { x: n.x, y: n.y } : { x: 0, y: 0 }
  }

  const svgCoords = (clientX: number, clientY: number) => {
    const rect = svgRef.current!.getBoundingClientRect()
    return {
      x: (clientX - rect.left - pan.x) / zoom,
      y: (clientY - rect.top - pan.y) / zoom,
    }
  }

  useEffect(() => {
    const el = svgRef.current
    if (!el) return
    const handler = (e: WheelEvent) => {
      e.preventDefault()
      const factor = e.deltaY > 0 ? 0.9 : 1.1
      setZoom(z => Math.max(0.2, Math.min(3, z * factor)))
    }
    el.addEventListener('wheel', handler, { passive: false })
    return () => el.removeEventListener('wheel', handler)
  }, [])

  const onSvgMouseDown = (e: React.MouseEvent) => {
    if (e.target === svgRef.current || (e.target as Element).closest('.graph-bg')) {
      if (linkMode) { setLinkMode(null); setEdgePending(null); return }
      selectNode(null)
      selectEdge(null)
      panRef.current = { startMX: e.clientX, startMY: e.clientY, origX: pan.x, origY: pan.y }
    }
  }

  const onNodeMouseDown = (e: React.MouseEvent, nodeId: string) => {
    e.stopPropagation()
    if (linkMode) {
      if (linkMode === nodeId) { setLinkMode(null); setEdgePending(null); return }
      setEdgeDialog({ sourceId: linkMode, targetId: nodeId })
      setLinkMode(null)
      setEdgePending(null)
      return
    }
    const pos = nodePos(nodeId)
    dragRef.current = { nodeId, startMX: e.clientX, startMY: e.clientY, origX: pos.x, origY: pos.y }
  }

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (dragRef.current) {
      const d = dragRef.current
      const dx = (e.clientX - d.startMX) / zoom
      const dy = (e.clientY - d.startMY) / zoom
      setLocalPos(lp => ({ ...lp, [d.nodeId]: { x: d.origX + dx, y: d.origY + dy } }))
    } else if (panRef.current) {
      const p2 = panRef.current
      setPan({ x: p2.origX + (e.clientX - p2.startMX), y: p2.origY + (e.clientY - p2.startMY) })
    }
    if (linkMode && edgePending) {
      const { x, y } = svgCoords(e.clientX, e.clientY)
      setEdgePending(ep => ep ? { ...ep, mx: x, my: y } : null)
    }
  }, [zoom, linkMode, pan])

  const onMouseUp = useCallback(() => {
    if (dragRef.current) {
      const d = dragRef.current
      const lp = localPos[d.nodeId]
      if (lp) updateNodePosition(d.nodeId, lp.x, lp.y)
      dragRef.current = null
    }
    panRef.current = null
  }, [localPos, updateNodePosition])

  const startLinkMode = (e: React.MouseEvent, nodeId: string) => {
    e.stopPropagation()
    setLinkMode(nodeId)
    const pos = nodePos(nodeId)
    setEdgePending({ sourceId: nodeId, mx: pos.x, my: pos.y })
  }

  const handleEdgeCreate = async (label: string, status: EdgeStatus, occurredAt: string | null) => {
    if (!edgeDialog) return
    await createEdge(edgeDialog.sourceId, edgeDialog.targetId, label, status, occurredAt)
    setEdgeDialog(null)
  }

  const handleNodeClick = (e: React.MouseEvent, nodeId: string) => {
    if (dragRef.current) return
    e.stopPropagation()
    selectNode(nodeId === selectedId ? null : nodeId)
  }

  return (
    <>
      <svg
        ref={svgRef}
        width="100%" height="100%"
        style={{ display: 'block', background: 'transparent', cursor: linkMode ? 'crosshair' : panRef.current ? 'grabbing' : 'default', userSelect: 'none' }}
        onMouseDown={onSvgMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
      >
        <defs>
          <pattern id={`paper-${p.mode}`} width="6" height="6" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="0.4" fill={p.texture} />
          </pattern>
          <radialGradient id={`vig-${p.mode}`} cx="50%" cy="40%" r="70%">
            <stop offset="0%" stopColor={p.paper} stopOpacity="0" />
            <stop offset="100%" stopColor="#000" stopOpacity={p.mode === 'dark' ? 0.18 : 0.04} />
          </radialGradient>
          <filter id={`shadow-${p.mode}`} x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="1.5" stdDeviation="1.2"
              floodColor={p.mode === 'dark' ? '#000' : '#1c1812'}
              floodOpacity={p.mode === 'dark' ? 0.5 : 0.10} />
          </filter>
          <marker id="arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L0,6 L6,3 z" fill={p.inkMuted} opacity="0.5" />
          </marker>
        </defs>

        {/* Background — click to pan */}
        <rect className="graph-bg" width="100%" height="100%" fill={`url(#paper-${p.mode})`} />
        <rect width="100%" height="100%" fill={`url(#vig-${p.mode})`} pointerEvents="none" />

        <g transform={`translate(${pan.x},${pan.y}) scale(${zoom})`}>
          {/* Edges */}
          {visEdges.map(e => {
            const a = nodePos(e.aId), b = nodePos(e.bId)
            const dash = e.status === 'review' ? '4 4' : e.status === 'disputed' ? '1 3' : undefined
            const involves = e.aId === selectedId || e.bId === selectedId
            const isSelEdge = e.id === selectedEdgeId
            const stroke = isSelEdge ? p.stamp : (involves || e.status === 'disputed') ? p.stamp : p.ink
            const opacity = isSelEdge ? 1 : selectedId ? (involves ? 0.9 : 0.15) : (e.status === 'review' ? 0.4 : 0.5)
            const sw = isSelEdge ? 2 : involves ? 1.4 : 0.9
            const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2
            return (
              <g key={e.id} style={{ cursor: 'pointer' }} onClick={evt => { evt.stopPropagation(); selectEdge(isSelEdge ? null : e.id) }}>
                {/* wide invisible hit area */}
                <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="transparent" strokeWidth={12} />
                <line x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                  stroke={stroke} strokeWidth={sw} strokeDasharray={dash} opacity={opacity} markerEnd="url(#arrow)" />
                {(involves || isSelEdge) && (
                  <text x={mx} y={my - 6} textAnchor="middle"
                    fontFamily="'Newsreader', serif" fontStyle="italic" fontSize={10.5} fill={p.inkSoft}>
                    <tspan style={{ paintOrder: 'stroke', stroke: p.paper, strokeWidth: 4 }}>{e.label}</tspan>
                  </text>
                )}
              </g>
            )
          })}

          {/* Link mode preview line */}
          {linkMode && edgePending && (() => {
            const src = nodePos(linkMode)
            return (
              <line x1={src.x} y1={src.y} x2={edgePending.mx} y2={edgePending.my}
                stroke={p.stamp} strokeWidth={1.5} strokeDasharray="5 3" opacity={0.7} />
            )
          })()}

          {/* Nodes */}
          {visNodes.map(n => {
            const pos = nodePos(n.id)
            const isSel = n.id === selectedId
            const isSubject = n.ring === 'subject'
            const isLinkSrc = n.id === linkMode
            const isHover = n.id === hoverId
            const dim = Boolean(selectedId) && !isSel && !linkMode
              && !visEdges.some(e => (e.aId === selectedId && e.bId === n.id) || (e.bId === selectedId && e.aId === n.id))
            const r = isSubject ? 28 : 22
            return (
              <g key={n.id} transform={`translate(${pos.x},${pos.y})`}
                style={{ cursor: linkMode && n.id !== linkMode ? 'crosshair' : 'pointer', opacity: dim ? 0.28 : 1, transition: dragRef.current?.nodeId === n.id ? 'none' : 'opacity 150ms' }}
                onMouseDown={e => onNodeMouseDown(e, n.id)}
                onClick={e => handleNodeClick(e, n.id)}
                onMouseEnter={() => setHoverId(n.id)}
                onMouseLeave={() => setHoverId(null)}>
                {isSubject && <circle r={r + 7} fill="none" stroke={p.stamp} strokeWidth="1" strokeDasharray="2 3" />}
                {isLinkSrc && <circle r={r + 10} fill="none" stroke={p.stamp} strokeWidth="2" opacity={0.6} />}
                <circle r={r} fill={isSel ? p.ink : isHover ? p.paperRaised : p.paperRaised} stroke={isSel ? p.ink : isLinkSrc ? p.stamp : p.ink}
                  strokeWidth={isSubject ? 1.8 : isSel ? 2 : 1.1} filter={`url(#shadow-${p.mode})`} />
                <text textAnchor="middle" y="4" fontFamily="'Newsreader', serif" fontStyle="italic"
                  fontSize={isSubject ? 14 : 12} fontWeight="600" fill={isSel ? p.paper : p.ink}>
                  {typeMeta[n.type as NodeType]?.icon ?? '·'}
                </text>
                <text textAnchor="middle" y={r + 16} fontFamily="'Newsreader', serif"
                  fontSize="12" fill={p.ink} fontWeight={isSel ? 600 : 500}>{n.label}</text>
                <text textAnchor="middle" y={r + 28} fontFamily="'JetBrains Mono', monospace"
                  fontSize="8.5" fill={p.inkMuted} letterSpacing="0.04em">{n.sub.toUpperCase()}</text>

                {/* Link button — shown on hover/select */}
                {(isSel || isHover) && !linkMode && (
                  <g transform={`translate(${r + 2}, ${-r - 2})`}
                    onClick={e => startLinkMode(e, n.id)}
                    style={{ cursor: 'crosshair' }}>
                    <circle r="9" fill={p.stamp} opacity="0.9" />
                    <text y="4" textAnchor="middle" fontSize="10" fill={p.mode === 'dark' ? '#1c1812' : '#f3ebd8'} fontWeight="bold">→</text>
                  </g>
                )}
              </g>
            )
          })}

          {visNodes.length === 0 && (
            <text x="440" y="290" textAnchor="middle" fontFamily="'Newsreader', serif" fontStyle="italic"
              fontSize={16} fill={p.inkMuted}>No entities yet — use "+ Entity" above to add one</text>
          )}

          <g fontFamily="'JetBrains Mono', monospace" fontSize={9} fill={p.inkMuted} letterSpacing="0.1em">
            <text x={8 / zoom} y={18 / zoom}>FIG. 1 · CASE LATTICE</text>
          </g>
        </g>

        {/* Zoom indicator */}
        <text x="12" y="100%" dy="-10" fontFamily="'JetBrains Mono', monospace" fontSize="9" fill={p.inkMuted} opacity="0.5">
          {Math.round(zoom * 100)}%
        </text>
      </svg>

      {edgeDialog && (
        <EdgeDialog sourceId={edgeDialog.sourceId} targetId={edgeDialog.targetId} p={p}
          onConfirm={handleEdgeCreate} onCancel={() => setEdgeDialog(null)} />
      )}
    </>
  )
}

// ─── Add Assertion form

function AddAssertionForm({ nodeId, p }: { nodeId: string; p: P }) {
  const { createAssertion } = useAppStore()
  const [text, setText] = useState('')
  const [sources, setSources] = useState('')
  const [open, setOpen] = useState(false)
  const taRef = useRef<HTMLTextAreaElement>(null)

  const submit = async () => {
    const trimmed = text.trim()
    if (!trimmed) return
    const srcList = sources.split(',').map(s => s.trim()).filter(Boolean)
    await createAssertion(nodeId, trimmed, 'review', 0.5, srcList)
    setText('')
    setSources('')
    setOpen(false)
  }

  if (!open) return (
    <button onClick={() => { setOpen(true); setTimeout(() => taRef.current?.focus(), 50) }}
      style={{ width: '100%', marginTop: 4, padding: '9px 12px', background: 'transparent', border: `1px dashed ${p.ruleStrong}`, borderRadius: 4, cursor: 'pointer', fontFamily: "'Newsreader', serif", fontStyle: 'italic', fontSize: 13, color: p.inkMuted, textAlign: 'left' }}>
      + Add assertion…
    </button>
  )

  return (
    <div style={{ marginTop: 4, padding: '12px', background: p.paper, border: `1px solid ${p.rule}`, borderRadius: 4 }}>
      <textarea ref={taRef} value={text} onChange={e => setText(e.target.value)}
        placeholder="State a fact about this entity…"
        onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) submit() }}
        style={{ width: '100%', minHeight: 72, padding: '8px 10px', background: p.paperSunk, border: `1px solid ${p.ruleSoft}`, borderRadius: 3, fontFamily: "'Newsreader', serif", fontStyle: 'italic', fontSize: 14, color: p.ink, resize: 'vertical', outline: 'none', boxSizing: 'border-box' }} />
      <input value={sources} onChange={e => setSources(e.target.value)}
        placeholder="Sources, comma-separated (optional)"
        style={{ width: '100%', marginTop: 6, padding: '7px 10px', background: p.paperSunk, border: `1px solid ${p.ruleSoft}`, borderRadius: 3, fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: p.ink, outline: 'none', boxSizing: 'border-box' }} />
      <div style={{ display: 'flex', gap: 6, marginTop: 8, justifyContent: 'flex-end' }}>
        <button onClick={() => setOpen(false)} style={{ padding: '6px 14px', background: 'transparent', border: `1px solid ${p.ruleSoft}`, borderRadius: 3, cursor: 'pointer', fontFamily: "'Newsreader', serif", fontStyle: 'italic', fontSize: 13, color: p.inkSoft }}>Cancel</button>
        <button onClick={submit} style={{ padding: '6px 14px', background: p.stamp, border: 'none', borderRadius: 3, cursor: 'pointer', fontFamily: "'Newsreader', serif", fontStyle: 'italic', fontSize: 13, fontWeight: 600, color: p.mode === 'dark' ? '#1c1812' : '#f3ebd8' }}>Add ⌘↵</button>
      </div>
    </div>
  )
}

// ─── Inspector

function Inspector({ nodeId, tab, setTab, p }: {
  nodeId: string; tab: string; setTab: (t: string) => void; p: P
}) {
  const { nodes, edges, assertions, updateAssertion, deleteAssertion, deleteNode, updateNode } = useAppStore()
  const node = nodes.find(n => n.id === nodeId)
  if (!node) return null

  const all = assertions[nodeId] ?? []
  const tabs = ['Overview', 'Details', 'Assertions', 'Relations', 'Sources']
  const fieldDefs = nodeFieldDefs[node.type as NodeType] ?? []
  const [propsEdit, setPropsEdit] = useState<Record<string, string>>(node.props ?? {})

  useEffect(() => { setPropsEdit(node.props ?? {}) }, [nodeId])
  const SM = statusMeta(p)
  const nodeEdges = edges.filter(e => e.aId === nodeId || e.bId === nodeId)
  const [editingLabel, setEditingLabel] = useState(false)
  const [labelVal, setLabelVal] = useState(node.label)
  const [editingSub, setEditingSub] = useState(false)
  const [subVal, setSubVal] = useState(node.sub)
  const [confirmingDelete, setConfirmingDelete] = useState(false)

  useEffect(() => {
    setLabelVal(node.label)
    setSubVal(node.sub)
    setConfirmingDelete(false)
    setEditingLabel(false)
    setEditingSub(false)
  }, [nodeId])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Delete' && e.key !== 'Backspace') return
      const tag = (e.target as HTMLElement).tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return
      e.preventDefault()
      setConfirmingDelete(true)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const commitLabel = () => {
    if (labelVal.trim() && labelVal !== node.label) updateNode({ id: node.id, label: labelVal.trim() })
    setEditingLabel(false)
  }
  const commitSub = () => {
    if (subVal !== node.sub) updateNode({ id: node.id, sub: subVal })
    setEditingSub(false)
  }

  return (
    <div style={{ height: '100%', background: p.paperRaised, borderLeft: `1px solid ${p.rule}`, display: 'flex', flexDirection: 'column', fontFamily: "'Newsreader', 'Source Serif 4', Georgia, serif", color: p.ink, overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '18px 20px 12px', borderBottom: `1px solid ${p.ruleSoft}`, flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, letterSpacing: '0.16em', color: p.inkMuted }}>
            {(typeMeta[node.type as NodeType]?.label ?? node.type).toUpperCase()} · {node.id.slice(0, 8).toUpperCase()}
          </span>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: p.inkMuted }}>{all.length} facts · {nodeEdges.length} links</span>
            {confirmingDelete ? (
              <>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: p.inkMuted }}>Delete?</span>
                <button onClick={() => setConfirmingDelete(false)}
                  style={{ padding: '3px 8px', border: `1px solid ${p.ruleSoft}`, borderRadius: 3, background: 'transparent', cursor: 'pointer', fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: p.inkMuted }}>
                  Cancel
                </button>
                <button onClick={() => deleteNode(node.id)}
                  style={{ padding: '3px 8px', border: `1px solid #c0392b`, borderRadius: 3, background: '#c0392b18', cursor: 'pointer', fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: '#c0392b', letterSpacing: '0.08em', fontWeight: 700 }}>
                  Delete
                </button>
              </>
            ) : (
              <button onClick={() => setConfirmingDelete(true)}
                style={{ padding: '3px 8px', border: `1px solid ${p.ruleSoft}`, borderRadius: 3, background: 'transparent', cursor: 'pointer', fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: p.inkMuted, letterSpacing: '0.08em' }}>
                🗑
              </button>
            )}
          </div>
        </div>

        {editingLabel ? (
          <input autoFocus value={labelVal} onChange={e => setLabelVal(e.target.value)}
            onBlur={commitLabel} onKeyDown={e => { if (e.key === 'Enter') commitLabel(); if (e.key === 'Escape') { setLabelVal(node.label); setEditingLabel(false) } }}
            style={{ fontSize: 24, fontWeight: 600, fontStyle: 'italic', letterSpacing: '-0.012em', border: 'none', borderBottom: `1px solid ${p.stamp}`, background: 'transparent', outline: 'none', color: p.ink, fontFamily: "'Newsreader', serif", width: '100%' }} />
        ) : (
          <div onClick={() => { setLabelVal(node.label); setEditingLabel(true) }}
            style={{ fontSize: 24, fontWeight: 600, lineHeight: 1.12, fontStyle: 'italic', letterSpacing: '-0.012em', cursor: 'text' }}>
            {node.label}
          </div>
        )}

        {editingSub ? (
          <input autoFocus value={subVal} onChange={e => setSubVal(e.target.value)}
            onBlur={commitSub} onKeyDown={e => { if (e.key === 'Enter') commitSub(); if (e.key === 'Escape') { setSubVal(node.sub); setEditingSub(false) } }}
            style={{ fontSize: 12, border: 'none', borderBottom: `1px solid ${p.ruleSoft}`, background: 'transparent', outline: 'none', color: p.inkSoft, fontFamily: "'JetBrains Mono', monospace", width: '100%', marginTop: 4 }} />
        ) : (
          <div onClick={() => { setSubVal(node.sub); setEditingSub(true) }}
            style={{ fontSize: 12.5, color: p.inkSoft, marginTop: 3, cursor: 'text', minHeight: 18, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.04em' }}>
            {node.sub || <span style={{ opacity: 0.4 }}>add sub-label…</span>}
          </div>
        )}

        {node.ring === 'subject' && (
          <div style={{ display: 'flex', gap: 8, marginTop: 10, alignItems: 'center' }}>
            <Stamp status="disputed" rotate={-3} P={p} />
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: p.inkMuted, letterSpacing: '0.08em' }}>CASE SUBJECT</span>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: `1px solid ${p.ruleSoft}`, padding: '0 14px', background: p.paperSunk, flexShrink: 0 }}>
        {tabs.map(t => {
          const active = t === tab
          const badge = t === 'Assertions' ? all.length : t === 'Relations' ? nodeEdges.length : 0
          return (
            <button key={t} onClick={() => setTab(t)} style={{
              background: 'transparent', border: 'none', padding: '10px 10px',
              fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase',
              color: active ? p.ink : p.inkMuted,
              borderBottom: active ? `2px solid ${p.stamp}` : '2px solid transparent',
              marginBottom: -1, cursor: 'pointer', fontWeight: active ? 600 : 500, whiteSpace: 'nowrap',
            }}>
              {t}{badge > 0 ? <span style={{ marginLeft: 4, fontFamily: "'JetBrains Mono', monospace", fontSize: 8.5, color: active ? p.stamp : p.inkMuted }}>({badge})</span> : null}
            </button>
          )
        })}
      </div>

      {/* Body */}
      <div style={{ padding: '16px 18px', overflow: 'auto', flex: 1 }}>

        {/* ── Overview */}
        {tab === 'Overview' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '8px 14px', fontSize: 13 }}>
              {([
                ['Type', typeMeta[node.type as NodeType]?.label ?? node.type],
                ['ID', node.id.slice(0, 16)],
                ['Created', node.createdAt.slice(0, 10)],
                ['Assertions', String(all.length)],
                ['Relationships', String(nodeEdges.length)],
                ['Ring', node.ring ?? '—'],
              ] as [string, string][]).map(([k, v]) => (
                <div key={k} style={{ display: 'contents' }}>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, letterSpacing: '0.12em', color: p.inkMuted, paddingTop: 2 }}>{k.toUpperCase()}</div>
                  <div style={{ borderBottom: `1px dotted ${p.ruleSoft}`, paddingBottom: 5, color: p.ink }}>{v}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 14, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              <button onClick={() => updateNode({ id: node.id, ring: node.ring === 'subject' ? null : 'subject' })}
                style={{ padding: '6px 12px', border: `1px solid ${node.ring === 'subject' ? p.stamp : p.ruleSoft}`, borderRadius: 3, background: node.ring === 'subject' ? p.stampSoft : 'transparent', cursor: 'pointer', fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: node.ring === 'subject' ? p.stamp : p.inkSoft, letterSpacing: '0.1em' }}>
                {node.ring === 'subject' ? '★ SUBJECT' : 'SET AS SUBJECT'}
              </button>
            </div>
          </div>
        )}

        {/* ── Details */}
        {tab === 'Details' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {fieldDefs.length === 0 && <p style={{ color: p.inkMuted, fontSize: 13, fontStyle: 'italic', margin: 0 }}>No fields defined for this type.</p>}
            {fieldDefs.map(f => {
              const val = propsEdit[f.id] ?? ''
              const saveField = (v: string) => {
                const next = { ...propsEdit, [f.id]: v }
                setPropsEdit(next)
                updateNode({ id: node.id, props: next })
              }
              const commonInput: React.CSSProperties = {
                width: '100%', padding: '6px 9px', background: p.paperSunk, border: `1px solid ${p.ruleSoft}`,
                borderRadius: 3, fontFamily: f.type === 'textarea' ? "'Newsreader', serif" : "'JetBrains Mono', monospace",
                fontStyle: f.type === 'textarea' ? 'italic' : 'normal',
                fontSize: f.type === 'textarea' ? 13.5 : 12, color: p.ink, outline: 'none',
                boxSizing: 'border-box',
              }
              return (
                <div key={f.id}>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8.5, letterSpacing: '0.14em', color: p.inkMuted, marginBottom: 4 }}>{f.label.toUpperCase()}</div>
                  {f.type === 'select' ? (
                    <select value={val} onChange={e => saveField(e.target.value)}
                      style={{ ...commonInput, cursor: 'pointer' }}>
                      <option value="">—</option>
                      {f.options!.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  ) : f.type === 'textarea' ? (
                    <textarea value={val} onChange={e => setPropsEdit(prev => ({ ...prev, [f.id]: e.target.value }))}
                      onBlur={e => saveField(e.target.value)}
                      placeholder={f.placeholder}
                      rows={3}
                      style={{ ...commonInput, resize: 'vertical', minHeight: 60 }} />
                  ) : (
                    <input type={f.type === 'date' ? 'date' : f.type === 'email' ? 'email' : 'text'}
                      value={val}
                      onChange={e => setPropsEdit(prev => ({ ...prev, [f.id]: e.target.value }))}
                      onBlur={e => saveField(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur() }}
                      placeholder={f.placeholder}
                      style={{ ...commonInput, colorScheme: f.type === 'date' ? p.mode : undefined }} />
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* ── Assertions */}
        {tab === 'Assertions' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {all.length === 0 && <p style={{ color: p.inkMuted, fontSize: 13, fontStyle: 'italic', margin: '0 0 4px' }}>No assertions yet.</p>}
            {all.map((a, i) => (
              <div key={a.id} style={{ padding: '12px 12px 10px', background: p.paper, borderRadius: 4, border: `1px solid ${p.ruleSoft}`, boxShadow: p.shadow }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: p.inkMuted, letterSpacing: '0.08em', marginBottom: 7 }}>
                  <span>§{i + 1}</span>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <span>{a.updatedAt.slice(0, 10)}</span>
                    <button onClick={() => deleteAssertion(a.id)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: p.inkMuted, fontSize: 10, padding: '0 2px', lineHeight: 1 }}>✕</button>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                  <div style={{ fontSize: 13.5, lineHeight: 1.45, fontStyle: 'italic', flex: 1, color: p.ink }}>"{a.text}"</div>
                  <Stamp status={a.status as AssertionStatus} rotate={i % 2 ? 2 : -2} P={p} />
                </div>
                {a.sources.length > 0 && (
                  <ul style={{ margin: '8px 0 0', padding: 0, listStyle: 'none' }}>
                    {a.sources.map((s, j) => (
                      <li key={j} style={{ fontSize: 11.5, color: p.inkSoft, padding: '3px 0', borderBottom: `1px dotted ${p.ruleSoft}`, display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s}</span>
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: p.inkMuted, flexShrink: 0 }}>S-{j}</span>
                      </li>
                    ))}
                  </ul>
                )}
                <div style={{ display: 'flex', gap: 3, marginTop: 10 }}>
                  {(['verified', 'asserted', 'review', 'disputed', 'rejected'] as AssertionStatus[]).map(s => {
                    const m = SM[s]
                    const active = a.status === s
                    return (
                      <button key={s} onClick={() => updateAssertion(a.id, { status: s })} style={{
                        flex: 1, fontFamily: "'JetBrains Mono', monospace", fontSize: 8, letterSpacing: '0.08em', padding: '4px 2px',
                        border: `1px solid ${active ? m.fg : p.ruleSoft}`,
                        color: active ? m.fg : p.inkMuted,
                        background: active ? m.fg + '18' : 'transparent',
                        cursor: 'pointer', borderRadius: 2, fontWeight: active ? 700 : 400,
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      }}>{m.label}</button>
                    )
                  })}
                </div>
                {/* Confidence slider */}
                <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: p.inkMuted }}>CONF</span>
                  <input type="range" min="0" max="1" step="0.05" value={a.confidence}
                    onChange={e => updateAssertion(a.id, { confidence: parseFloat(e.target.value) })}
                    style={{ flex: 1, accentColor: p.stamp, height: 2 }} />
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: p.inkMuted, minWidth: 28, textAlign: 'right' }}>{Math.round(a.confidence * 100)}%</span>
                </div>
              </div>
            ))}
            <AddAssertionForm nodeId={nodeId} p={p} />
          </div>
        )}

        {/* ── Relations */}
        {tab === 'Relations' && (
          <div>
            {nodeEdges.length === 0 && <p style={{ color: p.inkMuted, fontSize: 13, fontStyle: 'italic', margin: 0 }}>No relationships yet. Use the → button on the node to link.</p>}
            {nodeEdges.map(e => {
              const otherId = e.aId === nodeId ? e.bId : e.aId
              const other = nodes.find(n => n.id === otherId)
              const dir = e.aId === nodeId ? '→' : '←'
              const SM = statusMeta(p)
              const m = SM[e.status as AssertionStatus] ?? SM.review
              return (
                <div key={e.id} style={{ display: 'flex', alignItems: 'baseline', gap: 10, padding: '8px 0', borderBottom: `1px dotted ${p.ruleSoft}` }}>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: p.inkMuted }}>{dir}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontStyle: 'italic', color: p.ink }}>{other?.label ?? otherId.slice(0, 8)}</div>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: p.inkMuted, marginTop: 2 }}>
                    {e.label} · <span style={{ color: m.fg }}>{e.status.toUpperCase()}</span>
                    {e.occurredAt && <span style={{ marginLeft: 6, opacity: 0.7 }}>{e.occurredAt}</span>}
                  </div>
                  </div>
                  <div style={{ flexShrink: 0, fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: p.inkMuted }}>{(typeMeta[other?.type as NodeType]?.icon ?? '·')}</div>
                </div>
              )
            })}
          </div>
        )}

        {/* ── Sources */}
        {tab === 'Sources' && (
          <div>
            {all.length === 0 && <p style={{ color: p.inkMuted, fontSize: 13, fontStyle: 'italic', margin: 0 }}>No sources — add assertions with source citations.</p>}
            <ol style={{ paddingLeft: 18, margin: '0', lineHeight: 1.7 }}>
              {Array.from(new Set(all.flatMap(a => a.sources))).map((s, i) => (
                <li key={i} style={{ fontSize: 12.5, color: p.inkSoft, paddingBottom: 5, borderBottom: `1px dotted ${p.ruleSoft}`, marginBottom: 5 }}>{s}</li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Edge Inspector

function EdgeInspector({ edgeId, p }: { edgeId: string; p: P }) {
  const { nodes, edges, updateEdge, deleteEdge } = useAppStore()
  const edge = edges.find(e => e.id === edgeId)
  if (!edge) return null

  const src = nodes.find(n => n.id === edge.aId)
  const tgt = nodes.find(n => n.id === edge.bId)
  const SM = statusMeta(p)
  const statuses: EdgeStatus[] = ['verified', 'asserted', 'review', 'disputed']
  const categories = categoriesForTypes(src?.type, tgt?.type)

  const [labelVal, setLabelVal] = useState(edge.label)
  const [editingLabel, setEditingLabel] = useState(false)
  const [activeCatId, setActiveCatId] = useState<string | null>(null)
  const [confirmDelete, setConfirmDelete] = useState(false)

  useEffect(() => {
    setLabelVal(edge.label)
    setEditingLabel(false)
    setActiveCatId(null)
    setConfirmDelete(false)
  }, [edgeId])

  const commitLabel = (val = labelVal) => {
    if (val.trim() && val !== edge.label) updateEdge({ id: edge.id, label: val.trim() })
    setEditingLabel(false)
  }

  const pickSubtype = (label: string) => {
    setLabelVal(label)
    updateEdge({ id: edge.id, label })
    setActiveCatId(null)
  }

  const mono: React.CSSProperties = { fontFamily: "'JetBrains Mono', monospace" }

  return (
    <div style={{ height: '100%', background: p.paperRaised, borderLeft: `1px solid ${p.rule}`, display: 'flex', flexDirection: 'column', fontFamily: "'Newsreader', serif", color: p.ink, overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '18px 20px 14px', borderBottom: `1px solid ${p.ruleSoft}`, flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <span style={{ ...mono, fontSize: 9.5, letterSpacing: '0.16em', color: p.inkMuted }}>RELATIONSHIP</span>
          {confirmDelete ? (
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <span style={{ ...mono, fontSize: 9, color: p.inkMuted }}>Delete?</span>
              <button onClick={() => setConfirmDelete(false)} style={{ padding: '3px 8px', border: `1px solid ${p.ruleSoft}`, borderRadius: 3, background: 'transparent', cursor: 'pointer', ...mono, fontSize: 9, color: p.inkMuted }}>Cancel</button>
              <button onClick={() => deleteEdge(edge.id)} style={{ padding: '3px 8px', border: '1px solid #c0392b', borderRadius: 3, background: '#c0392b18', cursor: 'pointer', ...mono, fontSize: 9, color: '#c0392b', fontWeight: 700 }}>Delete</button>
            </div>
          ) : (
            <button onClick={() => setConfirmDelete(true)} style={{ padding: '3px 8px', border: `1px solid ${p.ruleSoft}`, borderRadius: 3, background: 'transparent', cursor: 'pointer', ...mono, fontSize: 9, color: p.inkMuted }}>🗑</button>
          )}
        </div>

        {/* Endpoints */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <span style={{ fontSize: 13, fontStyle: 'italic', color: p.ink }}>{src?.label ?? edge.aId.slice(0, 8)}</span>
          <span style={{ ...mono, fontSize: 10, color: p.inkMuted }}>→</span>
          <span style={{ fontSize: 13, fontStyle: 'italic', color: p.ink }}>{tgt?.label ?? edge.bId.slice(0, 8)}</span>
        </div>

        {/* Label */}
        {editingLabel ? (
          <input autoFocus value={labelVal} onChange={e => setLabelVal(e.target.value)}
            onBlur={() => commitLabel()}
            onKeyDown={e => { if (e.key === 'Enter') commitLabel(); if (e.key === 'Escape') { setLabelVal(edge.label); setEditingLabel(false) } }}
            style={{ fontSize: 20, fontWeight: 600, fontStyle: 'italic', border: 'none', borderBottom: `1px solid ${p.stamp}`, background: 'transparent', outline: 'none', color: p.ink, fontFamily: "'Newsreader', serif", width: '100%' }} />
        ) : (
          <div onClick={() => setEditingLabel(true)}
            style={{ fontSize: 20, fontWeight: 600, fontStyle: 'italic', cursor: 'text', letterSpacing: '-0.01em' }}>
            {edge.label}
          </div>
        )}
      </div>

      {/* Body */}
      <div style={{ padding: '16px 18px', overflow: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* Relationship presets */}
        <div>
          <div style={{ ...mono, fontSize: 9, color: p.inkMuted, letterSpacing: '0.14em', marginBottom: 8 }}>CHANGE TYPE</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 4, marginBottom: activeCatId ? 10 : 0 }}>
            {categories.map(c => {
              const active = c.id === activeCatId
              return (
                <button key={c.id} onClick={() => setActiveCatId(active ? null : c.id)} style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, padding: '8px 4px',
                  border: `1px solid ${active ? p.stamp : p.ruleSoft}`, borderRadius: 4,
                  background: active ? p.stamp + '18' : 'transparent', cursor: 'pointer',
                }}>
                  <span style={{ fontSize: 13, lineHeight: 1 }}>{c.icon}</span>
                  <span style={{ ...mono, fontSize: 7.5, color: active ? p.stamp : p.inkMuted, letterSpacing: '0.06em', textAlign: 'center', lineHeight: 1.3 }}>{c.label.toUpperCase()}</span>
                </button>
              )
            })}
          </div>
          {activeCatId && (() => {
            const cat = categories.find(c => c.id === activeCatId)!
            return (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                {cat.subtypes.map(s => (
                  <button key={s.id} onClick={() => pickSubtype(s.label)} style={{
                    padding: '5px 10px', border: `1px solid ${edge.label === s.label ? p.ink : p.ruleSoft}`,
                    borderRadius: 3, background: edge.label === s.label ? p.ink : 'transparent',
                    color: edge.label === s.label ? p.paper : p.inkSoft,
                    cursor: 'pointer', fontFamily: "'Newsreader', serif", fontStyle: 'italic', fontSize: 13,
                  }}>{s.label}</button>
                ))}
              </div>
            )
          })()}
        </div>

        {/* Status */}
        <div>
          <div style={{ ...mono, fontSize: 9, color: p.inkMuted, letterSpacing: '0.14em', marginBottom: 8 }}>STATUS</div>
          <div style={{ display: 'flex', gap: 5 }}>
            {statuses.map(s => {
              const m = SM[s]
              const active = edge.status === s
              return (
                <button key={s} onClick={() => updateEdge({ id: edge.id, status: s })} style={{
                  flex: 1, ...mono, fontSize: 9, padding: '6px 4px', borderRadius: 3,
                  border: `1px solid ${active ? m.fg : p.ruleSoft}`,
                  background: active ? m.fg + '22' : 'transparent',
                  color: active ? m.fg : p.inkMuted, cursor: 'pointer',
                  fontWeight: active ? 700 : 400, letterSpacing: '0.1em', textTransform: 'uppercase',
                }}>{s}</button>
              )
            })}
          </div>
        </div>

        {/* Date */}
        <div>
          <div style={{ ...mono, fontSize: 9, color: p.inkMuted, letterSpacing: '0.14em', marginBottom: 8 }}>DATE</div>
          <input type="date" value={edge.occurredAt ?? ''}
            onChange={e => updateEdge({ id: edge.id, occurredAt: e.target.value || null })}
            style={{ width: '100%', padding: '7px 10px', background: p.paperSunk, border: `1px solid ${p.ruleSoft}`, borderRadius: 3, ...mono, fontSize: 12, color: p.ink, outline: 'none', boxSizing: 'border-box', colorScheme: p.mode }} />
        </div>

        {/* Meta */}
        <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '6px 14px' }}>
          {([['ID', edge.id.slice(0, 16)], ['Created', edge.createdAt.slice(0, 10)]] as [string,string][]).map(([k, v]) => (
            <div key={k} style={{ display: 'contents' }}>
              <div style={{ ...mono, fontSize: 9, letterSpacing: '0.12em', color: p.inkMuted, paddingTop: 2 }}>{k.toUpperCase()}</div>
              <div style={{ borderBottom: `1px dotted ${p.ruleSoft}`, paddingBottom: 4, color: p.inkSoft, ...mono, fontSize: 11 }}>{v}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Add Entity modal

function AddEntityModal({ p, onClose }: { p: P; onClose: () => void }) {
  const { createNode } = useAppStore()
  const [label, setLabel] = useState('')
  const [sub, setSub] = useState('')
  const [type, setType] = useState<NodeType>('person')
  const types: NodeType[] = ['person', 'org', 'account', 'device', 'location', 'event', 'evidence']

  const submit = async () => {
    if (!label.trim()) return
    const x = 120 + Math.random() * 640
    const y = 80 + Math.random() * 400
    await createNode(type, label.trim(), sub.trim(), x, y)
    onClose()
  }

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div onClick={e => e.stopPropagation()} style={{ width: 440, background: p.paperRaised, border: `1px solid ${p.rule}`, borderRadius: 5, padding: '22px 24px', boxShadow: p.shadowLg, fontFamily: "'Newsreader', serif" }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: p.inkMuted, letterSpacing: '0.18em', marginBottom: 12 }}>NEW ENTITY</div>
        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 14 }}>
          {types.map(t => (
            <button key={t} onClick={() => setType(t)} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, padding: '5px 8px', borderRadius: 3, border: `1px solid ${type === t ? p.ink : p.ruleSoft}`, background: type === t ? p.ink : 'transparent', color: type === t ? p.paper : p.inkSoft, cursor: 'pointer', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{t}</button>
          ))}
        </div>
        <input autoFocus value={label} onChange={e => setLabel(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') submit(); if (e.key === 'Escape') onClose() }}
          placeholder={`${typeMeta[type].label} name or label…`}
          style={{ width: '100%', padding: '10px 12px', background: p.paperSunk, border: `1px solid ${p.rule}`, borderRadius: 4, fontFamily: "'Newsreader', serif", fontStyle: 'italic', fontSize: 18, color: p.ink, outline: 'none', boxSizing: 'border-box', marginBottom: 10 }} />
        <input value={sub} onChange={e => setSub(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') submit(); if (e.key === 'Escape') onClose() }}
          placeholder="Role, description, or identifier…"
          style={{ width: '100%', padding: '7px 12px', background: p.paperSunk, border: `1px solid ${p.ruleSoft}`, borderRadius: 4, fontFamily: "'JetBrains Mono', monospace", fontSize: 11.5, color: p.ink, outline: 'none', boxSizing: 'border-box', marginBottom: 14 }} />
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{ padding: '7px 16px', background: 'transparent', border: `1px solid ${p.ruleSoft}`, borderRadius: 3, cursor: 'pointer', fontFamily: "'Newsreader', serif", fontStyle: 'italic', fontSize: 13, color: p.inkSoft }}>Cancel</button>
          <button onClick={submit} style={{ padding: '7px 20px', background: p.stamp, border: 'none', borderRadius: 3, cursor: 'pointer', fontFamily: "'Newsreader', serif", fontStyle: 'italic', fontSize: 14, fontWeight: 600, color: p.mode === 'dark' ? '#1c1812' : '#f3ebd8' }}>Add ↵</button>
        </div>
      </div>
    </div>
  )
}

// ─── Investigation page

export function Investigation({ onSearch, onAvatar }: { onSearch?: () => void; onAvatar?: () => void }) {
  const { P } = useTheme()
  const { nodes, selectedNodeId, selectedEdgeId, activeCase, views, createView, deleteView } = useAppStore()
  const [tab, setTab] = useState('Assertions')
  const [filter, setFilter] = useState<string>('all')
  const [activeViewId, setActiveViewId] = useState<string | null>(null)
  const [showAddEntity, setShowAddEntity] = useState(false)
  const [savingView, setSavingView] = useState(false)
  const [newViewLabel, setNewViewLabel] = useState('')

  const selectedId = selectedNodeId ?? ''

  useEffect(() => { setTab('Assertions') }, [selectedNodeId])
  useEffect(() => { setFilter('all'); setActiveViewId(null) }, [activeCase?.id])

  const usedTypes = Array.from(new Set(nodes.map(n => n.type)))
  const filterTypes: string[] = ['all', ...usedTypes]

  return (
    <>
    <div style={{ width: '100%', height: '100vh', background: P.paper, color: P.ink, fontFamily: "'Newsreader', 'Source Serif 4', Georgia, serif", display: 'grid', gridTemplateColumns: '220px 1fr 390px', gridTemplateRows: '64px 1fr', gridTemplateAreas: "'top top top' 'left main right'", overflow: 'hidden' }}>
      <div style={{ gridArea: 'top' }}>
        <TopBar P={P} onAvatarClick={onAvatar} onSearchClick={onSearch} />
      </div>

      {/* LEFT RAIL */}
      <div style={{ gridArea: 'left', background: P.paperSunk, borderRight: `1px solid ${P.rule}`, padding: '18px 16px', overflow: 'auto', display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: P.inkMuted, letterSpacing: '0.18em', marginBottom: 8 }}>SAVED VIEWS</div>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 1 }}>
            {views.length === 0 && !savingView && (
              <li style={{ fontFamily: "'Newsreader', serif", fontStyle: 'italic', fontSize: 13, color: P.inkMuted, padding: '4px 2px' }}>No saved views yet.</li>
            )}
            {views.map(v => {
              const f: { filter: string } = JSON.parse(v.filterJson)
              const active = v.id === activeViewId
              return (
                <li key={v.id} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '5px 0' }}>
                  <div onClick={() => { setActiveViewId(v.id); setFilter(f.filter) }}
                    style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '4px 10px', cursor: 'pointer', borderRadius: 3, background: active ? P.stampSoft : 'transparent', borderLeft: active ? `2px solid ${P.stamp}` : '2px solid transparent', marginLeft: -2, paddingLeft: 12 }}>
                    <span style={{ fontSize: 13.5, fontStyle: active ? 'italic' : 'normal', color: active ? P.ink : P.inkSoft }}>{v.label}</span>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: P.inkMuted }}>{f.filter === 'all' ? 'all' : f.filter}</span>
                  </div>
                  <button onClick={() => { deleteView(v.id); if (activeViewId === v.id) { setActiveViewId(null) } }}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: P.inkMuted, fontSize: 10, padding: '2px 4px', lineHeight: 1, flexShrink: 0 }}>✕</button>
                </li>
              )
            })}
          </ul>

          {savingView ? (
            <div style={{ marginTop: 6, display: 'flex', gap: 4 }}>
              <input autoFocus value={newViewLabel} onChange={e => setNewViewLabel(e.target.value)}
                onKeyDown={async e => {
                  if (e.key === 'Enter' && newViewLabel.trim()) {
                    await createView(newViewLabel.trim(), JSON.stringify({ filter }))
                    setNewViewLabel(''); setSavingView(false)
                  }
                  if (e.key === 'Escape') { setNewViewLabel(''); setSavingView(false) }
                }}
                placeholder="View name…"
                style={{ flex: 1, padding: '5px 8px', background: P.paperSunk, border: `1px solid ${P.rule}`, borderRadius: 3, fontFamily: "'Newsreader', serif", fontStyle: 'italic', fontSize: 13, color: P.ink, outline: 'none' }} />
              <button onClick={async () => {
                if (newViewLabel.trim()) {
                  await createView(newViewLabel.trim(), JSON.stringify({ filter }))
                  setNewViewLabel(''); setSavingView(false)
                }
              }} style={{ padding: '5px 8px', background: P.stamp, border: 'none', borderRadius: 3, cursor: 'pointer', fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: P.mode === 'dark' ? '#1c1812' : '#f3ebd8' }}>✓</button>
              <button onClick={() => { setNewViewLabel(''); setSavingView(false) }}
                style={{ padding: '5px 8px', background: 'transparent', border: `1px solid ${P.ruleSoft}`, borderRadius: 3, cursor: 'pointer', fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: P.inkMuted }}>✕</button>
            </div>
          ) : (
            <button onClick={() => setSavingView(true)}
              style={{ marginTop: 6, width: '100%', padding: '6px', background: 'transparent', border: `1px dashed ${P.ruleSoft}`, borderRadius: 3, cursor: 'pointer', fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: P.inkMuted, letterSpacing: '0.1em' }}>
              + SAVE CURRENT VIEW
            </button>
          )}
        </div>

        <div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: P.inkMuted, letterSpacing: '0.18em', marginBottom: 8 }}>FILTER BY TYPE</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {filterTypes.map(t => {
              const active = filter === t
              const count = t === 'all' ? nodes.length : nodes.filter(n => n.type === t).length
              return (
                <button key={t} onClick={() => { setFilter(t); setActiveViewId(null) }} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, padding: '4px 7px', cursor: 'pointer', borderRadius: 3, border: `1px solid ${active ? P.ink : P.ruleSoft}`, background: active ? P.ink : 'transparent', color: active ? P.paper : P.inkSoft, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{t}{count > 0 ? ` ${count}` : ''}</button>
              )
            })}
          </div>
        </div>

        <div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: P.inkMuted, letterSpacing: '0.18em', marginBottom: 8 }}>STATS</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '5px 10px', fontSize: 12 }}>
            {[['Entities', nodes.length], ['Shown', filter === 'all' ? nodes.length : nodes.filter(n => n.type === filter).length]].map(([k, v]) => (
              <div key={k as string} style={{ display: 'contents' }}>
                <div style={{ color: P.inkSoft }}>{k}</div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, color: P.ink, textAlign: 'right' }}>{v}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop: 'auto', fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: P.inkMuted, letterSpacing: '0.16em', borderTop: `1px solid ${P.ruleSoft}`, paddingTop: 10, display: 'flex', justifyContent: 'space-between' }}>
          <span>● LOCAL</span><span>v0.6</span>
        </div>
      </div>

      {/* MAIN */}
      <div style={{ gridArea: 'main', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 12, left: 14, right: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 2, pointerEvents: 'none' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: P.inkMuted, letterSpacing: '0.14em', background: P.paperRaised, padding: '4px 10px', borderRadius: 3, border: `1px solid ${P.ruleSoft}`, pointerEvents: 'auto', boxShadow: P.shadow }}>
            {activeCase?.title.toUpperCase() ?? 'NO CASE'} · {nodes.length} ENTITIES
          </div>
          <div style={{ display: 'flex', gap: 4, pointerEvents: 'auto' }}>
            <button onClick={() => setShowAddEntity(true)} style={{ fontFamily: "'Newsreader', serif", fontStyle: 'italic', fontSize: 12, fontWeight: 600, padding: '5px 14px', border: `1px solid ${P.stamp}`, borderRadius: 3, background: P.stamp, color: P.mode === 'dark' ? '#1c1812' : '#f3ebd8', cursor: 'pointer', boxShadow: P.shadow }}>+ Entity</button>
            <button style={{ fontFamily: "'Newsreader', serif", fontStyle: 'italic', fontSize: 12, padding: '5px 12px', border: `1px solid ${P.ruleSoft}`, borderRadius: 3, background: P.paperRaised, color: P.inkSoft, cursor: 'pointer', boxShadow: P.shadow }}>Layout</button>
          </div>
        </div>
        <Graph selectedId={selectedId} selectedEdgeId={selectedEdgeId} filter={filter} p={P} />
      </div>

      {/* INSPECTOR */}
      <div style={{ gridArea: 'right', overflow: 'hidden' }}>
        {selectedId ? (
          <Inspector nodeId={selectedId} tab={tab} setTab={setTab} p={P} />
        ) : selectedEdgeId ? (
          <EdgeInspector edgeId={selectedEdgeId} p={P} />
        ) : (
          <div style={{ height: '100%', background: P.paperRaised, borderLeft: `1px solid ${P.rule}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, color: P.inkMuted, padding: 24 }}>
            <div style={{ fontSize: 32, opacity: 0.3 }}>◎</div>
            <div style={{ fontStyle: 'italic', fontSize: 14, fontFamily: "'Newsreader', serif", textAlign: 'center', lineHeight: 1.5 }}>
              Select a node or relationship to inspect.
            </div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, letterSpacing: '0.14em', textAlign: 'center', lineHeight: 1.7, opacity: 0.7 }}>
              CLICK NODE TO SELECT<br />
              CLICK EDGE TO INSPECT<br />
              → BUTTON TO LINK NODES<br />
              SCROLL TO ZOOM<br />
              DRAG BACKGROUND TO PAN
            </div>
          </div>
        )}
      </div>
    </div>
    {showAddEntity && <AddEntityModal p={P} onClose={() => setShowAddEntity(false)} />}
    </>
  )
}
