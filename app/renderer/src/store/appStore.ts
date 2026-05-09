import { create } from 'zustand'
import { bridge } from '../services/bridge'
import type {
  CaseRecord,
  NodeRecord,
  EdgeRecord,
  AssertionRecord,
  SavedViewRecord,
  NodeType,
  EdgeStatus,
  AssertionStatus,
  UpdateNodeInput,
  UpdateEdgeInput,
} from '../../../../shared/types'

interface AppState {
  // App lifecycle
  ready: boolean

  // Case list (home screen)
  cases: CaseRecord[]

  // Active case
  activeCaseId: string | null
  activeCase: CaseRecord | null

  // Graph
  nodes: NodeRecord[]
  edges: EdgeRecord[]

  // Assertions keyed by nodeId
  assertions: Record<string, AssertionRecord[]>

  // Saved views
  views: SavedViewRecord[]

  // UI
  selectedNodeId: string | null
  selectedEdgeId: string | null

  // Actions
  init: () => Promise<void>
  loadCases: () => Promise<void>
  openCase: (id: string) => Promise<void>
  closeCase: () => void
  createCase: (title: string, summary?: string) => Promise<CaseRecord>
  deleteCase: (id: string) => Promise<void>

  loadGraph: (caseId: string) => Promise<void>
  loadAssertions: (nodeId: string) => Promise<void>

  selectNode: (id: string | null) => void
  selectEdge: (id: string | null) => void

  createNode: (
    type: NodeType,
    label: string,
    sub?: string,
    x?: number,
    y?: number
  ) => Promise<NodeRecord>
  updateNodePosition: (id: string, x: number, y: number) => Promise<void>
  updateNode: (input: UpdateNodeInput) => Promise<void>
  deleteNode: (id: string) => Promise<void>

  createEdge: (
    aId: string,
    bId: string,
    label: string,
    status?: EdgeStatus,
    occurredAt?: string | null
  ) => Promise<EdgeRecord>
  updateEdge: (input: UpdateEdgeInput) => Promise<void>
  deleteEdge: (id: string) => Promise<void>

  createAssertion: (
    nodeId: string,
    text: string,
    status?: AssertionStatus,
    confidence?: number,
    sources?: string[]
  ) => Promise<AssertionRecord>
  updateAssertion: (
    id: string,
    patch: { text?: string; status?: AssertionStatus; confidence?: number; sources?: string[] }
  ) => Promise<void>
  deleteAssertion: (id: string) => Promise<void>

  loadViews: (caseId: string) => Promise<void>
  createView: (label: string, filterJson: string) => Promise<SavedViewRecord>
  deleteView: (id: string) => Promise<void>
}

export const useAppStore = create<AppState>((set, get) => ({
  ready: false,
  cases: [],
  activeCaseId: null,
  activeCase: null,
  nodes: [],
  edges: [],
  assertions: {},
  views: [],
  selectedNodeId: null,
  selectedEdgeId: null,

  init: async () => {
    await get().loadCases()
    set({ ready: true })
  },

  loadCases: async () => {
    const cases = await bridge.listCases()
    set({ cases })
  },

  openCase: async (id: string) => {
    const caseRecord = await bridge.getCase(id)
    if (!caseRecord) return
    set({ activeCaseId: id, activeCase: caseRecord, selectedNodeId: null, assertions: {}, views: [] })
    await Promise.all([get().loadGraph(id), get().loadViews(id)])
  },

  closeCase: () => {
    set({ activeCaseId: null, activeCase: null, nodes: [], edges: [], assertions: {}, views: [], selectedNodeId: null })
  },

  createCase: async (title: string, summary?: string) => {
    const newCase = await bridge.createCase({ title, summary })
    await get().loadCases()
    return newCase
  },

  deleteCase: async (id: string) => {
    await bridge.deleteCase(id)
    await get().loadCases()
    if (get().activeCaseId === id) get().closeCase()
  },

  loadGraph: async (caseId: string) => {
    const { nodes, edges } = await bridge.loadGraph(caseId)
    set({ nodes, edges })
  },

  loadAssertions: async (nodeId: string) => {
    const list = await bridge.listAssertions(nodeId)
    set(s => ({ assertions: { ...s.assertions, [nodeId]: list } }))
  },

  selectNode: (id: string | null) => {
    set({ selectedNodeId: id, selectedEdgeId: null })
    if (id) get().loadAssertions(id)
  },

  selectEdge: (id: string | null) => {
    set({ selectedEdgeId: id, selectedNodeId: null })
  },

  createNode: async (type, label, sub = '', x = 200, y = 200) => {
    const caseId = get().activeCaseId
    if (!caseId) throw new Error('No active case')
    const node = await bridge.createNode({ caseId, type, label, sub, x, y })
    set(s => ({ nodes: [...s.nodes, node] }))
    return node
  },

  updateNodePosition: async (id: string, x: number, y: number) => {
    await bridge.updateNode({ id, x, y })
    set(s => ({
      nodes: s.nodes.map(n => (n.id === id ? { ...n, x, y } : n)),
    }))
  },

  updateNode: async (input: UpdateNodeInput) => {
    await bridge.updateNode(input)
    set(s => ({
      nodes: s.nodes.map(n => (n.id === input.id ? { ...n, ...input } : n)),
    }))
  },

  deleteNode: async (id: string) => {
    await bridge.deleteNode(id)
    set(s => ({
      nodes: s.nodes.filter(n => n.id !== id),
      edges: s.edges.filter(e => e.aId !== id && e.bId !== id),
      selectedNodeId: s.selectedNodeId === id ? null : s.selectedNodeId,
    }))
  },

  createEdge: async (aId, bId, label, status = 'asserted', occurredAt = null) => {
    const caseId = get().activeCaseId
    if (!caseId) throw new Error('No active case')
    const edge = await bridge.createEdge({ caseId, aId, bId, label, status, occurredAt })
    set(s => ({ edges: [...s.edges, edge] }))
    return edge
  },

  updateEdge: async (input: UpdateEdgeInput) => {
    await bridge.updateEdge(input)
    set(s => ({
      edges: s.edges.map(e => e.id === input.id ? { ...e, ...input } : e),
    }))
  },

  deleteEdge: async (id: string) => {
    await bridge.deleteEdge(id)
    set(s => ({
      edges: s.edges.filter(e => e.id !== id),
      selectedEdgeId: s.selectedEdgeId === id ? null : s.selectedEdgeId,
    }))
  },

  createAssertion: async (nodeId, text, status = 'review', confidence = 0.5, sources = []) => {
    const a = await bridge.createAssertion({ nodeId, text, status, confidence, sources })
    set(s => ({
      assertions: {
        ...s.assertions,
        [nodeId]: [...(s.assertions[nodeId] ?? []), a],
      },
    }))
    return a
  },

  updateAssertion: async (id, patch) => {
    await bridge.updateAssertion({ id, ...patch })
    set(s => {
      const updated: Record<string, AssertionRecord[]> = {}
      for (const [nid, list] of Object.entries(s.assertions)) {
        updated[nid] = list.map(a =>
          a.id === id ? { ...a, ...patch, updatedAt: new Date().toISOString() } : a
        )
      }
      return { assertions: updated }
    })
  },

  deleteAssertion: async (id: string) => {
    await bridge.deleteAssertion(id)
    set(s => {
      const updated: Record<string, AssertionRecord[]> = {}
      for (const [nid, list] of Object.entries(s.assertions)) {
        updated[nid] = list.filter(a => a.id !== id)
      }
      return { assertions: updated }
    })
  },

  loadViews: async (caseId: string) => {
    const views = await bridge.listViews(caseId)
    set({ views })
  },

  createView: async (label: string, filterJson: string) => {
    const caseId = get().activeCaseId
    if (!caseId) throw new Error('No active case')
    const view = await bridge.createView(caseId, label, filterJson)
    set(s => ({ views: [...s.views, view] }))
    return view
  },

  deleteView: async (id: string) => {
    await bridge.deleteView(id)
    set(s => ({ views: s.views.filter(v => v.id !== id) }))
  },
}))
