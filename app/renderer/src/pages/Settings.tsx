import { useState } from 'react'
import { useTheme } from '../context/ThemeContext'
import { TopBar } from '../components/TopBar'
import { DossierMark } from '../components/DossierMark'


const sections = [
  { num: '§1', title: 'Profile & account' },
  { num: '§2', title: 'Cases & workspaces' },
  { num: '§3', title: 'Privacy & security' },
  { num: '§4', title: 'Local data' },
  { num: '§5', title: 'Sync & peers' },
  { num: '§6', title: 'Appearance' },
  { num: '§7', title: 'Keyboard shortcuts' },
  { num: '§8', title: 'Integrations' },
  { num: '§9', title: 'About' },
]

function Toggle({ on, P }: { on: boolean; P: ReturnType<typeof useTheme>['P'] }) {
  return (
    <div style={{ width: 36, height: 20, borderRadius: 10, background: on ? P.asserted : P.paperSunk, border: `1px solid ${on ? P.asserted : P.rule}`, position: 'relative', cursor: 'pointer', flexShrink: 0, transition: 'background 0.2s' }}>
      <div style={{ position: 'absolute', top: 2, left: on ? 16 : 2, width: 14, height: 14, borderRadius: '50%', background: on ? '#fff' : P.inkMuted, transition: 'left 0.2s' }} />
    </div>
  )
}

function ProfileSection({ P }: { P: ReturnType<typeof useTheme>['P'] }) {
  return (
    <div>
      <h2 style={{ margin: '0 0 20px', fontSize: 26, fontStyle: 'italic', fontWeight: 600, letterSpacing: '-0.01em' }}>Profile & account</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '14px 22px', alignItems: 'start', marginBottom: 28 }}>
        <div style={{ width: 64, height: 64, borderRadius: '50%', background: P.ink, color: P.paper, display: 'grid', placeItems: 'center', fontFamily: "'Newsreader', serif", fontSize: 26, fontStyle: 'italic' }}>cm</div>
        <div>
          <div style={{ fontSize: 20, fontStyle: 'italic', fontWeight: 600 }}>Christian Madsen</div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: P.inkMuted, marginTop: 3 }}>cm@madsens.dev</div>
          <button style={{ marginTop: 10, padding: '6px 14px', border: `1px solid ${P.rule}`, borderRadius: 3, background: 'transparent', color: P.inkSoft, fontFamily: "'Newsreader', serif", fontStyle: 'italic', fontSize: 13, cursor: 'pointer' }}>Edit profile…</button>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {[['Display name', 'Christian Madsen'], ['Email', 'cm@madsens.dev'], ['Initials shown in app', 'cm']].map(([label, val]) => (
          <div key={label} style={{ display: 'grid', gridTemplateColumns: '180px 1fr', gap: 14, alignItems: 'center' }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: P.inkMuted, letterSpacing: '0.12em' }}>{label.toUpperCase()}</div>
            <input defaultValue={val} style={{ background: P.paperSunk, border: `1px solid ${P.rule}`, borderRadius: 3, padding: '7px 10px', fontFamily: "'Newsreader', serif", fontSize: 14, color: P.ink, outline: 'none', width: '100%', boxSizing: 'border-box' }} />
          </div>
        ))}
      </div>
      <div style={{ marginTop: 28, padding: '16px 18px', background: P.paperSunk, border: `1px solid ${P.ruleSoft}`, borderRadius: 4 }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: P.inkMuted, letterSpacing: '0.18em', marginBottom: 8 }}>LOCAL-FIRST · NO ACCOUNT REQUIRED</div>
        <div style={{ fontSize: 13, color: P.inkSoft, lineHeight: 1.5 }}>Vitni does not have a server-side account. Your identity is local. If you use sync, peers receive only your initials and a fingerprint derived from your recovery key.</div>
      </div>
    </div>
  )
}

function AppearanceSection({ P, toggleMode }: { P: ReturnType<typeof useTheme>['P']; toggleMode: () => void }) {
  return (
    <div>
      <h2 style={{ margin: '0 0 20px', fontSize: 26, fontStyle: 'italic', fontWeight: 600, letterSpacing: '-0.01em' }}>Appearance</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {[{ label: 'Theme', type: 'pick', on: false }, { label: 'Density', type: 'pick', on: false }, { label: 'Serif weight', type: 'pick', on: false }, { label: 'Show folio numbers', type: 'toggle', on: true }, { label: 'Show confidence bars', type: 'toggle', on: true }, { label: 'Animate node transitions', type: 'toggle', on: false }].map((item, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '220px 1fr', alignItems: 'center', gap: 14, paddingBottom: 14, borderBottom: `1px dotted ${P.ruleSoft}` }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: P.inkMuted, letterSpacing: '0.12em' }}>{item.label.toUpperCase()}</div>
            {item.type === 'toggle'
              ? <div onClick={toggleMode} style={{ cursor: 'pointer' }}><Toggle on={item.on} P={P} /></div>
              : <select style={{ background: P.paperSunk, border: `1px solid ${P.rule}`, borderRadius: 3, padding: '6px 10px', fontFamily: "'Newsreader', serif", fontSize: 14, color: P.ink, cursor: 'pointer' }}>
                  <option>{item.label === 'Theme' ? (P.mode === 'light' ? 'Light' : 'Dark') : item.label === 'Density' ? 'Comfortable' : 'Regular'}</option>
                  {item.label === 'Theme' && <option>{P.mode === 'light' ? 'Dark' : 'Light'}</option>}
                </select>}
          </div>
        ))}
      </div>
    </div>
  )
}

function CasesSection({ P }: { P: ReturnType<typeof useTheme>['P'] }) {
  return (
    <div>
      <h2 style={{ margin: '0 0 20px', fontSize: 26, fontStyle: 'italic', fontWeight: 600, letterSpacing: '-0.01em' }}>Cases & workspaces</h2>
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: P.inkMuted, letterSpacing: '0.18em', marginBottom: 10 }}>ACTIVE CASES</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 24 }}>
        {[{ title: 'Operation Glass Harbor', id: 'C-2025-0142', updated: '2 hours ago', active: true }, { title: 'Case: Source Registry', id: 'C-2025-0098', updated: '3 days ago', active: false }, { title: 'Tip verification — anon', id: 'C-2025-0103', updated: '1 week ago', active: false }].map(c => (
          <div key={c.id} style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: 14, alignItems: 'center', padding: '10px 14px', background: c.active ? P.stampSoft : P.paper, border: `1px solid ${c.active ? P.stamp : P.ruleSoft}`, borderRadius: 3 }}>
            <div>
              <div style={{ fontSize: 14, fontStyle: c.active ? 'italic' : 'normal', fontWeight: c.active ? 600 : 500 }}>{c.title}</div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: P.inkMuted, marginTop: 2, letterSpacing: '0.06em' }}>{c.id} · updated {c.updated}</div>
            </div>
            {c.active && <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: P.stamp, letterSpacing: '0.14em', fontWeight: 600 }}>ACTIVE</span>}
            <button style={{ padding: '5px 12px', border: `1px solid ${P.ruleSoft}`, borderRadius: 3, background: 'transparent', color: P.inkSoft, fontFamily: "'Newsreader', serif", fontStyle: 'italic', fontSize: 12, cursor: 'pointer' }}>{c.active ? 'Switch' : 'Open'}</button>
          </div>
        ))}
      </div>
      <button style={{ padding: '9px 18px', background: P.stamp, color: P.mode === 'dark' ? '#1c1812' : '#f3ebd8', border: 'none', borderRadius: 3, fontFamily: "'Newsreader', serif", fontStyle: 'italic', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>+ New case</button>
    </div>
  )
}

function PrivacySection({ P }: { P: ReturnType<typeof useTheme>['P'] }) {
  return (
    <div>
      <h2 style={{ margin: '0 0 20px', fontSize: 26, fontStyle: 'italic', fontWeight: 600, letterSpacing: '-0.01em' }}>Privacy & security</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 28 }}>
        {[{ label: 'Lock on idle (10 min)', on: true }, { label: 'Require passphrase on open', on: true }, { label: 'Show recovery key reminder', on: false }, { label: 'Allow peer sync', on: false }].map((item, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center', paddingBottom: 14, borderBottom: `1px dotted ${P.ruleSoft}` }}>
            <div style={{ fontSize: 14 }}>{item.label}</div>
            <Toggle on={item.on} P={P} />
          </div>
        ))}
      </div>
      <div style={{ padding: '14px 18px', background: P.stampSoft, border: `1px solid ${P.stamp}`, borderRadius: 4, marginBottom: 16 }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: P.stamp, letterSpacing: '0.18em', marginBottom: 6 }}>RECOVERY KEY</div>
        <div style={{ fontSize: 13, color: P.inkSoft, lineHeight: 1.5, marginBottom: 10 }}>Your 24-word recovery phrase is the only way to recover a locked case. Store it somewhere safe, offline.</div>
        <button style={{ padding: '7px 16px', border: `1px solid ${P.stamp}`, borderRadius: 3, background: 'transparent', color: P.stamp, fontFamily: "'Newsreader', serif", fontStyle: 'italic', fontSize: 13, cursor: 'pointer' }}>Reveal recovery key…</button>
      </div>
    </div>
  )
}

function ShortcutsSection({ P }: { P: ReturnType<typeof useTheme>['P'] }) {
  const shortcuts = [['⌘K', 'Open command palette'], ['⌘N', 'New case'], ['⌘O', 'Open case'], ['⌘,', 'Open settings'], ['⌘⇧L', 'Lock workspace'], ['⌘1', 'Verify fact'], ['⌘2', 'Dispute fact'], ['⌘3', 'Reject fact'], ['⌘4', 'Defer fact'], ['Esc', 'Close modal / deselect']]
  return (
    <div>
      <h2 style={{ margin: '0 0 20px', fontSize: 26, fontStyle: 'italic', fontWeight: 600, letterSpacing: '-0.01em' }}>Keyboard shortcuts</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '0', borderTop: `1px solid ${P.ruleSoft}` }}>
        {shortcuts.map(([k, v]) => (
          <div key={k} style={{ display: 'contents' }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, padding: '10px 14px', borderBottom: `1px dotted ${P.ruleSoft}`, color: P.stamp, background: P.paperSunk }}>{k}</div>
            <div style={{ fontSize: 14, padding: '10px 14px', borderBottom: `1px dotted ${P.ruleSoft}`, color: P.inkSoft }}>{v}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function AboutSection({ P }: { P: ReturnType<typeof useTheme>['P'] }) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
        <DossierMark size={48} P={P} />
        <div>
          <div style={{ fontSize: 28, fontStyle: 'italic', fontWeight: 600, letterSpacing: '-0.012em' }}>Vitni · Casebook</div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: P.inkMuted, marginTop: 4, letterSpacing: '0.06em' }}>Version 0.6.0 · Build 2025-11-04</div>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '0', borderTop: `1px solid ${P.ruleSoft}` }}>
        {[['Renderer', 'React 18 + Vite'], ['Database', 'SQLite (local)'], ['Encryption', 'AES-256-GCM'], ['License', 'MIT (source available)'], ['Source', 'github.com/MadsenDev/vitni']].map(([k, v]) => (
          <div key={k} style={{ display: 'contents' }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, padding: '10px 14px', borderBottom: `1px dotted ${P.ruleSoft}`, color: P.inkMuted, letterSpacing: '0.12em', background: P.paperSunk, textTransform: 'uppercase' }}>{k}</div>
            <div style={{ fontSize: 14, padding: '10px 14px', borderBottom: `1px dotted ${P.ruleSoft}`, color: P.inkSoft }}>{v}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function Settings({ onSearch, onAvatar }: { onSearch?: () => void; onAvatar?: () => void }) {
  const { P, toggleMode } = useTheme()
  const [activeSection, setActiveSection] = useState(0)

  const sectionContent = [
    <ProfileSection key="profile" P={P} />,
    <CasesSection key="cases" P={P} />,
    <PrivacySection key="privacy" P={P} />,
    <div key="local"><h2 style={{ margin: '0 0 20px', fontSize: 26, fontStyle: 'italic', fontWeight: 600 }}>Local data</h2><div style={{ fontSize: 14, color: P.inkSoft }}>Disk usage, cache, and import/export controls.</div></div>,
    <div key="sync"><h2 style={{ margin: '0 0 20px', fontSize: 26, fontStyle: 'italic', fontWeight: 600 }}>Sync & peers</h2><div style={{ fontSize: 14, color: P.inkSoft }}>Local network peer discovery and sync settings.</div></div>,
    <AppearanceSection key="appearance" P={P} toggleMode={toggleMode} />,
    <ShortcutsSection key="shortcuts" P={P} />,
    <div key="integrations"><h2 style={{ margin: '0 0 20px', fontSize: 26, fontStyle: 'italic', fontWeight: 600 }}>Integrations</h2><div style={{ fontSize: 14, color: P.inkSoft }}>Remote tools, AI integration, and CSV import settings.</div></div>,
    <AboutSection key="about" P={P} />,
  ]

  return (
    <div style={{ width: '100%', height: '100vh', background: P.paper, color: P.ink, fontFamily: "'Newsreader', 'Source Serif 4', Georgia, serif", display: 'grid', gridTemplateRows: '64px 1fr', overflow: 'hidden' }}>
      <div style={{ gridArea: 'auto / auto' }}><TopBar P={P} onAvatarClick={onAvatar} onSearchClick={onSearch} /></div>
      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', overflow: 'hidden' }}>
        {/* Left rail — section index */}
        <div style={{ background: P.paperSunk, borderRight: `1px solid ${P.rule}`, padding: '28px 18px', overflow: 'auto', display: 'flex', flexDirection: 'column', gap: 2 }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: P.inkMuted, letterSpacing: '0.18em', marginBottom: 10 }}>SETTINGS</div>
          {sections.map((s, i) => {
            const active = i === activeSection
            return (
              <button key={s.num} onClick={() => setActiveSection(i)} style={{ textAlign: 'left', padding: '8px 12px', borderRadius: 3, background: active ? P.stampSoft : 'transparent', borderLeft: active ? `2px solid ${P.stamp}` : '2px solid transparent', marginLeft: -2, border: 'none', cursor: 'pointer', display: 'flex', gap: 10, alignItems: 'baseline' }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: P.stamp, letterSpacing: '0.08em', flexShrink: 0 }}>{s.num}</span>
                <span style={{ fontSize: 14, fontStyle: active ? 'italic' : 'normal', color: active ? P.ink : P.inkSoft, fontWeight: active ? 600 : 400 }}>{s.title}</span>
              </button>
            )
          })}
          <div style={{ marginTop: 'auto', fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: P.inkMuted, letterSpacing: '0.16em', borderTop: `1px solid ${P.ruleSoft}`, paddingTop: 10, display: 'flex', justifyContent: 'space-between' }}>
            <span>● LOCAL</span><span>v0.6</span>
          </div>
        </div>

        {/* Main content */}
        <div style={{ overflow: 'auto', padding: '40px 60px' }}>
          {/* Page header */}
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: P.inkMuted, letterSpacing: '0.18em', marginBottom: 6 }}>
            {sections[activeSection].num} · SETTINGS
          </div>
          <div style={{ borderBottom: `1px solid ${P.rule}`, marginBottom: 32 }} />
          {sectionContent[activeSection]}
        </div>
      </div>
    </div>
  )
}
