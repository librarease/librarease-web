import { WithCommon } from './common'

type ColorTuple = [number, number, number, number]
type AssetColor = { [K in 0 | 1 | 2 | 3]: ColorTuple }

export type Asset = WithCommon<{
  id: string
  path: string
  owner_id?: string
  owner_type?: 'book' | 'collection' | 'library'
  kind?: string
  is_primary?: boolean
  position?: number
  colors: AssetColor
}>
