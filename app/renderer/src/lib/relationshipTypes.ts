import type { NodeType } from '../../../../shared/types'

export interface RelationshipSubtype {
  id: string
  label: string
}

export interface RelationshipCategory {
  id: string
  label: string
  icon: string
  subtypes: RelationshipSubtype[]
  allowedSource: NodeType[] | 'all'
  allowedTarget: NodeType[] | 'all'
  supportsDate: boolean
}

const ALL: NodeType[] = ['person', 'org', 'account', 'device', 'location', 'event', 'evidence']

export const relationshipCategories: RelationshipCategory[] = [
  {
    id: 'associated_with',
    label: 'Associated With',
    icon: '⬡',
    allowedSource: 'all',
    allowedTarget: 'all',
    supportsDate: true,
    subtypes: [
      { id: 'linked_to',        label: 'Linked To' },
      { id: 'alias_of',         label: 'Alias Of' },
      { id: 'same_as',          label: 'Same As' },
      { id: 'possible_same_as', label: 'Possible Same As' },
    ],
  },
  {
    id: 'family_personal',
    label: 'Family / Personal',
    icon: '♡',
    allowedSource: ['person'],
    allowedTarget: ['person'],
    supportsDate: true,
    subtypes: [
      { id: 'parent_of',   label: 'Parent Of' },
      { id: 'child_of',    label: 'Child Of' },
      { id: 'sibling_of',  label: 'Sibling Of' },
      { id: 'spouse_of',   label: 'Spouse Of' },
      { id: 'friend_of',   label: 'Friend Of' },
      { id: 'neighbor_of', label: 'Neighbor Of' },
    ],
  },
  {
    id: 'employment_affiliation',
    label: 'Employment / Affiliation',
    icon: '⬜',
    allowedSource: ['person'],
    allowedTarget: ['org'],
    supportsDate: true,
    subtypes: [
      { id: 'employee_of',   label: 'Employee Of' },
      { id: 'contractor_for',label: 'Contractor For' },
      { id: 'member_of',     label: 'Member Of' },
      { id: 'founder_of',    label: 'Founder Of' },
      { id: 'executive_of',  label: 'Executive Of' },
      { id: 'affiliate_of',  label: 'Affiliate Of' },
    ],
  },
  {
    id: 'ownership_control',
    label: 'Ownership / Control',
    icon: '◈',
    allowedSource: ['person', 'org'],
    allowedTarget: ['account', 'device', 'location'],
    supportsDate: true,
    subtypes: [
      { id: 'owns',         label: 'Owns' },
      { id: 'leases',       label: 'Leases' },
      { id: 'controls',     label: 'Controls' },
      { id: 'administers',  label: 'Administers' },
      { id: 'registered_to',label: 'Registered To' },
    ],
  },
  {
    id: 'located_at',
    label: 'Located At',
    icon: '◇',
    allowedSource: ['person', 'org', 'device', 'event'],
    allowedTarget: ['location'],
    supportsDate: true,
    subtypes: [
      { id: 'resides_at',       label: 'Resides At' },
      { id: 'based_at',         label: 'Based At' },
      { id: 'headquartered_at', label: 'Headquartered At' },
      { id: 'operates_at',      label: 'Operates At' },
      { id: 'observed_at',      label: 'Observed At' },
    ],
  },
  {
    id: 'communicated_with',
    label: 'Communicated With',
    icon: '◌',
    allowedSource: ['person', 'account'],
    allowedTarget: ['person', 'account'],
    supportsDate: true,
    subtypes: [
      { id: 'called',       label: 'Called' },
      { id: 'texted',       label: 'Texted' },
      { id: 'emailed',      label: 'Emailed' },
      { id: 'messaged',     label: 'Messaged' },
      { id: 'met_with',     label: 'Met With' },
      { id: 'video_called', label: 'Video Called' },
    ],
  },
  {
    id: 'participated_in',
    label: 'Participated In',
    icon: '◬',
    allowedSource: ['person', 'org'],
    allowedTarget: ['event'],
    supportsDate: true,
    subtypes: [
      { id: 'attended',     label: 'Attended' },
      { id: 'organized',    label: 'Organized' },
      { id: 'present_at',   label: 'Present At' },
      { id: 'spoke_at',     label: 'Spoke At' },
    ],
  },
  {
    id: 'used_accessed',
    label: 'Used / Accessed',
    icon: '↗',
    allowedSource: ['person', 'account'],
    allowedTarget: ['account', 'device'],
    supportsDate: true,
    subtypes: [
      { id: 'used',        label: 'Used' },
      { id: 'logged_into', label: 'Logged Into' },
      { id: 'accessed',    label: 'Accessed' },
      { id: 'operated',    label: 'Operated' },
    ],
  },
  {
    id: 'documented_by',
    label: 'Documented By',
    icon: '✦',
    allowedSource: ['person', 'org', 'event', 'account', 'device', 'location'],
    allowedTarget: ['evidence'],
    supportsDate: false,
    subtypes: [
      { id: 'mentioned_in', label: 'Mentioned In' },
      { id: 'cited_in',     label: 'Cited In' },
      { id: 'captured_in',  label: 'Captured In' },
      { id: 'authored',     label: 'Authored' },
    ],
  },
  {
    id: 'financially_linked',
    label: 'Financially Linked',
    icon: '⊛',
    allowedSource: ['person', 'org', 'account'],
    allowedTarget: ['person', 'org', 'account'],
    supportsDate: true,
    subtypes: [
      { id: 'paid',            label: 'Paid' },
      { id: 'received_from',   label: 'Received From' },
      { id: 'transferred_to',  label: 'Transferred To' },
      { id: 'funded',          label: 'Funded' },
      { id: 'purchased_from',  label: 'Purchased From' },
    ],
  },
  {
    id: 'threat_harm',
    label: 'Threat / Harm',
    icon: '⚑',
    allowedSource: ['person', 'org'],
    allowedTarget: ['person', 'org'],
    supportsDate: true,
    subtypes: [
      { id: 'threatened',  label: 'Threatened' },
      { id: 'attacked',    label: 'Attacked' },
      { id: 'defrauded',   label: 'Defrauded' },
      { id: 'extorted',    label: 'Extorted' },
      { id: 'harassed',    label: 'Harassed' },
    ],
  },
]

export function categoriesForTypes(
  sourceType?: string | null,
  targetType?: string | null
): RelationshipCategory[] {
  if (!sourceType || !targetType) return relationshipCategories
  return relationshipCategories.filter(c => {
    const srcOk = c.allowedSource === 'all' || c.allowedSource.includes(sourceType as NodeType)
    const tgtOk = c.allowedTarget === 'all' || c.allowedTarget.includes(targetType as NodeType)
    return srcOk && tgtOk
  })
}
