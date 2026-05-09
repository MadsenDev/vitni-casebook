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
} from '../../../../shared/types'

export interface Bridge {
  windowMinimize(): Promise<void>
  windowMaximize(): Promise<void>
  windowClose(): Promise<void>
  windowIsMaximized(): Promise<boolean>

  listCases(): Promise<CaseRecord[]>
  createCase(input: CreateCaseInput): Promise<CaseRecord>
  getCase(id: string): Promise<CaseRecord | null>
  updateCase(id: string, patch: { title?: string; summary?: string }): Promise<void>
  deleteCase(id: string): Promise<void>

  loadGraph(caseId: string): Promise<GraphPayload>

  createNode(input: CreateNodeInput): Promise<NodeRecord>
  updateNode(input: UpdateNodeInput): Promise<void>
  deleteNode(id: string): Promise<void>

  createEdge(input: CreateEdgeInput): Promise<EdgeRecord>
  updateEdge(input: UpdateEdgeInput): Promise<void>
  deleteEdge(id: string): Promise<void>

  listAssertions(nodeId: string): Promise<AssertionRecord[]>
  listAssertionsForCase(caseId: string): Promise<AssertionRecord[]>
  createAssertion(input: CreateAssertionInput): Promise<AssertionRecord>
  updateAssertion(input: UpdateAssertionInput): Promise<void>
  deleteAssertion(id: string): Promise<void>

  listViews(caseId: string): Promise<SavedViewRecord[]>
  createView(caseId: string, label: string, filterJson: string): Promise<SavedViewRecord>
  deleteView(id: string): Promise<void>

  listAudit(caseId: string): Promise<unknown[]>

  getSetting(key: string): Promise<string | null>
  setSetting(key: string, value: string): Promise<void>
}

declare global {
  interface Window {
    bridge: Bridge
  }
}

export const bridge: Bridge = (typeof window !== 'undefined' ? window.bridge : null) as Bridge
