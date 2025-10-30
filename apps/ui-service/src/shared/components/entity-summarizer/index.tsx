import { Button } from "../ui/button"
import { Sparkles } from "lucide-react"
import { useEffect, useState } from "react"
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
import LoaderIcon from "../loaderIcon"
import { streamResponseText } from "@/shared/lib/stream-response"
import IconContainer from "../icon-container"
import { EntityType } from "../entity-card/data"

interface SummarizerProps {
  entityId: string
  entityType: EntityType
  newsTitle?: string | null
  newsDescription?: string | null
  newsContent?: string | null
}

export default function Summarizer({
  entityType,
  entityId,
  newsTitle,
  newsDescription,
  newsContent,
}: SummarizerProps) {
  const [open, setOpen] = useState(false)
  const [summarizedText, setSummarizedText] = useState("")

  const { data, isLoading } = useQuery<{ response: string | null | undefined }>(
    {
      queryKey: ["summarize", entityType, entityId, newsTitle ?? ""],
      queryUrl: `${endPoints.intelligence}/summarize`,
      method: HTTPMethods.POST,
      requestBody: {
        entityType,
        entityId,
        newsTitle,
        newsDescription,
        newsContent,
      },
      suspense: false,
      enabled: open && !summarizedText,
    }
  )

  const close = () => {
    setOpen(false)
    setSummarizedText("")
  }

  useEffect(() => {
    if (!isLoading && !data?.response) return
    streamResponseText(data?.response ?? "", (chunk) => {
      setSummarizedText(chunk)
    })
  }, [data, isLoading])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="text-white font-semibold ui-soft-gradient hover:opacity-90 transition"
          variant="default"
          size="icon"
          title="Summarize"
        >
          <Sparkles className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[25rem] bg-background border-border outline-none text-white -mb-4 asset-modal">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-white">
            <IconContainer ai>
              <Sparkles className="h-4 w-4" />
            </IconContainer>
            Summarizer
          </DialogTitle>
        </DialogHeader>
        <div className="mt-2">
          <Show condition={isLoading || !summarizedText}>
            <p className="flex items-center text-md text-white">
              <LoaderIcon />
              Summarizing {entityType}...
            </p>
          </Show>
          <Show condition={!isLoading && !!summarizedText}>
            <MarkdownRenderer markdown={summarizedText ?? ""} />
          </Show>
        </div>
        <DialogFooter>
          <Button onClick={close} variant="secondary" className="text-black">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
