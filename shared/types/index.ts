export type NodeType = 'person' | 'org' | 'account' | 'device' | 'location' | 'event' | 'evidence'
export type EdgeStatus = 'verified' | 'asserted' | 'review' | 'disputed'
export type AssertionStatus = 'verified' | 'asserted' | 'review' | 'disputed' | 'rejected'

export interface CaseRecord {
  id: string
  title: string
  summary: string
  createdAt: string
  updatedAt: string
}

export interface NodeRecord {
  id: string
  caseId: string
  type: NodeType
  label: string
  sub: string
  x: number
  y: number
  ring?: string | null
  props: Record<string, string>
  createdAt: string
}

export interface EdgeRecord {
  id: string
  caseId: string
  aId: string
  bId: string
  label: string
  status: EdgeStatus
  occurredAt: string | null
  createdAt: string
}

export interface AssertionRecord {
  id: string
  nodeId: string
  text: string
  status: AssertionStatus
  confidence: number
  byUser: string
  sources: string[]
  createdAt: string
  updatedAt: string
}

export interface SourceRecord {
  id: string
  caseId: string
  name: string
  createdAt: string
}

export interface SavedViewRecord {
  id: string
  caseId: string
  label: string
  filterJson: string
}

export interface AuditRecord {
  id: number
  caseId: string | null
  action: string
  subjectKind: string | null
  subjectId: string | null
  detail: string | null
  createdAt: string
}

export interface GraphPayload {
  nodes: NodeRecord[]
  edges: EdgeRecord[]
}

export interface CreateNodeInput {
  caseId: string
  type: NodeType
  label: string
  sub?: string
  x?: number
  y?: number
  ring?: string | null
  props?: Record<string, string>
}

export interface UpdateNodeInput {
  id: string
  label?: string
  sub?: string
  x?: number
  y?: number
  ring?: string | null
  props?: Record<string, string>
}

export interface UpdateEdgeInput {
  id: string
  label?: string
  status?: EdgeStatus
  occurredAt?: string | null
}

export interface CreateEdgeInput {
  caseId: string
  aId: string
  bId: string
  label: string
  status?: EdgeStatus
  occurredAt?: string | null
}

export interface CreateAssertionInput {
  nodeId: string
  text: string
  status?: AssertionStatus
  confidence?: number
  byUser?: string
  sources?: string[]
}

export interface UpdateAssertionInput {
  id: string
  text?: string
  status?: AssertionStatus
  confidence?: number
  sources?: string[]
}

export interface CreateCaseInput {
  title: string
  summary?: string
}
