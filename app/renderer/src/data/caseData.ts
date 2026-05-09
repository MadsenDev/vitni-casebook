export type NodeType = 'person' | 'org' | 'account' | 'device' | 'location' | 'event' | 'evidence'
export type EdgeStatus = 'verified' | 'asserted' | 'review' | 'disputed'
export type AssertionStatus = 'verified' | 'asserted' | 'review' | 'disputed' | 'rejected'

export interface CaseNode {
  id: string
  type: NodeType
  label: string
  sub: string
  x: number
  y: number
  ring?: 'subject'
}

export interface CaseEdge {
  a: string
  b: string
  label: string
  status: EdgeStatus
}

export interface Assertion {
  id: string
  text: string
  sources: string[]
  status: AssertionStatus
  confidence: number
  by: string
  at: string
}

export interface SavedView {
  id: string
  label: string
  count: number
}

export interface CaseData {
  caseTitle: string
  caseId: string
  caseSummary: string
  nodes: CaseNode[]
  edges: CaseEdge[]
  assertions: Record<string, Assertion[]>
  savedViews: SavedView[]
  getAssertions: (id: string) => Assertion[]
  findNode: (id: string) => CaseNode | undefined
  typeMeta: Record<NodeType, { label: string; icon: string }>
}

const nodes: CaseNode[] = [
  { id: 'lena',  type: 'person',   label: 'Lena Voss',             sub: 'Subject · Berlin',         x: 360, y: 300, ring: 'subject' },
  { id: 'marko', type: 'person',   label: 'Marko Reiter',          sub: 'Director, Marina Trust',   x: 540, y: 130 },
  { id: 'anika', type: 'person',   label: 'Anika Holm',            sub: 'Witness',                  x: 130, y: 470 },
  { id: 'theo',  type: 'person',   label: 'Theo Brand',            sub: 'Associate',                x: 150, y: 130 },
  { id: 'gh',    type: 'org',      label: 'Glass Harbor Holdings', sub: 'LLC · Cyprus',             x: 470, y: 220 },
  { id: 'mt',    type: 'org',      label: 'Marina Trust S.A.',     sub: 'Trust · Panama',           x: 660, y: 220 },
  { id: 'mail',  type: 'account',  label: 'lena.voss@proton.me',   sub: 'Email account',            x: 220, y: 290 },
  { id: 'phone', type: 'account',  label: '+47 905 33 218',        sub: 'Mobile number',            x: 350, y: 470 },
  { id: 'iph',   type: 'device',   label: 'iPhone 13 · A2482',     sub: 'IMEI 35 1972…',            x: 240, y: 410 },
  { id: 'marina',type: 'location', label: 'Harborside Marina',     sub: 'Berth 14 · Kiel',          x: 600, y: 470 },
  { id: 'wire',  type: 'event',    label: 'Wire €150,000',         sub: '2025-08-12 14:31',         x: 580, y: 320 },
  { id: 'call',  type: 'event',    label: 'Call · 4m 12s',         sub: '2025-09-03 09:42',         x: 420, y: 410 },
  { id: 'pdf',   type: 'evidence', label: 'Bank stmt 08-2025',     sub: 'PDF · 14 pages',           x: 720, y: 110 },
  { id: 'cctv',  type: 'evidence', label: 'CCTV M3-09-03.mp4',     sub: '00:04:51',                 x: 750, y: 410 },
]

const edges: CaseEdge[] = [
  { a: 'lena',  b: 'gh',    label: 'beneficial owner',  status: 'disputed' },
  { a: 'marko', b: 'mt',    label: 'director',          status: 'asserted' },
  { a: 'gh',    b: 'mt',    label: 'paid',              status: 'asserted' },
  { a: 'wire',  b: 'gh',    label: 'from',              status: 'verified' },
  { a: 'wire',  b: 'mt',    label: 'to',                status: 'verified' },
  { a: 'wire',  b: 'pdf',   label: 'evidenced by',      status: 'verified' },
  { a: 'lena',  b: 'mail',  label: 'uses',              status: 'asserted' },
  { a: 'lena',  b: 'iph',   label: 'owns',              status: 'asserted' },
  { a: 'lena',  b: 'phone', label: 'uses',              status: 'verified' },
  { a: 'iph',   b: 'phone', label: 'sim',               status: 'asserted' },
  { a: 'iph',   b: 'marina',label: 'located at 09-03',  status: 'verified' },
  { a: 'anika', b: 'marina',label: 'visited 09-03',     status: 'asserted' },
  { a: 'marko', b: 'marina',label: 'visited 09-03',     status: 'review' },
  { a: 'cctv',  b: 'marina',label: 'recorded at',       status: 'verified' },
  { a: 'cctv',  b: 'anika', label: 'depicts',           status: 'verified' },
  { a: 'call',  b: 'lena',  label: 'party',             status: 'verified' },
  { a: 'call',  b: 'marko', label: 'party',             status: 'verified' },
  { a: 'theo',  b: 'lena',  label: 'associate',         status: 'review' },
]

const assertions: Record<string, Assertion[]> = {
  lena: [
    { id: 'a1', text: 'Beneficial owner of Glass Harbor Holdings LLC.',
      sources: ['Cyprus registry filing 2024-03', 'Whistle-blower memo 2025-04'],
      status: 'disputed', confidence: 0.55, by: 'C. Madsen', at: '2 days ago' },
    { id: 'a2', text: 'Resident at Schöneberg, Berlin since Q2 2021.',
      sources: ['Anmeldung scan 2021-06'], status: 'asserted', confidence: 0.80, by: 'C. Madsen', at: '5 days ago' },
    { id: 'a3', text: 'Used +47 905 33 218 on 2025-09-03 at 09:42 CEST.',
      sources: ['CDR Telenor', 'CCTV M3 timestamp', 'Witness · Anika Holm'], status: 'verified', confidence: 0.95, by: 'C. Madsen', at: '1 day ago' },
    { id: 'a4', text: 'Met Marko Reiter at Harborside Marina, 2025-09-03.',
      sources: ['CCTV M3-09-03.mp4'], status: 'review', confidence: 0.40, by: 'C. Madsen', at: '4 hours ago' },
    { id: 'a5', text: 'Holds Norwegian and German citizenship.',
      sources: ['Pass-photo · DE', 'Pass-photo · NO'], status: 'asserted', confidence: 0.90, by: 'C. Madsen', at: '1 week ago' },
  ],
  marko: [
    { id: 'b1', text: 'Director of Marina Trust S.A. since 2023-11.',
      sources: ['Panama registry'], status: 'asserted', confidence: 0.85, by: 'C. Madsen', at: '3 days ago' },
    { id: 'b2', text: 'Visited Harborside Marina, 2025-09-03 morning.',
      sources: ['CCTV M3-09-03.mp4'], status: 'review', confidence: 0.50, by: 'C. Madsen', at: '4 hours ago' },
  ],
  gh: [
    { id: 'c1', text: 'Registered in Limassol, Cyprus, 2022-07-14.',
      sources: ['Cyprus registry filing 2022-07'], status: 'verified', confidence: 0.98, by: 'C. Madsen', at: '1 week ago' },
    { id: 'c2', text: 'Wired €150,000 to Marina Trust S.A. 2025-08-12.',
      sources: ['Bank stmt 08-2025', 'SWIFT MT103'], status: 'verified', confidence: 0.97, by: 'C. Madsen', at: '2 days ago' },
  ],
  wire: [
    { id: 'w1', text: 'Originated from Glass Harbor account at Hellenic Bank.',
      sources: ['SWIFT MT103', 'Bank stmt 08-2025'], status: 'verified', confidence: 0.98, by: 'C. Madsen', at: '2 days ago' },
    { id: 'w2', text: 'Received by Marina Trust at BAC International, Panama.',
      sources: ['SWIFT MT103'], status: 'verified', confidence: 0.95, by: 'C. Madsen', at: '2 days ago' },
  ],
}

const typeMeta: Record<NodeType, { label: string; icon: string }> = {
  person:   { label: 'Person',   icon: '◐' },
  org:      { label: 'Org',      icon: '▢' },
  account:  { label: 'Account',  icon: '@' },
  device:   { label: 'Device',   icon: '⌬' },
  location: { label: 'Location', icon: '◇' },
  event:    { label: 'Event',    icon: '◬' },
  evidence: { label: 'Evidence', icon: '✦' },
}

const findNode = (id: string) => nodes.find(n => n.id === id)
const getAssertions = (id: string): Assertion[] =>
  assertions[id] ?? [{ id: 'x1', text: `${findNode(id)?.label ?? 'Unknown'} appears in the case file.`,
    sources: ['Case import'], status: 'review', confidence: 0.30, by: 'C. Madsen', at: 'just now' }]

export const caseData: CaseData = {
  caseTitle: 'Operation Glass Harbor',
  caseId: 'C-2025-0142',
  caseSummary: 'Suspected layered transfer of €150k via shell entities; subject Lena Voss disputes beneficial ownership of Glass Harbor Holdings.',
  nodes,
  edges,
  assertions,
  savedViews: [
    { id: 'overview',  label: 'Case overview',      count: 14 },
    { id: 'transfers', label: 'Money trail',         count:  6 },
    { id: 'physical',  label: 'Physical movements',  count:  7 },
    { id: 'comms',     label: 'Communications',      count:  5 },
    { id: 'disputed',  label: 'Disputed only',       count:  3 },
  ],
  getAssertions,
  findNode,
  typeMeta,
}
