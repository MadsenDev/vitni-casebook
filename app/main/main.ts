import { app, BrowserWindow, shell } from 'electron'
import path from 'path'
import fs from 'fs'
import { DatabaseProvider } from './persistence/database'
import { ensureMigrations } from './persistence/migrations'
import { registerIpcHandlers, setDb } from './ipc'

const isDev = process.env.NODE_ENV === 'development'

function getDbPath(): string {
  const dataDir = path.join(app.getPath('userData'), 'vitni-casebook')
  fs.mkdirSync(dataDir, { recursive: true })
  return path.join(dataDir, 'casebook.db')
}

function createWindow(): BrowserWindow {
  const win = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 900,
    minHeight: 600,
    backgroundColor: '#0f0e0c',
    frame: false,
    titleBarStyle: 'hidden',
    webPreferences: {
      preload: path.join(__dirname, '../../../preload/app/preload/preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
  })

  registerIpcHandlers(win)

  if (isDev) {
    const devServerUrl =
      process.env.CASEBOOK_DEV_SERVER_URL ?? 'http://localhost:5173'
    win.loadURL(devServerUrl)
    win.webContents.openDevTools()
  } else {
    win.loadFile(path.join(__dirname, '../../../renderer/index.html'))
  }

  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: 'deny' }
  })

  return win
}

function initDb() {
  const dbPath = getDbPath()
  const provider = new DatabaseProvider(dbPath)
  ensureMigrations(provider)
  setDb(provider)
}

app.whenReady().then(() => {
  initDb()
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
