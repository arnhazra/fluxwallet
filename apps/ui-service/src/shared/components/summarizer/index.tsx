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
      enabled: open,
    }
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="text-white font-semibold
             bg-gradient-to-r from-[#3a7bd5] to-[#3a6073]
             hover:opacity-90 transition"
          variant="default"
          size="icon"
          title="Summarize"
        >
          <Sparkles className="h-4 w-4" />
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
          <Show condition={!isLoading} fallback="Summarizing...">
            <MarkdownRenderer markdown={data?.response ?? ""} />
          </Show>
        </div>
        <DialogFooter>
          <Button
            onClick={(): void => setOpen(false)}
            variant="secondary"
            className="text-black"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
