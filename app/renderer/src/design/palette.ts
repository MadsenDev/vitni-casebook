export type Mode = 'light' | 'dark'

export interface Palette {
  mode: Mode
  paper: string
  paperRaised: string
  paperSunk: string
  ink: string
  inkSoft: string
  inkMuted: string
  rule: string
  ruleSoft: string
  ruleStrong: string
  stamp: string
  stampSoft: string
  asserted: string
  review: string
  disputed: string
  shadow: string
  shadowLg: string
  texture: string
}

export const palettes: Record<Mode, Palette> = {
  light: {
    mode: 'light',
    paper: '#f3ebd8',
    paperRaised: '#f7f0de',
    paperSunk: '#ebe2cc',
    ink: '#1c1812',
    inkSoft: '#574836',
    inkMuted: '#8b7c63',
    rule: 'rgba(28,24,18,0.16)',
    ruleSoft: 'rgba(28,24,18,0.10)',
    ruleStrong: 'rgba(28,24,18,0.55)',
    stamp: '#7a2226',
    stampSoft: 'rgba(122,34,38,0.12)',
    asserted: '#3a5a32',
    review: '#a05d18',
    disputed: '#7a2226',
    shadow: '0 1px 2px rgba(28,24,18,0.06), 0 4px 18px rgba(28,24,18,0.05)',
    shadowLg: '0 2px 4px rgba(28,24,18,0.08), 0 12px 30px rgba(28,24,18,0.07)',
    texture: 'rgba(28,24,18,0.045)',
  },
  dark: {
    mode: 'dark',
    paper: '#1c1812',
    paperRaised: '#221d15',
    paperSunk: '#15110b',
    ink: '#f0e6ce',
    inkSoft: '#bfae8b',
    inkMuted: '#8a7a5e',
    rule: 'rgba(240,230,206,0.12)',
    ruleSoft: 'rgba(240,230,206,0.07)',
    ruleStrong: 'rgba(240,230,206,0.45)',
    stamp: '#e26e6e',
    stampSoft: 'rgba(226,110,110,0.14)',
    asserted: '#7fc26b',
    review: '#e0a25a',
    disputed: '#e26e6e',
    shadow: '0 1px 2px rgba(0,0,0,0.4), 0 4px 18px rgba(0,0,0,0.25)',
    shadowLg: '0 2px 4px rgba(0,0,0,0.5), 0 12px 30px rgba(0,0,0,0.35)',
    texture: 'rgba(240,230,206,0.04)',
  },
}

export type AssertionStatus = 'verified' | 'asserted' | 'review' | 'disputed' | 'rejected'

export function statusMeta(P: Palette): Record<AssertionStatus, { label: string; fg: string }> {
  return {
    verified: { label: 'VERIFIED', fg: P.asserted },
    asserted: { label: 'ASSERTED', fg: P.asserted },
    review:   { label: 'REVIEW',   fg: P.review },
    disputed: { label: 'DISPUTED', fg: P.disputed },
    rejected: { label: 'REJECTED', fg: P.inkMuted },
  }
}
