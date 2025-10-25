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

interface GenericAgentReq {
  title: string | null | undefined
  description: string | null | undefined
  content: string | null | undefined
}

export default function NewsSummarizer({
  title,
  description,
  content,
}: GenericAgentReq) {
  const [open, setOpen] = useState(false)
  const [summarizedText, setSummarizedText] = useState("")

  const { data, isLoading } = useQuery<{ response: string | null | undefined }>(
    {
      queryKey: [
        "summarize-news",
        title ?? "",
        description ?? "",
        content ?? "",
      ],
      queryUrl: `${endPoints.finNews}/summarize`,
      method: HTTPMethods.POST,
      requestBody: { title, description, content },
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
          className="text-white font-semibold bg-purple hover:opacity-90 transition"
          variant="default"
          size="icon"
          title="Summarize this news"
        >
          <Sparkles className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[25rem] bg-background border-border outline-none text-white -mb-4 asset-modal">
        <DialogHeader>
          <DialogTitle className="flex gap-2 text-white">
            <Sparkles className="h-4 w-4 text-primary" />
            News Summarizer
          </DialogTitle>
        </DialogHeader>
        <div className="mt-2">
          <Show condition={isLoading || !summarizedText}>
            <p className="flex items-center text-md text-white">
              <LoaderIcon />
              Summarizing news...
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
