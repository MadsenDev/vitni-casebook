import { useTheme } from '../context/ThemeContext'
import { TopBar } from '../components/TopBar'
import { Stamp } from '../components/Stamp'
import { caseData } from '../data/caseData'

const C = caseData

export function Source({ onSearch, onAvatar }: { onSearch?: () => void; onAvatar?: () => void }) {
  const { P } = useTheme()

  return (
    <div style={{ width: '100%', height: '100vh', background: P.paper, color: P.ink, fontFamily: "'Newsreader', 'Source Serif 4', Georgia, serif", display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <TopBar P={P} onAvatarClick={onAvatar} onSearchClick={onSearch} />

      {/* Breadcrumb */}
      <div style={{ padding: '10px 22px', borderBottom: `1px solid ${P.ruleSoft}`, display: 'flex', alignItems: 'center', gap: 8, fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: P.inkMuted, letterSpacing: '0.12em', flexShrink: 0 }}>
        <span style={{ cursor: 'pointer', color: P.inkSoft }}>Sources</span>
        <span>›</span>
        <span>Bank stmt 08-2025</span>
        <span style={{ marginLeft: 'auto' }}>PDF · 14 pages · S-01</span>
      </div>

      {/* Three-column layout */}
      <div style={{ flex: 1, overflow: 'hidden', display: 'grid', gridTemplateColumns: '260px 1fr 320px' }}>
        {/* Left — pages + provenance */}
        <div style={{ borderRight: `1px solid ${P.rule}`, overflow: 'auto', padding: '18px 16px', background: P.paperSunk }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: P.inkMuted, letterSpacing: '0.18em', marginBottom: 10 }}>PAGES</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
            {[1, 2, 3, 4].map(pg => (
              <div key={pg} style={{ padding: '8px 10px', background: pg === 2 ? P.stampSoft : P.paper, border: `1px solid ${pg === 2 ? P.stamp : P.ruleSoft}`, borderRadius: 3, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 13, fontStyle: pg === 2 ? 'italic' : 'normal', color: pg === 2 ? P.ink : P.inkSoft }}>Page {pg}</span>
                {pg === 2 && <Stamp status="verified" rotate={0} P={P} />}
              </div>
            ))}
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: P.inkMuted, padding: '6px 0', textAlign: 'center' }}>… 10 more pages</div>
          </div>

          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: P.inkMuted, letterSpacing: '0.18em', marginBottom: 10 }}>PROVENANCE</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '6px 10px', fontSize: 12 }}>
            {[['Source', 'Hellenic Bank'], ['Obtained', '2025-09-01'], ['Method', 'Court order'], ['Hash', 'SHA-256: a4f8…'], ['Custodian', 'C. Madsen']].map(([k, v]) => (
              <div key={k} style={{ display: 'contents' }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: P.inkMuted, letterSpacing: '0.1em', paddingTop: 2 }}>{k.toUpperCase()}</div>
                <div style={{ color: P.inkSoft, borderBottom: `1px dotted ${P.ruleSoft}`, paddingBottom: 4 }}>{v}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Centre — document viewer */}
        <div style={{ overflow: 'auto', padding: '32px 40px', background: P.paper }}>
          <div style={{ maxWidth: 640, margin: '0 auto' }}>
            {/* Mock document header */}
            <div style={{ padding: '18px 24px', background: P.paperRaised, border: `1px solid ${P.rule}`, borderRadius: 3, marginBottom: 20, boxShadow: P.shadow }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: P.inkMuted }}>
                <span>HELLENIC BANK · ACCOUNT STATEMENT</span>
                <span>PAGE 2 OF 14</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 24px', fontSize: 13 }}>
                {[['Account', 'GH Holdings LLC'], ['IBAN', 'CY•• •••• •••• 4419'], ['Period', '01 Aug – 31 Aug 2025'], ['Currency', 'EUR']].map(([k, v]) => (
                  <div key={k}>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: P.inkMuted, marginBottom: 2 }}>{k}</div>
                    <div style={{ color: P.ink }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Transaction table */}
            <div style={{ border: `1px solid ${P.rule}`, borderRadius: 3, overflow: 'hidden', boxShadow: P.shadow }}>
              <div style={{ display: 'grid', gridTemplateColumns: '90px 1fr 100px 100px', background: P.paperSunk, padding: '8px 14px', fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: P.inkMuted, letterSpacing: '0.1em', borderBottom: `1px solid ${P.rule}` }}>
                {['DATE', 'DESCRIPTION', 'DEBIT', 'CREDIT'].map(h => <span key={h}>{h}</span>)}
              </div>
              {[
                { date: '2025-08-03', desc: 'Monthly service charge', debit: '120.00', credit: '' },
                { date: '2025-08-12', desc: 'Wire transfer — BAC Int\'l Panama [REDACTED]', debit: '150,000.00', credit: '', highlight: true },
                { date: '2025-08-18', desc: 'Incoming: consulting fee ref G-441', debit: '', credit: '8,400.00' },
                { date: '2025-08-29', desc: 'Wire transfer — legal retainer KA Law', debit: '3,200.00', credit: '' },
              ].map((row, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '90px 1fr 100px 100px', padding: '10px 14px', background: row.highlight ? P.stampSoft : 'transparent', borderBottom: `1px solid ${P.ruleSoft}`, fontSize: 13, alignItems: 'baseline', position: 'relative' }}>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: P.inkMuted }}>{row.date.slice(5)}</span>
                  <span style={{ color: row.highlight ? P.ink : P.inkSoft, fontWeight: row.highlight ? 600 : 400 }}>{row.desc}</span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: row.highlight ? P.disputed : P.inkSoft, textAlign: 'right' }}>{row.debit}</span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: P.asserted, textAlign: 'right' }}>{row.credit}</span>
                  {row.highlight && <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, background: P.stamp }} />}
                </div>
              ))}
            </div>

            <div style={{ marginTop: 16, display: 'flex', gap: 8, alignItems: 'center' }}>
              <div style={{ width: 18, height: 18, borderRadius: 2, background: P.stamp, display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                <svg viewBox="0 0 12 12" width="10" height="10" fill="none" stroke="white" strokeWidth="1.5"><path d="M2 6l3 3 5-5"/></svg>
              </div>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: P.stamp, letterSpacing: '0.12em' }}>PIN 1 · Wire €150,000 · evidences §w1 and §w2</span>
            </div>
          </div>
        </div>

        {/* Right — metadata + facts */}
        <div style={{ borderLeft: `1px solid ${P.rule}`, overflow: 'auto', padding: '18px 18px', background: P.paperRaised }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: P.inkMuted, letterSpacing: '0.18em', marginBottom: 8 }}>SOURCE DETAIL</div>
          <div style={{ fontSize: 20, fontStyle: 'italic', fontWeight: 600, marginBottom: 4 }}>Bank stmt 08-2025</div>
          <div style={{ fontSize: 13, color: P.inkSoft, marginBottom: 18 }}>Hellenic Bank · PDF · 14 pages</div>
          <Stamp status="verified" rotate={-2} P={P} />

          <div style={{ marginTop: 22, fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: P.inkMuted, letterSpacing: '0.18em', marginBottom: 8 }}>FACTS CITING THIS SOURCE</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {C.getAssertions('gh').map(a => (
              <div key={a.id} style={{ padding: '10px 12px', background: P.paper, border: `1px solid ${P.ruleSoft}`, borderRadius: 3, boxShadow: P.shadow }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: P.stamp, marginBottom: 4 }}>§{a.id.toUpperCase()}</div>
                <div style={{ fontSize: 13, fontStyle: 'italic', color: P.ink, lineHeight: 1.4 }}>{a.text}</div>
                <div style={{ marginTop: 6, display: 'flex', gap: 6 }}>
                  <Stamp status={a.status} rotate={0} P={P} />
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: P.inkMuted }}>conf. {Math.round(a.confidence * 100)}%</span>
                </div>
              </div>
            ))}
            {C.getAssertions('wire').map(a => (
              <div key={a.id} style={{ padding: '10px 12px', background: P.paper, border: `1px solid ${P.ruleSoft}`, borderRadius: 3, boxShadow: P.shadow }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: P.stamp, marginBottom: 4 }}>§{a.id.toUpperCase()}</div>
                <div style={{ fontSize: 13, fontStyle: 'italic', color: P.ink, lineHeight: 1.4 }}>{a.text}</div>
                <div style={{ marginTop: 6, display: 'flex', gap: 6 }}>
                  <Stamp status={a.status} rotate={0} P={P} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
