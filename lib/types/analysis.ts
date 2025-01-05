export type Analysis = {
  borrowing: BorrowAnalysis[]
  revenue: RevenueAnalysis[]
  book: BookAnalysis[]
  membership: MembershipAnalysis[]
}

type BorrowAnalysis = {
  timestamp: string
  count: string
}

type RevenueAnalysis = {
  timestamp: string
  subscription: number
  fine: number
}

type BookAnalysis = {
  timestamp: string
  count: number
  title: string
}

type MembershipAnalysis = {
  count: number
  name: string
}
