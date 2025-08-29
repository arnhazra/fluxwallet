import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog"
import { Goal } from "@/shared/types"
import { endPoints } from "@/shared/constants/api-endpoints"
import { DialogDescription, DialogTrigger } from "@radix-ui/react-dialog"
import { ReactNode, useState } from "react"
import { formatKey, formatValue } from "@/shared/lib/format-key-value"
import { Pen, Trash } from "lucide-react"
import ky from "ky"
import notify from "@/shared/hooks/use-notify"
import { uiConstants } from "@/shared/constants/global-constants"
import { useConfirmContext } from "@/shared/providers/confirm.provider"
import { useRouter } from "nextjs-toploader/app"
import { Button } from "../ui/button"
import { useAppContext } from "@/context/appstate.provider"
import { format } from "date-fns"

interface GoalModalProps {
  goalDetails: Goal
  children: ReactNode
}

const excludedKeys = ["_id", "userId", "createdAt"]

export function GoalModal({ goalDetails, children }: GoalModalProps) {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const [{ user }] = useAppContext()
  const { confirm } = useConfirmContext()

  const deleteGoal = async (): Promise<void> => {
    const confirmed = await confirm({
      title: "Delete Goal",
      desc: "Are you sure you want to delete this goal?",
    })

    if (confirmed) {
      try {
        await ky.delete(`${endPoints.goal}/${goalDetails._id}`)
        notify(uiConstants.goalDeleted, "success")
      } catch (error) {
        notify(uiConstants.genericError, "error")
      }
    }
  }

  const amountKeys = new Set<keyof Goal>(["goalAmount"])

  const isAmount = (key: keyof Goal): boolean => amountKeys.has(key)

  return (
    <Dialog open={open}>
      <DialogTrigger asChild onClick={() => setOpen(true)}>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-[25rem] bg-background border-border outline-none text-white -mb-4">
        <DialogHeader>
          <div className="flex justify-between">
            <div>
              <DialogTitle>{format(goalDetails?.goalDate, "PPP")}</DialogTitle>
              <DialogDescription></DialogDescription>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={(): void =>
                  router.push(
                    `/products/wealthgoal/editgoal/${goalDetails._id}`
                  )
                }
                variant="default"
                size="icon"
                className="p-2 bg-primary hover:bg-primary"
              >
                <Pen className="text-black h-4 w-4" />
              </Button>
              <Button onClick={deleteGoal} variant="destructive" size="icon">
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>
        <div className="grid gap-6">
          <ul className="grid gap-3 text-sm text-muted-foreground">
            {Object.entries(goalDetails ?? {})
              .filter(([key]) => !excludedKeys.includes(key))
              .map(([key, value]) => (
                <div key={key} className="flex justify-between items-center">
                  <strong>{formatKey(key)}</strong>{" "}
                  {formatValue(
                    value,
                    key.includes("Date"),
                    isAmount(key as keyof Goal),
                    user.baseCurrency,
                    key.includes("Rate")
                  )}
                </div>
              ))}
          </ul>
        </div>
        <DialogFooter>
          <Button variant="secondary" onClick={(): void => setOpen(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
