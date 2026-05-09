import type { Palette } from '../design/palette'

interface Props { size?: number; P: Palette }

export function DossierMark({ size = 28, P }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden>
      <circle cx="20" cy="20" r="18" fill="none" stroke={P.stamp} strokeWidth="1.4" />
      <circle cx="20" cy="20" r="14" fill="none" stroke={P.stamp} strokeWidth="0.55" opacity="0.85" />
      <text x="20" y="25" textAnchor="middle" fontFamily="'Newsreader', serif"
            fontWeight="700" fontStyle="italic" fontSize="17" fill={P.stamp}>V</text>
      {[...Array(12)].map((_, i) => {
        const a = (i / 12) * Math.PI * 2
        const x1 = 20 + Math.cos(a) * 16, y1 = 20 + Math.sin(a) * 16
        const x2 = 20 + Math.cos(a) * 17.5, y2 = 20 + Math.sin(a) * 17.5
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={P.stamp} strokeWidth="0.7" />
      })}
    </svg>
  )
}
