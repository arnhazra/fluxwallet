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
import Show from "../show"

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
          <TableRow className="border-border hover:bg-neutral-800">
            <TableHead className="text-neutral-200">Title</TableHead>
            <TableHead className="text-neutral-200">Category</TableHead>
            <TableHead className="text-right text-neutral-200">
              Amount
            </TableHead>
            <TableHead className="text-neutral-200">Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {expenses.map((expense) => (
            <TableRow
              key={expense._id}
              className="border-border hover:bg-neutral-800"
            >
              <TableCell className="font-medium">
                {expense.title || "Untitled"}
              </TableCell>
              <TableCell>
                <Badge className="bg-primary text-black hover:bg-primary">
                  {formatCategoryName(expense.expenseCategory)}
                </Badge>
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

      <Show condition={!!total}>
        <div className="flex justify-end border-t border-border pt-4">
          <div className="space-y-2">
            <div className="flex gap-8">
              <span className="text-lg font-bold text-primary">
                {formatCurrency(total ?? 0, user.baseCurrency)}
              </span>
            </div>
          </div>
        </div>
      </Show>
    </div>
  )
}
