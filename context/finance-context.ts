import { IFilterState, ITransaction, UserRole } from "@/types/finance"
import { createContext } from "react"

interface FinanceContextType {
  transactions: ITransaction[]
  role: UserRole
  filters: IFilterState
  setRole: (role: UserRole) => void
  setFilters: (filters: Partial<IFilterState>) => void
  addTransaction: (transaction: Omit<ITransaction, "id">) => void
  updateTransaction: (id: string, transaction: Partial<ITransaction>) => void
  deleteTransaction: (id: string) => void
  filteredTransactions: ITransaction[]
  totalBalance: number
  totalIncome: number
  totalExpenses: number
}

export const FinanceContext = createContext<FinanceContextType | undefined>(undefined)