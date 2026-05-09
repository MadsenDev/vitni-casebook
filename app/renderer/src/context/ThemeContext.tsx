import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'
import type { Mode } from '../design/palette'
import { palettes } from '../design/palette'
import type { Palette } from '../design/palette'

interface ThemeCtx {
  mode: Mode
  P: Palette
  toggleMode: () => void
}

const Ctx = createContext<ThemeCtx | null>(null)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<Mode>('light')
  const toggleMode = () => setMode(m => m === 'light' ? 'dark' : 'light')
  return (
    <Ctx.Provider value={{ mode, P: palettes[mode], toggleMode }}>
      {children}
    </Ctx.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useTheme outside ThemeProvider')
  return ctx
}
