"use client"
import { useUserContext } from "@/context/user.provider"
import {
  ExpenseTrackerTable,
  formatCategoryName,
} from "@/shared/components/data-table"
import { EntityType } from "@/shared/components/entity-card/data"
import EntitySummarizer from "@/shared/components/entity-summarizer"
import StatCardStack from "@/shared/components/stat-card/stat-card-stack"
import { Button } from "@/shared/components/ui/button"
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
import { ExpenseCategory, ExpenseResponse } from "@/shared/constants/types"
import useQuery from "@/shared/hooks/use-query"
import { buildQueryUrl } from "@/shared/lib/build-url"
import { formatCurrency } from "@/shared/lib/format-currency"
import {
  generateMonthList,
  getNameFromMonthValue,
} from "@/shared/lib/generate-month-list"
import { PlusCircle } from "lucide-react"
import { useRouter } from "nextjs-toploader/app"
import { useState } from "react"

export default function Page() {
  const router = useRouter()
  const [{ searchKeyword, user }] = useUserContext()
  const [category, setSelectedCategory] = useState("all")
  const [selectedMonth, setSelectedMonth] = useState(
    `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}`
  )

  const startMonth = useQuery<{ startMonth: null | string }>({
    queryKey: ["start-month"],
    queryUrl: `${endPoints.expense}/start-month`,
    method: HTTPMethods.GET,
  })

  const expenses = useQuery<ExpenseResponse>({
    queryKey: ["get-expenses", searchKeyword, selectedMonth, category],
    queryUrl: buildQueryUrl(endPoints.expense, {
      month: selectedMonth,
      searchKeyword,
      category: category === "all" ? "" : category,
    }),
    method: HTTPMethods.GET,
    suspense: !!searchKeyword.length ? false : true,
  })

  return (
    <div className="mx-auto grid w-full items-start gap-6">
      <StatCardStack />
      <div className="flex gap-4 ml-auto">
        <Select value={category} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-40 bg-neutral-800 text-white border border-border rounded-lg">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent className="bg-background text-white border border-border rounded-lg">
            <SelectItem key="all" value="all" className="rounded-lg">
              All Categories
            </SelectItem>
            {Object.values(ExpenseCategory).map((category) => {
              return (
                <SelectItem
                  key={category}
                  value={category}
                  className="rounded-lg"
                >
                  {formatCategoryName(category)}
                </SelectItem>
              )
            })}
          </SelectContent>
        </Select>
        <Select value={selectedMonth} onValueChange={setSelectedMonth}>
          <SelectTrigger className="w-32 bg-neutral-800 text-white border border-border rounded-lg">
            <SelectValue placeholder="All Months" />
          </SelectTrigger>
          <SelectContent className="bg-background text-white border border-border rounded-lg">
            {generateMonthList(startMonth.data?.startMonth).map((month) => {
              return (
                <SelectItem key={month} value={month} className="rounded-lg">
                  {getNameFromMonthValue(month)}
                </SelectItem>
              )
            })}
          </SelectContent>
        </Select>
      </div>
      <Card className="bg-background text-white border border-border mb-4">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div className="space-y-2">
            <CardTitle>Your {getNameFromMonthValue(selectedMonth)}</CardTitle>
            <CardDescription className="text-primary">
              Total expense:{" "}
              {formatCurrency(expenses.data?.total ?? 0, user.baseCurrency)}
            </CardDescription>
          </div>
          <div className="flex gap-3">
            <Button
              size="icon"
              variant="default"
              className="bg-primary hover:bg-primary"
              onClick={(): void =>
                router.push(`/products/expensetrack/createexpense`)
              }
            >
              <PlusCircle className="h-4 w-4 text-black" />
            </Button>
            <EntitySummarizer
              entityType={EntityType.EXPENSE}
              entityDetails={`${getNameFromMonthValue(selectedMonth)} - ${JSON.stringify(expenses.data)}`}
            />
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
