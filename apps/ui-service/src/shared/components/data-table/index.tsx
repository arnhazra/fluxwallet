"use client"
import { ExpenseCategory, ExpenseResponse } from "@/shared/constants/types"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table"
import { formatCurrency } from "@/shared/lib/format-currency"
import { useUserContext } from "@/context/user.provider"
import { Badge } from "../ui/badge"

const formatCategoryName = (category: ExpenseCategory): string => {
  return category
    .split("_")
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(" ")
}

export const ExpenseTrackerTable = ({ expenses, total }: ExpenseResponse) => {
  const [{ user }] = useUserContext()
  if (!expenses || expenses.length === 0) {
    return (
      <div className="flex items-center justify-center py-12 text-muted-foreground">
        <p>No expenses recorded yet</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {expenses.map((expense) => (
            <TableRow key={expense._id}>
              <TableCell className="font-medium">
                {expense.title || "Untitled"}
              </TableCell>
              <TableCell>
                <Badge>{formatCategoryName(expense.expenseCategory)}</Badge>
              </TableCell>
              <TableCell className="text-right font-semibold">
                {formatCurrency(expense.expenseAmount, user.baseCurrency)}
              </TableCell>
              <TableCell>
                {typeof expense.expenseDate === "string"
                  ? new Date(expense.expenseDate).toLocaleDateString()
                  : expense.expenseDate.toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {total !== null && total !== undefined && (
        <div className="flex justify-end border-t pt-4">
          <div className="space-y-2">
            <div className="flex gap-8">
              <span className="text-sm font-medium text-muted-foreground">
                Total:
              </span>
              <span className="text-lg font-bold text-primary">
                {formatCurrency(total, user.baseCurrency)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
