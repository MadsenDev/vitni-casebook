import fs from 'fs'
import path from 'path'
import type { DatabaseProvider } from './database'

export function ensureMigrations(provider: DatabaseProvider) {
  const db = provider.instance

  db.exec(`
    CREATE TABLE IF NOT EXISTS _migration (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      applied_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
    )
  `)

  const migrationsDir = app_migrationsDir()
  const files = fs
    .readdirSync(migrationsDir)
    .filter(f => f.endsWith('.sql'))
    .sort()

  const applied = new Set(
    (db.prepare('SELECT name FROM _migration').all() as { name: string }[]).map(r => r.name)
  )

  for (const file of files) {
    if (applied.has(file)) continue
    const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8')
    db.exec(sql)
    db.prepare('INSERT INTO _migration (name) VALUES (?)').run(file)
  }
}

function app_migrationsDir(): string {
  if (process.env.NODE_ENV === 'development') {
    return path.join(__dirname, '../../../../../db/migrations')
  }
  // In production, electron-builder includes db/migrations in resources
  const { app } = require('electron')
  return path.join(path.dirname(app.getAppPath()), 'db', 'migrations')
}
