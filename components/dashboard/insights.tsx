"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useFinance } from "@/hooks/use-finance"
import { useMemo } from "react"
import { Lightbulb, TrendingUp, TrendingDown, AlertCircle } from "lucide-react"
import { Insight } from "@/types/finance"

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(amount)
}

export function Insights() {
  const { transactions, totalIncome, totalExpenses } = useFinance()

  const currentMonth = useMemo(() => {
    return new Date().toISOString().substring(0, 7)
  }, [])

  const lastMonth = useMemo(() => {
    const now = new Date()
    const lastMonthDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    return lastMonthDate.toISOString().substring(0, 7)
  }, [])

  const insights = useMemo<Insight[]>(() => {
    const result: Insight[] = []

    const expensesByCategory: Record<string, number> = {}
    transactions
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        expensesByCategory[t.category] = (expensesByCategory[t.category] || 0) + t.amount
      })

    const sortedCategories = Object.entries(expensesByCategory).sort(
      ([, a], [, b]) => b - a
    )

    if (sortedCategories.length > 0) {
      const [topCategory, topAmount] = sortedCategories[0]
      const percentage = totalExpenses > 0 ? Math.round((topAmount / totalExpenses) * 100) : 0

      result.push({
        id: "top-spending",
        title: "Highest Spending Category",
        description: `${topCategory} accounts for ${percentage}% of your expenses (${formatCurrency(topAmount)})`,
        type: "neutral",
        icon: Lightbulb,
      })
    }

    const currentMonthExpenses = transactions
      .filter((t) => t.type === "expense" && t.date.startsWith(currentMonth))
      .reduce((sum, t) => sum + t.amount, 0)

    const lastMonthExpenses = transactions
      .filter((t) => t.type === "expense" && t.date.startsWith(lastMonth))
      .reduce((sum, t) => sum + t.amount, 0)

    if (lastMonthExpenses > 0) {
      const change = ((currentMonthExpenses - lastMonthExpenses) / lastMonthExpenses) * 100
      const isIncrease = change > 0

      result.push({
        id: "monthly-comparison",
        title: "Monthly Spending Change",
        description: isIncrease
          ? `Spending ${change.toFixed(0)}% higher than last month`
          : `Spending ${Math.abs(change).toFixed(0)}% lower than last month`,
        type: isIncrease ? "negative" : "positive",
        icon: isIncrease ? TrendingUp : TrendingDown,
      })
    }

    if (totalIncome > 0) {
      const savingsRate = ((totalIncome - totalExpenses) / totalIncome) * 100

      result.push({
        id: "savings-rate",
        title: "Savings Rate",
        description:
          savingsRate > 20
            ? `Great job! You're saving ${savingsRate.toFixed(0)}% of your income`
            : savingsRate > 0
            ? `You're saving ${savingsRate.toFixed(0)}% of your income. Aim for 20%+`
            : "You're spending more than you earn. Consider budgeting.",
        type: savingsRate > 20 ? "positive" : savingsRate > 0 ? "neutral" : "negative",
        icon: savingsRate > 0 ? TrendingUp : AlertCircle,
      })
    }

    const categoryFrequency: Record<string, number> = {}
    transactions
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        categoryFrequency[t.category] = (categoryFrequency[t.category] || 0) + 1
      })

    const sortedByFrequency = Object.entries(categoryFrequency).sort(
      ([, a], [, b]) => b - a
    )

    if (sortedByFrequency.length > 0) {
      const [frequentCategory, count] = sortedByFrequency[0]
      result.push({
        id: "frequent-expense",
        title: "Most Frequent Expense",
        description: `You have ${count} transactions in ${frequentCategory}`,
        type: "neutral",
        icon: Lightbulb,
      })
    }

    return result
  }, [transactions, totalIncome, totalExpenses, currentMonth, lastMonth])

  
  if (insights.length === 0) {
    return (
      <Card className="border-border/50 bg-card/50 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Add more transactions to see personalized insights.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">Insights</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3">
          {insights.map((insight) => (
            <div
              key={insight.id}
              className="flex items-start gap-3 rounded-lg border border-border/50 bg-secondary/30 p-3"
            >
              <div
                className={`rounded-full p-2 ${
                  insight.type === "positive"
                    ? "bg-success/10 text-success"
                    : insight.type === "negative"
                    ? "bg-destructive/10 text-destructive"
                    : "bg-primary/10 text-primary"
                }`}
              >
                <insight.icon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">{insight.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {insight.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}