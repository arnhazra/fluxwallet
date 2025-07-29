import { Currency } from "@/shared/types"
import { Button } from "../ui/button"
import { PenIcon } from "lucide-react"
import { useState } from "react"
import {
  DialogHeader,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "../ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"
import { useAppContext } from "@/context/appstate.provider"
import ky from "ky"
import { endPoints } from "@/shared/constants/api-endpoints"
import { FETCH_TIMEOUT } from "@/shared/lib/fetch-timeout"
import { uiConstants } from "@/shared/constants/global-constants"
import notify from "@/shared/hooks/use-notify"

export default function EditCurrency({
  baseCurrency,
}: {
  baseCurrency: Currency
}) {
  const [open, setOpen] = useState(false)
  const [, dispatch] = useAppContext()
  const [value, setValue] = useState<Currency>(baseCurrency)

  const saveCurrency = async () => {
    try {
      dispatch("setUser", { baseCurrency: value })
      await ky.patch(endPoints.updateAttribute, {
        json: {
          attributeName: "baseCurrency",
          attributeValue: value,
        },
        timeout: FETCH_TIMEOUT,
      })
      setOpen(false)
    } catch (error) {
      notify(uiConstants.genericError, "error")
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="bg-primary hover:bg-primary"
          variant="default"
          size="icon"
        >
          <PenIcon className="scale-50" />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-main border-border">
        <DialogHeader>
          <DialogTitle className="text-white">Select Currency</DialogTitle>
          <p className="text-primary text-sm">
            This is the currency that will be applied throughout the app
          </p>
        </DialogHeader>
        <Select onValueChange={(value: Currency) => setValue(value)}>
          <SelectTrigger className="bg-main border-border text-white">
            <SelectValue placeholder={value} />
          </SelectTrigger>
          <SelectContent className="bg-main border-border text-white">
            {Object.values(Currency).map((item) => (
              <SelectItem value={item} key={item}>
                {item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <DialogFooter>
          <Button
            onClick={(): Promise<void> => saveCurrency()}
            variant="default"
            className="bg-primary hover:bg-primary"
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
