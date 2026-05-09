import { useTheme } from '../context/ThemeContext'
import { TopBar } from '../components/TopBar'
import { SystemStrip } from '../components/SystemStrip'
import { caseData } from '../data/caseData'

const C = caseData

const auditLog = [
  { ts: '2025-10-14 09:41:22', actor: 'cm', action: 'Opened case', detail: 'Workspace unlocked · IP 127.0.0.1', type: 'access' },
  { ts: '2025-10-14 09:43:05', actor: 'cm', action: 'Added assertion', detail: '§w1 · "GH Holdings transferred €150k to BAC International Panama"', type: 'write' },
  { ts: '2025-10-14 09:48:31', actor: 'cm', action: 'Status changed', detail: '§w1 · asserted → verified', type: 'write' },
  { ts: '2025-10-14 10:02:14', actor: 'cm', action: 'Imported source', detail: 'Bank stmt 08-2025.pdf · SHA-256: a4f8…', type: 'import' },
  { ts: '2025-10-14 10:07:44', actor: 'cm', action: 'Created entity', detail: 'GH Holdings LLC (org) · id: gh', type: 'write' },
  { ts: '2025-10-14 10:15:09', actor: 'cm', action: 'Created edge', detail: 'gh → bac · TRANSFERRED_TO', type: 'write' },
  { ts: '2025-10-14 10:31:00', actor: 'cm', action: 'Locked workspace', detail: 'Session ended', type: 'access' },
  { ts: '2025-10-14 14:02:55', actor: 'cm', action: 'Opened case', detail: 'Workspace unlocked · IP 127.0.0.1', type: 'access' },
  { ts: '2025-10-14 14:08:17', actor: 'cm', action: 'Added assertion', detail: '§w2 · "Wire transfer routed via intermediary in Cyprus"', type: 'write' },
  { ts: '2025-10-14 14:22:41', actor: 'cm', action: 'Exported report', detail: 'Preliminary findings · PDF · 12 pages', type: 'export' },
  { ts: '2025-10-14 14:45:03', actor: 'cm', action: 'Status changed', detail: '§lena1 · review → verified', type: 'write' },
  { ts: '2025-10-14 15:00:00', actor: 'cm', action: 'Locked workspace', detail: 'Session ended', type: 'access' },
]

const typeColors: Record<string, string> = {
  access: 'stamp',
  write: 'asserted',
  import: 'review',
  export: 'review',
}

const typeIcons: Record<string, string> = {
  access: '⊙',
  write: '✎',
  import: '↧',
  export: '↗',
}

export function Audit({ onSearch, onAvatar }: { onSearch?: () => void; onAvatar?: () => void }) {
  const { P } = useTheme()

  return (
    <div style={{ width: '100%', height: '100vh', background: P.paper, color: P.ink, fontFamily: "'Newsreader', 'Source Serif 4', Georgia, serif", display: 'grid', gridTemplateRows: '64px 1fr 28px', overflow: 'hidden' }}>
      <TopBar P={P} onAvatarClick={onAvatar} onSearchClick={onSearch} />

      <div style={{ overflow: 'hidden', display: 'grid', gridTemplateColumns: '260px 1fr' }}>
        {/* Left rail */}
        <div style={{ borderRight: `1px solid ${P.rule}`, overflow: 'auto', padding: '20px 16px', background: P.paperSunk }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: P.inkMuted, letterSpacing: '0.18em', marginBottom: 10 }}>AUDIT · {C.caseId}</div>
          <div style={{ fontSize: 18, fontStyle: 'italic', fontWeight: 600, marginBottom: 4 }}>{C.caseTitle}</div>
          <div style={{ fontSize: 13, color: P.inkSoft, marginBottom: 24 }}>Tamper-evident log</div>

          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: P.inkMuted, letterSpacing: '0.14em', marginBottom: 10 }}>FILTER BY TYPE</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 24 }}>
            {['All events', 'Access', 'Write', 'Import', 'Export'].map(f => (
              <button key={f} style={{ padding: '8px 12px', background: f === 'All events' ? P.stampSoft : 'transparent', border: `1px solid ${f === 'All events' ? P.stamp : P.ruleSoft}`, borderRadius: 3, textAlign: 'left', cursor: 'pointer', fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: f === 'All events' ? P.ink : P.inkSoft, letterSpacing: '0.1em' }}>
                {f.toUpperCase()}
              </button>
            ))}
          </div>

          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: P.inkMuted, letterSpacing: '0.14em', marginBottom: 10 }}>LOG INTEGRITY</div>
          <div style={{ padding: '12px', background: P.paperRaised, border: `1px solid ${P.ruleSoft}`, borderRadius: 3 }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: P.asserted }} />
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: P.asserted, letterSpacing: '0.1em' }}>CHAIN INTACT</span>
            </div>
            <div style={{ fontSize: 12, color: P.inkSoft, lineHeight: 1.5 }}>All {auditLog.length} entries verified. Hash chain unbroken.</div>
            <div style={{ marginTop: 8, fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: P.inkMuted }}>ROOT: e9f2a1c4…</div>
          </div>

          <div style={{ marginTop: 20 }}>
            <button style={{ width: '100%', padding: '9px 12px', background: 'transparent', border: `1px solid ${P.rule}`, borderRadius: 3, cursor: 'pointer', fontFamily: "'Newsreader', serif", fontStyle: 'italic', fontSize: 14, color: P.inkSoft }}>
              Export audit log →
            </button>
          </div>
        </div>

        {/* Main — log entries */}
        <div style={{ overflow: 'auto', padding: '24px 32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 24 }}>
            <div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: P.inkMuted, letterSpacing: '0.18em', marginBottom: 4 }}>AUDIT LOG</div>
              <div style={{ fontSize: 24, fontStyle: 'italic', fontWeight: 600 }}>All events</div>
            </div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: P.inkMuted }}>{auditLog.length} entries · Oct 14 2025</div>
          </div>

          {/* Log table */}
          <div style={{ border: `1px solid ${P.rule}`, borderRadius: 3, overflow: 'hidden' }}>
            {/* Header */}
            <div style={{ display: 'grid', gridTemplateColumns: '160px 32px 140px 1fr', padding: '8px 16px', background: P.paperSunk, borderBottom: `1px solid ${P.rule}`, fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: P.inkMuted, letterSpacing: '0.1em', gap: 12 }}>
              <span>TIMESTAMP</span>
              <span>TYPE</span>
              <span>ACTION</span>
              <span>DETAIL</span>
            </div>

            {auditLog.map((entry, i) => {
              const colorKey = typeColors[entry.type] as 'stamp' | 'asserted' | 'review'
              const color = P[colorKey]
              return (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '160px 32px 140px 1fr', padding: '11px 16px', borderBottom: `1px solid ${P.ruleSoft}`, gap: 12, alignItems: 'baseline', background: i % 2 === 0 ? 'transparent' : P.paperRaised }}>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: P.inkMuted }}>{entry.ts.slice(11)}</span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color, textAlign: 'center' }}>{typeIcons[entry.type]}</span>
                  <span style={{ fontSize: 13, fontWeight: 500, color: P.ink }}>{entry.action}</span>
                  <span style={{ fontSize: 12.5, fontStyle: 'italic', color: P.inkSoft, lineHeight: 1.4 }}>{entry.detail}</span>
                </div>
              )
            })}
          </div>

          {/* Date separator example */}
          <div style={{ marginTop: 32, paddingTop: 24, borderTop: `1px solid ${P.ruleSoft}`, fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: P.inkMuted, letterSpacing: '0.14em', textAlign: 'center' }}>
            ↑ OLDER ENTRIES · Oct 13 2025
          </div>
        </div>
      </div>

      <SystemStrip P={P} />
    </div>
  )
}
