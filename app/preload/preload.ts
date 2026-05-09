import { contextBridge, ipcRenderer } from 'electron'
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
} from '../../shared/types'

const bridge = {
  // Window
  windowMinimize: () => ipcRenderer.invoke('window:minimize'),
  windowMaximize: () => ipcRenderer.invoke('window:maximize'),
  windowClose: () => ipcRenderer.invoke('window:close'),
  windowIsMaximized: (): Promise<boolean> => ipcRenderer.invoke('window:isMaximized'),

  // Cases
  listCases: (): Promise<CaseRecord[]> => ipcRenderer.invoke('case:list'),
  createCase: (input: CreateCaseInput): Promise<CaseRecord> => ipcRenderer.invoke('case:create', input),
  getCase: (id: string): Promise<CaseRecord | null> => ipcRenderer.invoke('case:get', id),
  updateCase: (id: string, patch: { title?: string; summary?: string }): Promise<void> =>
    ipcRenderer.invoke('case:update', id, patch),
  deleteCase: (id: string): Promise<void> => ipcRenderer.invoke('case:delete', id),

  // Graph
  loadGraph: (caseId: string): Promise<GraphPayload> => ipcRenderer.invoke('graph:load', caseId),

  // Nodes
  createNode: (input: CreateNodeInput): Promise<NodeRecord> => ipcRenderer.invoke('node:create', input),
  updateNode: (input: UpdateNodeInput): Promise<void> => ipcRenderer.invoke('node:update', input),
  deleteNode: (id: string): Promise<void> => ipcRenderer.invoke('node:delete', id),

  // Edges
  createEdge: (input: CreateEdgeInput): Promise<EdgeRecord> => ipcRenderer.invoke('edge:create', input),
  updateEdge: (input: UpdateEdgeInput): Promise<void> => ipcRenderer.invoke('edge:update', input),
  deleteEdge: (id: string): Promise<void> => ipcRenderer.invoke('edge:delete', id),

  // Assertions
  listAssertions: (nodeId: string): Promise<AssertionRecord[]> => ipcRenderer.invoke('assertion:list', nodeId),
  listAssertionsForCase: (caseId: string): Promise<AssertionRecord[]> =>
    ipcRenderer.invoke('assertion:listForCase', caseId),
  createAssertion: (input: CreateAssertionInput): Promise<AssertionRecord> =>
    ipcRenderer.invoke('assertion:create', input),
  updateAssertion: (input: UpdateAssertionInput): Promise<void> =>
    ipcRenderer.invoke('assertion:update', input),
  deleteAssertion: (id: string): Promise<void> => ipcRenderer.invoke('assertion:delete', id),

  // Saved Views
  listViews: (caseId: string): Promise<SavedViewRecord[]> => ipcRenderer.invoke('view:list', caseId),
  createView: (caseId: string, label: string, filterJson: string): Promise<SavedViewRecord> =>
    ipcRenderer.invoke('view:create', caseId, label, filterJson),
  deleteView: (id: string): Promise<void> => ipcRenderer.invoke('view:delete', id),

  // Audit
  listAudit: (caseId: string): Promise<unknown[]> => ipcRenderer.invoke('audit:list', caseId),

  // Settings
  getSetting: (key: string): Promise<string | null> => ipcRenderer.invoke('setting:get', key),
  setSetting: (key: string, value: string): Promise<void> => ipcRenderer.invoke('setting:set', key, value),
}

contextBridge.exposeInMainWorld('bridge', bridge)

export type Bridge = typeof bridge
