import { ipcMain } from 'electron'
import { randomUUID } from 'crypto'
import type { DatabaseProvider } from '../persistence/database'
import type {
  CaseRecord,
  NodeRecord,
  EdgeRecord,
  AssertionRecord,
  GraphPayload,
  SavedViewRecord,
  CreateCaseInput,
  CreateNodeInput,
  UpdateNodeInput,
  CreateEdgeInput,
  UpdateEdgeInput,
  CreateAssertionInput,
  UpdateAssertionInput,
} from '../../../shared/types'

let _db: DatabaseProvider | null = null

export function setDb(db: DatabaseProvider | null) {
  _db = db
}

function db(): DatabaseProvider {
  if (!_db) throw new Error('No database open')
  return _db
}

// ─── helpers

function parseAssertionRow(row: Record<string, unknown>): AssertionRecord {
  const sources = row.sources
    ? (row.sources as string).split('\x1f').filter(Boolean)
    : []
  return {
    id: row.id as string,
    nodeId: row.node_id as string,
    text: row.text as string,
    status: row.status as AssertionRecord['status'],
    confidence: row.confidence as number,
    byUser: row.by_user as string,
    sources,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  }
}

function parseNodeRow(row: Record<string, unknown>): NodeRecord {
  return {
    id: row.id as string,
    caseId: row.case_id as string,
    type: row.type as NodeRecord['type'],
    label: row.label as string,
    sub: row.sub as string,
    x: row.x as number,
    y: row.y as number,
    ring: row.ring as string | null,
    props: JSON.parse((row.props as string | null) ?? '{}'),
    createdAt: row.created_at as string,
  }
}

function parseEdgeRow(row: Record<string, unknown>): EdgeRecord {
  return {
    id: row.id as string,
    caseId: row.case_id as string,
    aId: row.a_id as string,
    bId: row.b_id as string,
    label: row.label as string,
    status: row.status as EdgeRecord['status'],
    occurredAt: (row.occurred_at as string | null) ?? null,
    createdAt: row.created_at as string,
  }
}

function parseCaseRow(row: Record<string, unknown>): CaseRecord {
  return {
    id: row.id as string,
    title: row.title as string,
    summary: row.summary as string,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  }
}

// ─── registration

export function registerIpcHandlers(win: Electron.BrowserWindow) {
  // Window controls
  ipcMain.handle('window:minimize', () => win.minimize())
  ipcMain.handle('window:maximize', () => {
    if (win.isMaximized()) win.unmaximize()
    else win.maximize()
  })
  ipcMain.handle('window:close', () => win.close())
  ipcMain.handle('window:isMaximized', () => win.isMaximized())

  // ─── Cases

  ipcMain.handle('case:list', (): CaseRecord[] => {
    const rows = db().instance
      .prepare('SELECT * FROM case_file ORDER BY updated_at DESC')
      .all() as Record<string, unknown>[]
    return rows.map(parseCaseRow)
  })

  ipcMain.handle('case:create', (_e, input: CreateCaseInput): CaseRecord => {
    const id = randomUUID()
    db().instance
      .prepare(
        'INSERT INTO case_file (id, title, summary) VALUES (?, ?, ?)'
      )
      .run(id, input.title, input.summary ?? '')
    const row = db().instance
      .prepare('SELECT * FROM case_file WHERE id = ?')
      .get(id) as Record<string, unknown>
    return parseCaseRow(row)
  })

  ipcMain.handle('case:get', (_e, id: string): CaseRecord | null => {
    const row = db().instance
      .prepare('SELECT * FROM case_file WHERE id = ?')
      .get(id) as Record<string, unknown> | undefined
    return row ? parseCaseRow(row) : null
  })

  ipcMain.handle(
    'case:update',
    (_e, id: string, patch: { title?: string; summary?: string }): void => {
      const sets: string[] = []
      const vals: unknown[] = []
      if (patch.title !== undefined) { sets.push('title = ?'); vals.push(patch.title) }
      if (patch.summary !== undefined) { sets.push('summary = ?'); vals.push(patch.summary) }
      if (!sets.length) return
      sets.push("updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')")
      vals.push(id)
      db().instance.prepare(`UPDATE case_file SET ${sets.join(', ')} WHERE id = ?`).run(...vals)
    }
  )

  ipcMain.handle('case:delete', (_e, id: string): void => {
    db().instance.prepare('DELETE FROM case_file WHERE id = ?').run(id)
  })

  // ─── Graph

  ipcMain.handle('graph:load', (_e, caseId: string): GraphPayload => {
    const nodes = (
      db().instance
        .prepare('SELECT * FROM node WHERE case_id = ? ORDER BY created_at')
        .all(caseId) as Record<string, unknown>[]
    ).map(parseNodeRow)

    const edges = (
      db().instance
        .prepare('SELECT * FROM edge WHERE case_id = ? ORDER BY created_at')
        .all(caseId) as Record<string, unknown>[]
    ).map(parseEdgeRow)

    return { nodes, edges }
  })

  // ─── Nodes

  ipcMain.handle('node:create', (_e, input: CreateNodeInput): NodeRecord => {
    const id = randomUUID()
    db().instance
      .prepare(
        'INSERT INTO node (id, case_id, type, label, sub, x, y, ring, props) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
      )
      .run(
        id,
        input.caseId,
        input.type,
        input.label,
        input.sub ?? '',
        input.x ?? 0,
        input.y ?? 0,
        input.ring ?? null,
        JSON.stringify(input.props ?? {})
      )
    const row = db().instance
      .prepare('SELECT * FROM node WHERE id = ?')
      .get(id) as Record<string, unknown>
    return parseNodeRow(row)
  })

  ipcMain.handle('node:update', (_e, input: UpdateNodeInput): void => {
    const sets: string[] = []
    const vals: unknown[] = []
    if (input.label !== undefined) { sets.push('label = ?'); vals.push(input.label) }
    if (input.sub !== undefined) { sets.push('sub = ?'); vals.push(input.sub) }
    if (input.x !== undefined) { sets.push('x = ?'); vals.push(input.x) }
    if (input.y !== undefined) { sets.push('y = ?'); vals.push(input.y) }
    if (input.ring !== undefined) { sets.push('ring = ?'); vals.push(input.ring) }
    if (input.props !== undefined) { sets.push('props = ?'); vals.push(JSON.stringify(input.props)) }
    if (!sets.length) return
    vals.push(input.id)
    db().instance.prepare(`UPDATE node SET ${sets.join(', ')} WHERE id = ?`).run(...vals)
  })

  ipcMain.handle('node:delete', (_e, id: string): void => {
    db().instance.prepare('DELETE FROM node WHERE id = ?').run(id)
  })

  // ─── Edges

  ipcMain.handle('edge:create', (_e, input: CreateEdgeInput): EdgeRecord => {
    const id = randomUUID()
    db().instance
      .prepare(
        'INSERT INTO edge (id, case_id, a_id, b_id, label, status, occurred_at) VALUES (?, ?, ?, ?, ?, ?, ?)'
      )
      .run(id, input.caseId, input.aId, input.bId, input.label, input.status ?? 'asserted', input.occurredAt ?? null)
    const row = db().instance
      .prepare('SELECT * FROM edge WHERE id = ?')
      .get(id) as Record<string, unknown>
    return parseEdgeRow(row)
  })

  ipcMain.handle('edge:update', (_e, input: UpdateEdgeInput): void => {
    const sets: string[] = []
    const vals: unknown[] = []
    if (input.label !== undefined) { sets.push('label = ?'); vals.push(input.label) }
    if (input.status !== undefined) { sets.push('status = ?'); vals.push(input.status) }
    if (input.occurredAt !== undefined) { sets.push('occurred_at = ?'); vals.push(input.occurredAt) }
    if (!sets.length) return
    vals.push(input.id)
    db().instance.prepare(`UPDATE edge SET ${sets.join(', ')} WHERE id = ?`).run(...vals)
  })

  ipcMain.handle('edge:delete', (_e, id: string): void => {
    db().instance.prepare('DELETE FROM edge WHERE id = ?').run(id)
  })

  // ─── Assertions

  ipcMain.handle('assertion:list', (_e, nodeId: string): AssertionRecord[] => {
    const rows = db().instance
      .prepare(`
        SELECT a.*,
          (SELECT GROUP_CONCAT(source_name, char(31)) FROM assertion_source WHERE assertion_id = a.id) AS sources
        FROM assertion a
        WHERE a.node_id = ?
        ORDER BY a.created_at
      `)
      .all(nodeId) as Record<string, unknown>[]
    return rows.map(parseAssertionRow)
  })

  ipcMain.handle(
    'assertion:listForCase',
    (_e, caseId: string): AssertionRecord[] => {
      const rows = db().instance
        .prepare(`
          SELECT a.*,
            (SELECT GROUP_CONCAT(source_name, char(31)) FROM assertion_source WHERE assertion_id = a.id) AS sources
          FROM assertion a
          JOIN node n ON a.node_id = n.id
          WHERE n.case_id = ?
          ORDER BY a.updated_at DESC
        `)
        .all(caseId) as Record<string, unknown>[]
      return rows.map(parseAssertionRow)
    }
  )

  ipcMain.handle(
    'assertion:create',
    (_e, input: CreateAssertionInput): AssertionRecord => {
      const id = randomUUID()
      db().instance
        .prepare(
          'INSERT INTO assertion (id, node_id, text, status, confidence, by_user) VALUES (?, ?, ?, ?, ?, ?)'
        )
        .run(
          id,
          input.nodeId,
          input.text,
          input.status ?? 'review',
          input.confidence ?? 0.5,
          input.byUser ?? ''
        )

      if (input.sources?.length) {
        const ins = db().instance.prepare(
          'INSERT OR IGNORE INTO assertion_source (assertion_id, source_name) VALUES (?, ?)'
        )
        for (const s of input.sources) ins.run(id, s)
      }

      const row = db().instance
        .prepare(`
          SELECT a.*,
            (SELECT GROUP_CONCAT(source_name, char(31)) FROM assertion_source WHERE assertion_id = a.id) AS sources
          FROM assertion a WHERE a.id = ?
        `)
        .get(id) as Record<string, unknown>
      return parseAssertionRow(row)
    }
  )

  ipcMain.handle(
    'assertion:update',
    (_e, input: UpdateAssertionInput): void => {
      const sets: string[] = []
      const vals: unknown[] = []
      if (input.text !== undefined) { sets.push('text = ?'); vals.push(input.text) }
      if (input.status !== undefined) { sets.push('status = ?'); vals.push(input.status) }
      if (input.confidence !== undefined) { sets.push('confidence = ?'); vals.push(input.confidence) }
      if (sets.length) {
        sets.push("updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')")
        vals.push(input.id)
        db().instance.prepare(`UPDATE assertion SET ${sets.join(', ')} WHERE id = ?`).run(...vals)
      }

      if (input.sources !== undefined) {
        db().instance.prepare('DELETE FROM assertion_source WHERE assertion_id = ?').run(input.id)
        const ins = db().instance.prepare(
          'INSERT OR IGNORE INTO assertion_source (assertion_id, source_name) VALUES (?, ?)'
        )
        for (const s of input.sources) ins.run(input.id, s)
      }
    }
  )

  ipcMain.handle('assertion:delete', (_e, id: string): void => {
    db().instance.prepare('DELETE FROM assertion WHERE id = ?').run(id)
  })

  // ─── Saved Views

  ipcMain.handle('view:list', (_e, caseId: string): SavedViewRecord[] => {
    return (
      db().instance
        .prepare('SELECT * FROM saved_view WHERE case_id = ? ORDER BY rowid')
        .all(caseId) as Record<string, unknown>[]
    ).map(r => ({
      id: r.id as string,
      caseId: r.case_id as string,
      label: r.label as string,
      filterJson: r.filter_json as string,
    }))
  })

  ipcMain.handle(
    'view:create',
    (_e, caseId: string, label: string, filterJson: string): SavedViewRecord => {
      const id = randomUUID()
      db().instance
        .prepare('INSERT INTO saved_view (id, case_id, label, filter_json) VALUES (?, ?, ?, ?)')
        .run(id, caseId, label, filterJson)
      return { id, caseId, label, filterJson }
    }
  )

  ipcMain.handle('view:delete', (_e, id: string): void => {
    db().instance.prepare('DELETE FROM saved_view WHERE id = ?').run(id)
  })

  // ─── Audit

  ipcMain.handle('audit:list', (_e, caseId: string) => {
    return db().instance
      .prepare('SELECT * FROM audit_log WHERE case_id = ? ORDER BY created_at DESC LIMIT 500')
      .all(caseId)
  })

  // ─── Settings

  ipcMain.handle('setting:get', (_e, key: string): string | null => {
    const row = db().instance
      .prepare('SELECT value FROM app_setting WHERE key = ?')
      .get(key) as { value: string } | undefined
    return row?.value ?? null
  })

  ipcMain.handle('setting:set', (_e, key: string, value: string): void => {
    db().instance
      .prepare('INSERT OR REPLACE INTO app_setting (key, value) VALUES (?, ?)')
      .run(key, value)
  })
}
