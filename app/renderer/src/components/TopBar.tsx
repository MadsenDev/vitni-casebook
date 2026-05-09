import { useNavigate, useLocation } from 'react-router-dom'
import type { Palette } from '../design/palette'
import { DossierMark } from './DossierMark'
import { useAppStore } from '../store/appStore'

interface Props {
  P: Palette
  searchPlaceholder?: string
  onAvatarClick?: () => void
  onSearchClick?: () => void
}

const tabs = [
  { label: 'Investigation', path: '/investigation' },
  { label: 'Timeline',      path: '/timeline' },
  { label: 'Review',        path: '/review' },
  { label: 'Reports',       path: '/reports' },
]

export function TopBar({ P, searchPlaceholder = 'Search facts, sources, names…', onAvatarClick, onSearchClick }: Props) {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { activeCase } = useAppStore()

  return (
    <div style={{
      height: 64,
      background: P.paperSunk,
      borderBottom: `1px solid ${P.rule}`,
      display: 'grid',
      gridTemplateColumns: 'auto 1fr auto',
      alignItems: 'center',
      padding: '0 22px',
      gap: 24,
      flexShrink: 0,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={() => navigate('/investigation')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex' }}>
          <DossierMark size={32} P={P} />
        </button>
        <div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: P.inkMuted, letterSpacing: '0.18em' }}>
            VITNI · CASEBOOK
          </div>
          <div style={{ fontSize: 17, fontWeight: 600, fontStyle: 'italic', lineHeight: 1, marginTop: 2, color: P.ink }}>
            {activeCase?.title ?? 'No case loaded'}
          </div>
        </div>
        {activeCase && (
          <div style={{ marginLeft: 14, padding: '4px 10px', border: `1px solid ${P.rule}`, borderRadius: 3, fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.1em', color: P.ink }}>
            {activeCase.id.slice(0, 12)}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 4 }}>
        {tabs.map(({ label, path }) => {
          const active = pathname.startsWith(path)
          return (
            <button key={label} onClick={() => navigate(path)} style={{
              background: active ? P.ink : 'transparent',
              color: active ? P.paper : P.ink,
              border: `1px solid ${active ? P.ink : P.ruleSoft}`,
              padding: '7px 16px',
              cursor: 'pointer',
              borderRadius: 3,
              fontFamily: "'Newsreader', serif",
              fontSize: 13,
              fontStyle: 'italic',
              boxShadow: active ? P.shadow : 'none',
            }}>{label}</button>
          )
        })}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <button onClick={onSearchClick} style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: P.paperRaised, border: `1px solid ${P.ruleSoft}`,
          padding: '6px 12px', minWidth: 240, color: P.inkMuted, borderRadius: 3,
          cursor: 'text',
        }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={P.inkMuted} strokeWidth="2">
            <circle cx="11" cy="11" r="7" /><path d="m20 20-3-3" />
          </svg>
          <span style={{ fontSize: 12, fontStyle: 'italic' }}>{searchPlaceholder}</span>
          <span style={{ marginLeft: 'auto', fontFamily: "'JetBrains Mono', monospace", fontSize: 10, opacity: 0.6 }}>⌘K</span>
        </button>
        <button onClick={onAvatarClick} style={{
          width: 30, height: 30, borderRadius: '50%',
          background: P.ink, color: P.paper,
          display: 'grid', placeItems: 'center',
          fontFamily: "'Newsreader', serif", fontSize: 13, fontStyle: 'italic',
          boxShadow: P.shadow, border: 'none', cursor: 'pointer',
        }}>cm</button>
      </div>
    </div>
  )
}
