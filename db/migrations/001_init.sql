CREATE TABLE IF NOT EXISTS case_file (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  summary TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE TABLE IF NOT EXISTS node (
  id TEXT PRIMARY KEY,
  case_id TEXT NOT NULL REFERENCES case_file(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  label TEXT NOT NULL,
  sub TEXT NOT NULL DEFAULT '',
  x REAL NOT NULL DEFAULT 0,
  y REAL NOT NULL DEFAULT 0,
  ring TEXT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE INDEX IF NOT EXISTS idx_node_case ON node(case_id);

CREATE TABLE IF NOT EXISTS edge (
  id TEXT PRIMARY KEY,
  case_id TEXT NOT NULL REFERENCES case_file(id) ON DELETE CASCADE,
  a_id TEXT NOT NULL REFERENCES node(id) ON DELETE CASCADE,
  b_id TEXT NOT NULL REFERENCES node(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'asserted',
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE INDEX IF NOT EXISTS idx_edge_case ON edge(case_id);

CREATE TABLE IF NOT EXISTS assertion (
  id TEXT PRIMARY KEY,
  node_id TEXT NOT NULL REFERENCES node(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'review',
  confidence REAL NOT NULL DEFAULT 0.5,
  by_user TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE INDEX IF NOT EXISTS idx_assertion_node ON assertion(node_id);

CREATE TABLE IF NOT EXISTS source (
  id TEXT PRIMARY KEY,
  case_id TEXT NOT NULL REFERENCES case_file(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE INDEX IF NOT EXISTS idx_source_case ON source(case_id);

CREATE TABLE IF NOT EXISTS assertion_source (
  assertion_id TEXT NOT NULL REFERENCES assertion(id) ON DELETE CASCADE,
  source_name TEXT NOT NULL,
  PRIMARY KEY (assertion_id, source_name)
);

CREATE TABLE IF NOT EXISTS saved_view (
  id TEXT PRIMARY KEY,
  case_id TEXT NOT NULL REFERENCES case_file(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  filter_json TEXT NOT NULL DEFAULT '{}'
);

CREATE INDEX IF NOT EXISTS idx_view_case ON saved_view(case_id);

CREATE TABLE IF NOT EXISTS audit_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  case_id TEXT,
  action TEXT NOT NULL,
  subject_kind TEXT,
  subject_id TEXT,
  detail TEXT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE TABLE IF NOT EXISTS app_setting (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);
