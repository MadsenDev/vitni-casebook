import type { Palette } from '../design/palette'

interface Props { P: Palette; right?: string }

export function SystemStrip({ P, right = '' }: Props) {
  return (
    <div style={{
      height: 28,
      background: P.paperSunk,
      borderTop: `1px solid ${P.rule}`,
      padding: '0 22px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: 9.5,
      color: P.inkMuted,
      letterSpacing: '0.16em',
      flexShrink: 0,
    }}>
      <span>● LOCAL · ENCRYPTED · v0.6</span>
      <span>{right}</span>
    </div>
  )
}
