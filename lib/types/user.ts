import { WithCommon } from './common'

export type User = WithCommon<{
  name: string
  email: string
  global_role: 'SUPER_ADMIN' | 'ADMIN' | 'USER'
  // staff: Staff[];
}>
