export type TransactionType = "income" | "expense"

export type Category =
  | "Food"
  | "Transport"
  | "Entertainment"
  | "Shopping"
  | "Bills"
  | "Salary"
  | "Freelance"
  | "Investment"
  | "Other"

export type UserRole = "viewer" | "admin"

export interface ITransaction {
  id: string
  date: string
  description: string
  amount: number
  type: TransactionType
  category: Category
}

export interface IFilterState {
  search: string
  type: TransactionType | "all"
  category: Category | "all"
  sortBy: "date" | "amount"
  sortOrder: "asc" | "desc"
}