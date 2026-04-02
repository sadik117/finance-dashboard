"use client"

import { FinanceProvider } from "@/context/finance-provider"
import { Header } from "@/components/dashboard/header"
import { SummaryCards } from "@/components/dashboard/summary-cards"
import { BalanceChart } from "@/components/dashboard/balance-chart"
import { SpendingChart } from "@/components/dashboard/spending-chart"
import { TransactionsTable } from "@/components/dashboard/transactions-table"
import { Insights } from "@/components/dashboard/insights"

export default function DashboardPage() {
  return (
    <FinanceProvider>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-6">
          <div className="space-y-6">
            {/* Summary Cards  */}
            <SummaryCards />

            {/* Charts Section */}
            <div className="grid gap-6 lg:grid-cols-2">
              <BalanceChart />
              <SpendingChart />
            </div>

            {/* Insights Section */}
            <Insights />

            {/* Transactions Table */}
            <TransactionsTable />
          </div>
        </main>
        <footer className="border-t border-border/50 py-4 mt-8">
          <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
            FinanceTrack &mdash; Track your finances with ease
          </div>
        </footer>
      </div>
    </FinanceProvider>
  )
}
