"use client"
import { useUserContext } from "@/context/user.provider"
import { ExpenseTrackerTable } from "@/shared/components/data-table"
import StatCardStack from "@/shared/components/stat-card/stat-card-stack"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select"
import { endPoints } from "@/shared/constants/api-endpoints"
import HTTPMethods from "@/shared/constants/http-methods"
import { ExpenseResponse } from "@/shared/constants/types"
import useQuery from "@/shared/hooks/use-query"
import generateMonthList from "@/shared/lib/generate-month-list"
import { useState } from "react"

export default function Page() {
  const [{ searchKeyword }] = useUserContext()
  const [selectedMonth, setSelectedMonth] = useState(
    `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}`
  )
  const startMonth = useQuery<any>({
    queryKey: ["start-month"],
    queryUrl: `${endPoints.expense}/start-month`,
    method: HTTPMethods.GET,
  })

  const expenses = useQuery<ExpenseResponse>({
    queryKey: ["get-expenses", searchKeyword, selectedMonth],
    queryUrl: `${endPoints.expense}?month=${selectedMonth}&searchKeyword=${searchKeyword}`,
    method: HTTPMethods.GET,
    suspense: !!searchKeyword.length ? false : true,
  })

  return (
    <div className="mx-auto grid w-full items-start gap-6">
      <StatCardStack />
      <Card className="bg-background text-white border border-border mb-4">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div className="space-y-2">
            <CardTitle>Your {selectedMonth}</CardTitle>
            <CardDescription className="text-neutral-100">
              Total expense: {expenses.data?.total}
            </CardDescription>
          </div>
          <div className="flex gap-3">
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-32 bg-background text-white border border-border">
                <SelectValue placeholder="All Months" />
              </SelectTrigger>
              <SelectContent>
                {generateMonthList(startMonth.data.startMonth).map((month) => {
                  return (
                    <SelectItem key={month.value} value={month.value}>
                      {month.displayName}
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <ExpenseTrackerTable
            expenses={expenses.data?.expenses}
            total={expenses.data?.total}
          />
        </CardContent>
      </Card>
    </div>
  )
}
