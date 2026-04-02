"use client"

import { RoleSwitcher } from "@/components/dashboard/role-switcher"
import { useFinance } from "@/hooks/use-finance"
import { ThemeToggle } from "@/components/theme-toggle"
import { Badge } from "@/components/ui/badge"
import { Wallet } from "lucide-react"

export function Header() {
  const { role } = useFinance()

  return (
    <header className="border-b border-border/50 bg-card/30 backdrop-blur sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-primary/10">
            <Wallet className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="font-semibold text-lg leading-none">FinanceTrack</h1>
            <p className="text-xs text-muted-foreground mt-0.5">Personal Finance Dashboard</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge
            variant={role === "admin" ? "default" : "secondary"}
            className="hidden sm:flex"
          >
            {role === "admin" ? "Full Access" : "View Only"}
          </Badge>
          <RoleSwitcher />
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
