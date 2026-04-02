"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useFinance } from "@/hooks/use-finance"
import { Category, TransactionType } from "@/types/finance"
import { Search, ArrowUpDown, Pencil, Trash2, Plus } from "lucide-react"
import { useState } from "react"
import { TransactionDialog } from "./transaction-dialog"
import { cn } from "@/lib/utils"

const categories: Category[] = [
  "Food",
  "Transport",
  "Entertainment",
  "Shopping",
  "Bills",
  "Salary",
  "Freelance",
  "Investment",
  "Other",
]

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount)
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export function TransactionsTable() {
  const { filteredTransactions, filters, setFilters, deleteTransaction, role } =
    useFinance()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<
    (typeof filteredTransactions)[0] | null
  >(null)

  const isAdmin = role === "admin"

  const toggleSort = () => {
    setFilters({
      sortOrder: filters.sortOrder === "asc" ? "desc" : "asc",
    })
  }

  const handleEdit = (transaction: (typeof filteredTransactions)[0]) => {
    setEditingTransaction(transaction)
    setDialogOpen(true)
  }

  const handleAdd = () => {
    setEditingTransaction(null)
    setDialogOpen(true)
  }

  return (
    <>
      <Card className="border-border/50 bg-card/50 backdrop-blur">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle className="text-sm font-medium">Transactions</CardTitle>
            {isAdmin && (
              <Button onClick={handleAdd} size="sm" className="gap-1.5">
                <Plus className="h-4 w-4" />
                Add Transaction
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search transactions..."
                value={filters.search}
                onChange={(e) => setFilters({ search: e.target.value })}
                className="pl-9 bg-secondary/50"
              />
            </div>
            <Select
              value={filters.type}
              onValueChange={(value) =>
                setFilters({ type: value as TransactionType | "all" })
              }
            >
              <SelectTrigger className="w-full sm:w-[140px] bg-secondary/50">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="income">Income</SelectItem>
                <SelectItem value="expense">Expense</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={filters.category}
              onValueChange={(value) =>
                setFilters({ category: value as Category | "all" })
              }
            >
              <SelectTrigger className="w-full sm:w-[150px] bg-secondary/50">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={filters.sortBy}
              onValueChange={(value) =>
                setFilters({ sortBy: value as "date" | "amount" })
              }
            >
              <SelectTrigger className="w-full sm:w-[130px] bg-secondary/50">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="amount">Amount</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="icon"
              onClick={toggleSort}
              className="shrink-0"
            >
              <ArrowUpDown className="h-4 w-4" />
            </Button>
          </div>

          {/* Table */}
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No transactions found</p>
              {filters.search || filters.type !== "all" || filters.category !== "all" ? (
                <Button
                  variant="link"
                  onClick={() =>
                    setFilters({ search: "", type: "all", category: "all" })
                  }
                  className="mt-2"
                >
                  Clear filters
                </Button>
              ) : isAdmin ? (
                <Button onClick={handleAdd} variant="link" className="mt-2">
                  Add your first transaction
                </Button>
              ) : null}
            </div>
          ) : (
            <div className="rounded-md border border-border/50 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="w-[110px]">Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    {isAdmin && (
                      <TableHead className="w-[100px] text-right">Actions</TableHead>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="text-muted-foreground text-sm">
                        {formatDate(transaction.date)}
                      </TableCell>
                      <TableCell className="font-medium">
                        {transaction.description}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className="bg-secondary/70 text-secondary-foreground"
                        >
                          {transaction.category}
                        </Badge>
                      </TableCell>
                      <TableCell
                        className={cn(
                          "text-right font-mono",
                          transaction.type === "income"
                            ? "text-success"
                            : "text-destructive"
                        )}
                      >
                        {transaction.type === "income" ? "+" : "-"}
                        {formatCurrency(transaction.amount)}
                      </TableCell>
                      {isAdmin && (
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleEdit(transaction)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              onClick={() => deleteTransaction(transaction.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {filteredTransactions.length > 0 && (
            <p className="text-xs text-muted-foreground mt-3">
              Showing {filteredTransactions.length} transaction
              {filteredTransactions.length !== 1 ? "s" : ""}
            </p>
          )}
        </CardContent>
      </Card>

      <TransactionDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        transaction={editingTransaction}
      />
    </>
  )
}
