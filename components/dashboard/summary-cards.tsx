"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useFinance } from "@/hooks/use-finance"
import { TrendingUp, TrendingDown, Wallet, ArrowUpRight, ArrowDownRight } from "lucide-react"

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount)
}

export function SummaryCards() {
  const { totalBalance, totalIncome, totalExpenses } = useFinance()

  const cards = [
    {
      title: "Total Balance",
      value: totalBalance,
      icon: Wallet,
      trend: totalBalance >= 0 ? "positive" : "negative",
      description: "Current net balance",
    },
    {
      title: "Total Income",
      value: totalIncome,
      icon: TrendingUp,
      trend: "positive" as const,
      description: "All time income",
    },
    {
      title: "Total Expenses",
      value: totalExpenses,
      icon: TrendingDown,
      trend: "negative" as const,
      description: "All time expenses",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {cards.map((card) => (
        <Card key={card.title} className="border-border/50 bg-card/50 backdrop-blur">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {card.title}
            </CardTitle>
            <card.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold">{formatCurrency(card.value)}</span>
              {card.trend === "positive" ? (
                <ArrowUpRight className="h-4 w-4 text-success" />
              ) : (
                <ArrowDownRight className="h-4 w-4 text-destructive" />
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">{card.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
