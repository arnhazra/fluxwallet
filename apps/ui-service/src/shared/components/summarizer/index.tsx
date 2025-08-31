import { Button } from "../ui/button"
import { Sparkles } from "lucide-react"
import { useState } from "react"
import {
  DialogHeader,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "../ui/dialog"
import useQuery from "@/shared/hooks/use-query"
import { endPoints } from "@/shared/constants/api-endpoints"
import HTTPMethods from "@/shared/constants/http-methods"
import Show from "../show"
import IconContainer from "../icon-container"
import MarkdownRenderer from "../markdown"

interface GenericAgentReq {
  entityId: string
  entityType: string
}

export default function Summarizer({ entityType, entityId }: GenericAgentReq) {
  const [open, setOpen] = useState(false)

  const { data, isLoading } = useQuery<{ response: string | null | undefined }>(
    {
      queryKey: ["summarize", entityType, entityId],
      queryUrl: `${endPoints.intelligence}/summarize`,
      method: HTTPMethods.POST,
      requestBody: { entityType, entityId },
      suspense: false,
    }
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="ps-4 pe-4 bg-primary hover:bg-primary text-black border border-border shadow-lg shadow-primary/10"
          variant="default"
          size="sm"
        >
          <Sparkles className="h-3 w-3 me-2" />
          Summarize
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[25rem] bg-background border-border outline-none text-white -mb-4 asset-modal">
        <DialogHeader>
          <DialogTitle className="flex gap-2 text-white">
            <Sparkles className="h-4 w-4 text-primary" />
            Summarizer
          </DialogTitle>
        </DialogHeader>
        <div className="mt-2">
          <Show condition={!isLoading} fallback="Loading...">
            <MarkdownRenderer markdown={data?.response ?? ""} />
          </Show>
        </div>
        <DialogFooter>
          <Button
            onClick={(): void => setOpen(false)}
            variant="default"
            className="bg-primary hover:bg-primary text-black"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
