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
import { endPoints } from "@/shared/constants/api-endpoints"
import HTTPMethods from "@/shared/constants/http-methods"
import { ExpenseResponse } from "@/shared/constants/types"
import useQuery from "@/shared/hooks/use-query"

export default function Page() {
  const [{ searchKeyword }] = useUserContext()
  const expenses = useQuery<ExpenseResponse>({
    queryKey: ["get-expenses", searchKeyword],
    queryUrl: `${endPoints.expense}`,
    method: HTTPMethods.GET,
    suspense: !!searchKeyword.length ? false : true,
  })

  return (
    <div className="mx-auto grid w-full items-start gap-6">
      <StatCardStack />
      <Card className="bg-background text-white border border-border mb-4">
        <CardHeader>
          <CardTitle>Recent Expenses</CardTitle>
          <CardDescription className="text-neutral-300">
            A list of all your recorded expenses with amounts and categories
          </CardDescription>
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
