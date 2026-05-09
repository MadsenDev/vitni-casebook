import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'


interface Props { onClose: () => void }

export function AvatarMenu({ onClose }: Props) {
  const { P, toggleMode, mode } = useTheme()
  const navigate = useNavigate()
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => { if (menuRef.current && !menuRef.current.contains(e.target as Node)) onClose() }
    const kh = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('mousedown', handler)
    document.addEventListener('keydown', kh)
    return () => { document.removeEventListener('mousedown', handler); document.removeEventListener('keydown', kh) }
  }, [onClose])

  const items: Array<{ icon?: string; label?: string; hint?: string; divider?: boolean; action?: () => void }> = [
    { icon: '◉', label: 'Profile', hint: '' },
    { icon: '⚙', label: 'Settings', hint: '⌘,', action: () => { navigate('/settings'); onClose() } },
    { icon: '☰', label: 'My cases', hint: '4 active' },
    { icon: '⌘', label: 'Keyboard shortcuts', hint: '?' },
    { divider: true },
    { icon: '◐', label: `Theme: ${mode}`, hint: 'L · D', action: () => { toggleMode(); onClose() } },
    { icon: '⌥', label: 'Density: comfortable', hint: '' },
    { divider: true },
    { icon: '⏿', label: 'Lock workspace', hint: '⌘⇧L', action: () => { navigate('/lock'); onClose() } },
    { icon: '↗', label: "What's new in 0.6", hint: '' },
    { divider: true },
    { icon: '⏻', label: 'Sign out', hint: '' },
  ]

  return (
    <div ref={menuRef} style={{ position: 'fixed', top: 70, right: 22, width: 320, background: P.paperRaised, border: `1px solid ${P.rule}`, borderRadius: 5, boxShadow: P.shadowLg, zIndex: 200, fontFamily: "'Newsreader', 'Source Serif 4', Georgia, serif" }}>
      {/* Tail */}
      <div style={{ position: 'absolute', top: -6, right: 16, width: 12, height: 12, background: P.paperRaised, borderTop: `1px solid ${P.rule}`, borderLeft: `1px solid ${P.rule}`, transform: 'rotate(45deg)', zIndex: 1 }} />

      {/* Identity */}
      <div style={{ padding: '18px 18px 14px', borderBottom: `1px solid ${P.ruleSoft}`, display: 'flex', gap: 12, alignItems: 'center' }}>
        <div style={{ width: 44, height: 44, borderRadius: '50%', background: P.ink, color: P.paper, display: 'grid', placeItems: 'center', fontFamily: "'Newsreader', serif", fontSize: 19, fontStyle: 'italic', boxShadow: P.shadow, flexShrink: 0 }}>cm</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 16, fontWeight: 600, fontStyle: 'italic', lineHeight: 1.1 }}>Christian Madsen</div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, color: P.inkMuted, marginTop: 3, letterSpacing: '0.04em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>cm@madsens.dev</div>
          <div style={{ marginTop: 6, fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, letterSpacing: '0.14em', color: P.asserted, display: 'flex', gap: 6, alignItems: 'center' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: P.asserted, display: 'inline-block' }} />LOCAL · ENCRYPTED
          </div>
        </div>
      </div>

      {/* Active case */}
      <div style={{ padding: '10px 18px', borderBottom: `1px solid ${P.ruleSoft}`, background: P.paperSunk, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: P.inkMuted, letterSpacing: '0.16em' }}>ACTIVE CASE</div>
          <div style={{ fontSize: 13.5, fontStyle: 'italic', marginTop: 2 }}>{'No case'}</div>
        </div>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: P.inkMuted, letterSpacing: '0.06em' }}>{'—'}</span>
      </div>

      {/* Menu items */}
      <div style={{ padding: '6px 0' }}>
        {items.map((it, i) => it.divider ? (
          <div key={i} style={{ height: 1, background: P.ruleSoft, margin: '6px 14px' }} />
        ) : (
          <button key={i} onClick={it.action} style={{ display: 'grid', gridTemplateColumns: '22px 1fr auto', alignItems: 'center', width: '100%', padding: '9px 18px', gap: 12, background: 'transparent', border: 'none', cursor: 'pointer' }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: P.inkMuted, textAlign: 'center' }}>{it.icon}</span>
            <span style={{ fontSize: 14, color: P.ink, textAlign: 'left' }}>{it.label}</span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: P.inkMuted }}>{it.hint}</span>
          </button>
        ))}
      </div>

      {/* Footer */}
      <div style={{ padding: '10px 18px', borderTop: `1px solid ${P.ruleSoft}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: P.inkMuted, letterSpacing: '0.12em' }}>LOCAL · ENCRYPTED</span>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: P.inkMuted }}>v0.6.0</span>
      </div>
    </div>
  )
}
