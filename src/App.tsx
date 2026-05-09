import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { CommandPalette } from './overlays/CommandPalette'
import { AvatarMenu } from './overlays/AvatarMenu'
import { Investigation } from './pages/Investigation'
import { Timeline } from './pages/Timeline'
import { Review } from './pages/Review'
import { Reports } from './pages/Reports'
import { Settings } from './pages/Settings'
import { Source } from './pages/Source'
import { FirstRun } from './pages/FirstRun'
import { NewCase } from './pages/NewCase'
import { Lock } from './pages/Lock'
import { Pair } from './pages/Pair'
import { Recovery } from './pages/Recovery'
import { Audit } from './pages/Audit'

export function App() {
  const [showCommand, setShowCommand] = useState(false)
  const [showAvatar, setShowAvatar] = useState(false)

  const overlayProps = {
    onSearch: () => setShowCommand(true),
    onAvatar: () => setShowAvatar(v => !v),
  }

  return (
    <>
      <Routes>
        <Route path="/" element={<FirstRun />} />
        <Route path="/investigation" element={<Investigation {...overlayProps} />} />
        <Route path="/timeline" element={<Timeline {...overlayProps} />} />
        <Route path="/review" element={<Review {...overlayProps} />} />
        <Route path="/reports" element={<Reports {...overlayProps} />} />
        <Route path="/settings" element={<Settings {...overlayProps} />} />
        <Route path="/source" element={<Source {...overlayProps} />} />
        <Route path="/audit" element={<Audit {...overlayProps} />} />
        <Route path="/new-case" element={<NewCase />} />
        <Route path="/lock" element={<Lock />} />
        <Route path="/pair" element={<Pair />} />
        <Route path="/recovery" element={<Recovery />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {showCommand && <CommandPalette onClose={() => setShowCommand(false)} />}
      {showAvatar && <AvatarMenu onClose={() => setShowAvatar(false)} />}
    </>
  )
}
