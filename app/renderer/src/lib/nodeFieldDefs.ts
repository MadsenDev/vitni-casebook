import type { NodeType } from '../../../../shared/types'

export type FieldType = 'text' | 'date' | 'select' | 'textarea' | 'email' | 'phone'

export interface FieldDef {
  id: string
  label: string
  type: FieldType
  options?: string[]
  placeholder?: string
}

export const nodeFieldDefs: Record<NodeType, FieldDef[]> = {
  person: [
    { id: 'firstName',        label: 'First Name',       type: 'text',     placeholder: 'Jane' },
    { id: 'middleName',       label: 'Middle Name',      type: 'text',     placeholder: '' },
    { id: 'lastName',         label: 'Last Name',        type: 'text',     placeholder: 'Doe' },
    { id: 'alias',            label: 'Aliases',          type: 'textarea', placeholder: 'Known aliases, nicknames, handles' },
    { id: 'birthDate',        label: 'Date of Birth',    type: 'date' },
    { id: 'birthPlace',       label: 'Place of Birth',   type: 'text',     placeholder: 'Oslo, Norway' },
    { id: 'nationality',      label: 'Nationality',      type: 'text',     placeholder: 'Norwegian' },
    { id: 'gender',           label: 'Gender',           type: 'select',   options: ['Female', 'Male', 'Non-binary', 'Other', 'Unknown'] },
    { id: 'email',            label: 'Email',            type: 'email',    placeholder: 'jane@example.com' },
    { id: 'phone',            label: 'Phone',            type: 'phone',    placeholder: '+47 400 00 000' },
    { id: 'occupation',       label: 'Occupation',       type: 'text',     placeholder: 'Accountant' },
    { id: 'nationalId',       label: 'National ID',      type: 'text',     placeholder: 'National identity number' },
    { id: 'passport',         label: 'Passport No.',     type: 'text',     placeholder: 'A1234567' },
    { id: 'driversLicense',   label: 'Driver License',   type: 'text',     placeholder: 'D123456789' },
    { id: 'addressText',      label: 'Address',          type: 'textarea', placeholder: 'Known addresses or address history' },
    { id: 'investigativeRole',label: 'Role in Case',     type: 'select',   options: ['Unknown', 'Subject', 'Person of Interest', 'Witness', 'Victim', 'Associate', 'Investigator'] },
    { id: 'notes',            label: 'Analyst Notes',    type: 'textarea', placeholder: 'Summary, caveats, unresolved questions' },
  ],
  org: [
    { id: 'legalName',        label: 'Legal Name',       type: 'text',     placeholder: 'Acme Corporation Inc.' },
    { id: 'dba',              label: 'DBA / Trade Name', type: 'text',     placeholder: 'Acme Logistics' },
    { id: 'orgType',          label: 'Organization Type',type: 'select',   options: ['Corporation', 'LLC', 'Partnership', 'Non-profit', 'Government', 'Educational', 'Criminal Group', 'Other'] },
    { id: 'sector',           label: 'Sector',           type: 'text',     placeholder: 'Technology, finance, healthcare' },
    { id: 'jurisdiction',     label: 'Jurisdiction',     type: 'text',     placeholder: 'Norway' },
    { id: 'regNumber',        label: 'Registration No.', type: 'text',     placeholder: 'REG123456' },
    { id: 'taxId',            label: 'Tax ID / EIN',     type: 'text',     placeholder: '12-3456789' },
    { id: 'website',          label: 'Website',          type: 'text',     placeholder: 'https://acme.example' },
    { id: 'email',            label: 'Email',            type: 'email',    placeholder: 'info@acme.example' },
    { id: 'phone',            label: 'Phone',            type: 'phone',    placeholder: '+1-555-123-4567' },
    { id: 'addressText',      label: 'Address',          type: 'textarea', placeholder: 'Registered and operating addresses' },
    { id: 'foundedDate',      label: 'Founded Date',     type: 'date' },
    { id: 'status',           label: 'Status',           type: 'select',   options: ['Active', 'Inactive', 'Dissolved', 'Suspended', 'Unknown'] },
    { id: 'notes',            label: 'Analyst Notes',    type: 'textarea', placeholder: 'Summary and unresolved issues' },
  ],
  account: [
    { id: 'platform',         label: 'Platform',         type: 'text',     placeholder: 'Instagram, Telegram, eBay' },
    { id: 'handle',           label: 'Handle / Username',type: 'text',     placeholder: '@janedoe' },
    { id: 'displayName',      label: 'Display Name',     type: 'text',     placeholder: 'Jane Doe' },
    { id: 'profileUrl',       label: 'Profile URL',      type: 'text',     placeholder: 'https://instagram.com/janedoe' },
    { id: 'accountType',      label: 'Account Type',     type: 'select',   options: ['Personal', 'Business', 'Bot', 'Anonymous', 'Unknown'] },
    { id: 'createdDate',      label: 'Created Date',     type: 'date' },
    { id: 'lastSeen',         label: 'Last Seen',        type: 'date' },
    { id: 'status',           label: 'Status',           type: 'select',   options: ['Active', 'Inactive', 'Suspended', 'Deleted', 'Unknown'] },
    { id: 'notes',            label: 'Analyst Notes',    type: 'textarea', placeholder: 'Username variants, profile clues' },
  ],
  device: [
    { id: 'deviceType',       label: 'Device Type',      type: 'select',   options: ['Smartphone', 'Laptop', 'Desktop', 'Tablet', 'Router', 'Storage', 'IoT Device', 'Other'] },
    { id: 'manufacturer',     label: 'Manufacturer',     type: 'text',     placeholder: 'Samsung' },
    { id: 'model',            label: 'Model',            type: 'text',     placeholder: 'Galaxy S24+' },
    { id: 'serialNumber',     label: 'Serial Number',    type: 'text',     placeholder: 'ABC123456789' },
    { id: 'imei',             label: 'IMEI / MEID',      type: 'text',     placeholder: '123456789012345' },
    { id: 'macAddress',       label: 'MAC Address',      type: 'text',     placeholder: '00:1B:44:11:3A:B7' },
    { id: 'ipAddress',        label: 'Current IP',       type: 'text',     placeholder: '192.168.1.100' },
    { id: 'os',               label: 'Operating System', type: 'text',     placeholder: 'Android 16' },
    { id: 'status',           label: 'Status',           type: 'select',   options: ['Active', 'Inactive', 'Lost', 'Stolen', 'Destroyed', 'Unknown'] },
    { id: 'purchaseDate',     label: 'Purchase Date',    type: 'date' },
    { id: 'notes',            label: 'Analyst Notes',    type: 'textarea', placeholder: 'Identifiers, seizure notes, forensic status' },
  ],
  location: [
    { id: 'locationType',     label: 'Location Type',    type: 'select',   options: ['Residence', 'Workplace', 'Meeting Point', 'Border Crossing', 'Vehicle', 'Online', 'Other'] },
    { id: 'address',          label: 'Address',          type: 'textarea', placeholder: '123 Main St, Oslo' },
    { id: 'city',             label: 'City',             type: 'text',     placeholder: 'Oslo' },
    { id: 'country',          label: 'Country',          type: 'text',     placeholder: 'Norway' },
    { id: 'coordinates',      label: 'Coordinates',      type: 'text',     placeholder: '59.9139, 10.7522' },
    { id: 'notes',            label: 'Analyst Notes',    type: 'textarea', placeholder: 'Access history, surveillance notes' },
  ],
  event: [
    { id: 'eventType',        label: 'Event Type',       type: 'select',   options: ['Meeting', 'Transaction', 'Travel', 'Communication', 'Incident', 'Crime', 'Other'] },
    { id: 'startDate',        label: 'Start Date',       type: 'date' },
    { id: 'endDate',          label: 'End Date',         type: 'date' },
    { id: 'locationText',     label: 'Location',         type: 'text',     placeholder: 'City, venue, or address' },
    { id: 'description',      label: 'Description',      type: 'textarea', placeholder: 'What happened' },
    { id: 'notes',            label: 'Analyst Notes',    type: 'textarea', placeholder: 'Context, sources, caveats' },
  ],
  evidence: [
    { id: 'evidenceType',     label: 'Evidence Type',    type: 'select',   options: ['Document', 'Photo', 'Video', 'Audio', 'Financial Record', 'Communication Log', 'Digital Artifact', 'Physical', 'Other'] },
    { id: 'reference',        label: 'Reference / ID',   type: 'text',     placeholder: 'EX-001, doc-abc' },
    { id: 'acquiredDate',     label: 'Acquired Date',    type: 'date' },
    { id: 'custodian',        label: 'Custodian',        type: 'text',     placeholder: 'Who holds this item' },
    { id: 'hash',             label: 'Hash / Checksum',  type: 'text',     placeholder: 'SHA-256: …' },
    { id: 'notes',            label: 'Analyst Notes',    type: 'textarea', placeholder: 'Provenance, chain of custody, caveats' },
  ],
}
