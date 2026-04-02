"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useFinance } from "@/hooks/use-finance"
import { useMemo } from "react"
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(amount)
}

export function BalanceChart() {
  const { transactions } = useFinance()

  const chartData = useMemo(() => {
    if (transactions.length === 0) return []

    const sortedTransactions = [...transactions].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    )

    const monthlyData: Record<string, { income: number; expenses: number }> = {}

    sortedTransactions.forEach((t) => {
      const month = t.date.substring(0, 7) 
      if (!monthlyData[month]) {
        monthlyData[month] = { income: 0, expenses: 0 }
      }
      if (t.type === "income") {
        monthlyData[month].income += t.amount
      } else {
        monthlyData[month].expenses += t.amount
      }
    })

    let runningBalance = 0

    return Object.entries(monthlyData)
      .sort(([a], [b]) => a.localeCompare(b)) 
      .map(([month, data]) => {
        runningBalance += data.income - data.expenses   

        const date = new Date(month + "-01")

        return {
          month: date.toLocaleDateString("en-US", { 
            month: "short", 
            year: "2-digit" 
          }),
          balance: runningBalance,
          income: data.income,
          expenses: data.expenses,
        }
      })
  }, [transactions])


  if (chartData.length === 0) {
    return (
      <Card className="border-border/50 bg-card/50 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Balance Trend</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <p className="text-muted-foreground">No data available</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">Balance Trend</CardTitle>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-chart-1" />
              <span className="text-muted-foreground">Balance</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-chart-1)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="var(--color-chart-1)" stopOpacity={0} />
                </linearGradient>
              </defs>

              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }}
                dy={10}
              />

              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }}
                tickFormatter={(value: number) => `$${(value / 1000).toFixed(0)}k`}
                dx={-10}
              />

              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload
                    return (
                      <div className="rounded-lg border bg-popover p-3 shadow-md">
                        <p className="font-medium">{data.month}</p>
                        <p className="text-sm text-primary">
                          Balance: {formatCurrency(data.balance)}
                        </p>
                        <p className="text-sm text-success">
                          Income: {formatCurrency(data.income)}
                        </p>
                        <p className="text-sm text-destructive">
                          Expenses: {formatCurrency(data.expenses)}
                        </p>
                      </div>
                    )
                  }
                  return null
                }}
              />

              <Area
                type="monotone"
                dataKey="balance"
                stroke="var(--color-chart-1)"
                strokeWidth={2}
                fill="url(#balanceGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}