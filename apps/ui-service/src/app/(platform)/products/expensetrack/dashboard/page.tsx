"use client"
import { useUserContext } from "@/context/user.provider"
import { EntityType } from "@/shared/components/entity-card/data"
import EntitySummarizer from "@/shared/components/entity-summarizer"
import IconContainer from "@/shared/components/icon-container"
import SectionPanel from "@/shared/components/section-panel"
import Show from "@/shared/components/show"
import StatCardStack from "@/shared/components/stat-card/stat-card-stack"
import { Badge } from "@/shared/components/ui/badge"
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
import { uiConstants } from "@/shared/constants/global-constants"
import HTTPMethods from "@/shared/constants/http-methods"
import { ExpenseCategory, ExpenseResponse } from "@/shared/constants/types"
import notify from "@/shared/hooks/use-notify"
import useQuery from "@/shared/hooks/use-query"
import { buildQueryUrl } from "@/shared/lib/build-url"
import { formatCurrency } from "@/shared/lib/format-currency"
import {
  generateMonthList,
  getNameFromMonthValue,
} from "@/shared/lib/generate-month-list"
import { useConfirmContext } from "@/shared/providers/confirm.provider"
import { useQueryClient } from "@tanstack/react-query"
import ky from "ky"
import { PiggyBank, PlusCircle, Trash, Trash2 } from "lucide-react"
import { useRouter } from "nextjs-toploader/app"
import { useEffect, useState } from "react"

export const formatCategoryName = (category: ExpenseCategory): string => {
  return category
    .split("_")
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join("/")
}

export default function Page() {
  const router = useRouter()
  const { confirm } = useConfirmContext()
  const [{ searchKeyword, user }] = useUserContext()
  const queryClient = useQueryClient()
  const [category, setSelectedCategory] = useState("all")
  const [totalExpense, setTotalExpense] = useState(0)
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

  useEffect(() => {
    if (totalExpense === 0) {
      setTotalExpense(expenses.data?.total || 0)
    }
  }, [expenses.data?.total])

  const deleteExpense = async (expenseId: string): Promise<void> => {
    const confirmed = await confirm({
      title: `Delete Expense`,
      desc: `Are you sure you want to delete this Expense?`,
    })

    if (confirmed) {
      try {
        await ky.delete(`${endPoints.expense}/${expenseId}`)
        queryClient.refetchQueries({
          queryKey: ["get-expenses"],
        })
        notify(`${uiConstants.entityDeleted} expense`, "success")
      } catch (error) {
        notify(uiConstants.genericError, "error")
      }
    }
  }

  const renderExpenses = expenses.data?.expenses?.map((expense) => {
    return (
      <div className="mb-2" key={expense._id}>
        <SectionPanel
          key={expense._id}
          icon={
            <IconContainer>
              <PiggyBank className="h-4 w-4" />
            </IconContainer>
          }
          title={expense.title || "Untitled Expense"}
          content={
            <div className="block">
              <div className="text-primary mb-1">
                {formatCurrency(expense.expenseAmount, user.baseCurrency)}
              </div>
              <Badge className="bg-primary text-black hover:bg-primary">
                {formatCategoryName(expense.expenseCategory)}
              </Badge>
            </div>
          }
          actionComponents={[
            <Button
              className="bg-secondary hover:bg-secondary"
              size="icon"
              onClick={() => deleteExpense(expense._id)}
            >
              <Trash className="h-4 w-4" />
            </Button>,
          ]}
        />
      </div>
    )
  })

  return (
    <div className="mx-auto grid w-full items-start gap-6">
      <StatCardStack />
      <div className="flex gap-4">
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
              {formatCurrency(totalExpense ?? 0, user.baseCurrency)}
            </CardDescription>
            <Show condition={!category || category !== "all"}>
              <CardDescription className="text-primary">
                Expense for {formatCategoryName(category as ExpenseCategory)}:{" "}
                {formatCurrency(expenses.data?.total ?? 0, user.baseCurrency)}
              </CardDescription>
            </Show>
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
          <Show
            condition={!!expenses.data?.expenses?.length}
            fallback={
              <p className="text-center text-secondary">
                No recorded expenses to show
              </p>
            }
          >
            {renderExpenses}
          </Show>
        </CardContent>
      </Card>
    </div>
  )
}
