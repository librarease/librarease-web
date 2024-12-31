import { WithCommon } from './common'

export type Library = WithCommon<{
  name: string
  logo?: string
  address?: string
  phone?: string
  email?: string
  description?: string
}>
