import type { Palette, AssertionStatus } from '../design/palette'
import { statusMeta } from '../design/palette'

interface Props {
  status: AssertionStatus
  rotate?: number
  P: Palette
  size?: number
}

export function Stamp({ status, rotate = -2, P, size = 1 }: Props) {
  const m = statusMeta(P)[status]
  if (!m) return null
  return (
    <span style={{
      display: 'inline-block',
      padding: `${3 * size}px ${9 * size}px`,
      border: `${1.4 * size}px solid ${m.fg}`,
      color: m.fg,
      fontFamily: "'JetBrains Mono', ui-monospace, monospace",
      fontSize: 9.5 * size,
      letterSpacing: '0.18em',
      fontWeight: 700,
      transform: `rotate(${rotate}deg)`,
      background: P.mode === 'dark' ? 'rgba(240,230,206,0.04)' : 'rgba(243,235,216,0.6)',
      boxShadow: `inset 0 0 0 0.5px ${m.fg}`,
    }}>{m.label}</span>
  )
}
