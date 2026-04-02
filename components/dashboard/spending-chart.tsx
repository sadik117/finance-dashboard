"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useFinance } from "@/hooks/use-finance"
import { Category } from "@/types/finance"
import { useMemo } from "react"
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"

const COLORS: Record<Category, string> = {
  Food: "var(--color-chart-1)",
  Transport: "var(--color-chart-2)",
  Entertainment: "var(--color-chart-3)",
  Shopping: "var(--color-chart-4)",
  Bills: "var(--color-chart-5)",
  Salary: "var(--color-primary)",
  Freelance: "var(--color-success)",
  Investment: "var(--color-accent)",
  Other: "var(--color-muted-foreground)",
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(amount)
}

export function SpendingChart() {
  const { transactions } = useFinance()

  const chartData = useMemo(() => {
    const expensesByCategory: Record<string, number> = {}

    transactions
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        expensesByCategory[t.category] = (expensesByCategory[t.category] || 0) + t.amount
      })

    return Object.entries(expensesByCategory)
      .map(([category, amount]) => ({
        name: category,
        value: amount,
        color: COLORS[category as Category] || COLORS.Other,
      }))
      .sort((a, b) => b.value - a.value)
  }, [transactions])

  const totalExpenses = chartData.reduce((sum, item) => sum + item.value, 0)

  if (chartData.length === 0) {
    return (
      <Card className="border-border/50 bg-card/50 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Spending Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <p className="text-muted-foreground">No expenses recorded</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Spending Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col lg:flex-row items-center gap-4">
          <div className="h-[220px] w-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload
                      const percentage = ((data.value / totalExpenses) * 100).toFixed(1)
                      return (
                        <div className="rounded-lg border bg-popover p-3 shadow-md">
                          <p className="font-medium">{data.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatCurrency(data.value)} ({percentage}%)
                          </p>
                        </div>
                      )
                    }
                    return null
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex-1 grid grid-cols-2 gap-2 w-full">
            {chartData.slice(0, 6).map((item) => (
              <div
                key={item.name}
                className="flex items-center gap-2 text-sm"
              >
                <span
                  className="h-3 w-3 rounded-sm shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-muted-foreground truncate">{item.name}</span>
                <span className="ml-auto font-medium">{formatCurrency(item.value)}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
