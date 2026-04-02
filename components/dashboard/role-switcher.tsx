"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useFinance } from "@/hooks/use-finance"
import { UserRole } from "@/types/finance"
import { Shield, Eye } from "lucide-react"

export function RoleSwitcher() {
  const { role, setRole } = useFinance()

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground hidden sm:inline">Role:</span>
      <Select value={role} onValueChange={(value) => setRole(value as UserRole)}>
        <SelectTrigger className="w-[130px] bg-secondary/50">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="admin">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Admin
            </div>
          </SelectItem>
          <SelectItem value="viewer">
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Viewer
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
