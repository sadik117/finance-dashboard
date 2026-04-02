"use client"

import {
  useState,
  useEffect,
  useCallback,
  useMemo,
  ReactNode,
} from "react"

import {
  ITransaction,
  IFilterState,
  UserRole,
} from "@/types/finance"

import { initialTransactions } from "@/lib/initial-data"
import { STORAGE_KEY } from "@/lib/constants"
import { FinanceContext } from "@/context/finance-context"

export function FinanceProvider({ children }: { children: ReactNode }) {

  const [transactions, setTransactions] = useState<ITransaction[]>(() => {
    if (typeof window === "undefined") return initialTransactions

    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (!stored) return initialTransactions

      const parsed = JSON.parse(stored)
      return parsed.transactions || initialTransactions
    } catch {
      return initialTransactions
    }
  })


  const [role, setRole] = useState<UserRole>(() => {
    if (typeof window === "undefined") return "admin"

    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (!stored) return "admin"

      const parsed = JSON.parse(stored)
      return parsed.role || "admin"
    } catch {
      return "admin"
    }
  })


  const [filters, setFiltersState] = useState<IFilterState>({
    search: "",
    type: "all",
    category: "all",
    sortBy: "date",
    sortOrder: "desc",
  })

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ transactions, role })
    )
  }, [transactions, role])


  const setFilters = useCallback((newFilters: Partial<IFilterState>) => {
    setFiltersState((prev) => ({
      ...prev,
      ...newFilters,
    }))
  }, [])


  const addTransaction = useCallback(
    (transaction: Omit<ITransaction, "id">) => {
      const newTransaction: ITransaction = {
        ...transaction,
        id: Date.now().toString(),
      }

      setTransactions((prev) => [newTransaction, ...prev])
    },
    []
  )


  const updateTransaction = useCallback(
    (id: string, updates: Partial<ITransaction>) => {
      setTransactions((prev) =>
        prev.map((t) =>
          t.id === id ? { ...t, ...updates } : t
        )
      )
    },
    []
  )


  const deleteTransaction = useCallback((id: string) => {
    setTransactions((prev) =>
      prev.filter((t) => t.id !== id)
    )
  }, [])


  const filteredTransactions = useMemo(() => {
    return transactions
      .filter((t) => {
        if (
          filters.search &&
          !t.description
            .toLowerCase()
            .includes(filters.search.toLowerCase())
        ) {
          return false
        }

        if (filters.type !== "all" && t.type !== filters.type) {
          return false
        }

        if (
          filters.category !== "all" &&
          t.category !== filters.category
        ) {
          return false
        }

        return true
      })
      .sort((a, b) => {
        const multiplier = filters.sortOrder === "asc" ? 1 : -1

        if (filters.sortBy === "date") {
          return (
            multiplier *
            (new Date(a.date).getTime() -
              new Date(b.date).getTime())
          )
        }

        return multiplier * (a.amount - b.amount)
      })
  }, [transactions, filters])

  
  const totalIncome = useMemo(() => {
    return transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0)
  }, [transactions])

  const totalExpenses = useMemo(() => {
    return transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0)
  }, [transactions])

  const totalBalance = useMemo(() => {
    return totalIncome - totalExpenses
  }, [totalIncome, totalExpenses])


  return (
    <FinanceContext.Provider
      value={{
        transactions,
        role,
        filters,
        setRole,
        setFilters,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        filteredTransactions,
        totalBalance,
        totalIncome,
        totalExpenses,
      }}
    >
      {children}
    </FinanceContext.Provider>
  )
}