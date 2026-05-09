import BetterSqlite3 from 'better-sqlite3'
import type { Database } from 'better-sqlite3'

export class DatabaseProvider {
  private db: Database

  constructor(dbPath: string) {
    this.db = new BetterSqlite3(dbPath)
    this.db.pragma('journal_mode = WAL')
    this.db.pragma('foreign_keys = ON')
  }

  get instance(): Database {
    return this.db
  }

  close() {
    if (this.db.open) {
      this.db.close()
    }
  }
}
