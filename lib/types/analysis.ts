export type Analysis = {
  borrowing: BorrowAnalysis[]
  revenue: RevenueAnalysis[]
  book: BookAnalysis[]
  membership: MembershipAnalysis[]
}

type BorrowAnalysis = {
  timestamp: string
  total_borrow: number
  total_return: number
}

type RevenueAnalysis = {
  timestamp: string
  subscription: number
  fine: number
}

type BookAnalysis = {
  id: string
  count: number
  title: string
}

type MembershipAnalysis = {
  id: string
  count: number
  name: string
}
