"use client"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select"
import { ScrollArea } from "@/shared/components/ui/scroll-area"
import { Bot, User, ArrowUp, Sparkles, Sparkle } from "lucide-react"
import { endPoints } from "@/shared/constants/api-endpoints"
import ky from "ky"
import { FETCH_TIMEOUT } from "@/shared/lib/fetch-timeout"
import { appName, defaultModel } from "@/shared/constants/global-constants"
import MarkdownRenderer from "@/shared/components/markdown"
import Show from "@/shared/components/show"
import { ModelConfig, Thread } from "@/shared/constants/types"
import { useUserContext } from "@/context/user.provider"
import { useSearchParams } from "next/navigation"
import useQuery from "@/shared/hooks/use-query"
import HTTPMethods from "@/shared/constants/http-methods"
import { useRouter } from "nextjs-toploader/app"
import IconContainer from "@/shared/components/icon-container"
import { streamResponseText } from "@/shared/lib/stream-response"

export default function Page() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const tId = searchParams.get("threadId")
  const [{ user }] = useUserContext()
  const [threadId, setThreadId] = useState<string | null>(tId)
  const [prompt, setPrompt] = useState("")
  const [messages, setMessages] = useState<string[]>([])
  const [isLoading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [model, setModel] = useState<string>(defaultModel)
  const thread = useQuery<Thread[]>({
    queryKey: ["get-thread", tId ?? ""],
    queryUrl: `${endPoints.oneagent}/thread/${tId}`,
    method: HTTPMethods.GET,
    suspense: tId !== null,
    enabled: tId !== null,
  })

  const models = useQuery<ModelConfig[]>({
    queryKey: ["getModelConfig"],
    queryUrl: endPoints.getModelConfig,
    method: HTTPMethods.GET,
    suspense: false,
  })

  useEffect(() => {
    setMessages(
      thread.data?.flatMap(({ prompt, response }) => [
        prompt ?? "",
        response ?? "",
      ]) ?? []
    )
  }, [thread?.data])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrompt(e.target.value)
  }

  const hitAPI = async (e: any) => {
    e.preventDefault()
    setMessages((prev) => [...prev, prompt])
    setPrompt("")
    setLoading(true)

    try {
      const res: Thread = await ky
        .post(`${endPoints.oneagent}/chat`, {
          json: { prompt, model, threadId: threadId ?? undefined },
          timeout: FETCH_TIMEOUT,
        })
        .json()

      if (!threadId) {
        setThreadId(res.threadId)
        router.replace(`/products/oneagent?threadId=${res.threadId}`)
      }

      setMessages((prevMessages) => [...prevMessages, ""])

      streamResponseText(res?.response ?? "", (chunk) => {
        setMessages((prevMessages) => {
          const newMessages = [...prevMessages]
          newMessages[newMessages.length - 1] = chunk
          return newMessages
        })
      })
    } catch (error: any) {
      setMessages((prevMessages) => [...prevMessages, "Request timed out"])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="h-full flex flex-col w-full max-w-4xl mx-auto">
      <ScrollArea
        className={`flex-1 p-4 overflow-y-auto ${
          messages.length > 0 ? "pb-32" : ""
        }`}
      >
        <div className="space-y-4">
          <Show condition={messages.length === 0}>
            <div className="text-center mt-8 max-w-xl mx-auto">
              <div className="flex justify-center mb-4">
                <IconContainer>
                  <Sparkles className="h-5 w-5" />
                </IconContainer>
              </div>
              <p className="text-primary">{appName} OneAgent</p>
              <p className="text-sm mt-2 text-white p-6">
                {appName} OneAgent is an agentic workflow powered by AI, so
                mistakes are possible. Please use carefully.
              </p>
              <p className="text-white text-xl sm:text-2xl md:text-3xl lg:text-3xl mt-4">
                What's on your mind, {user.name.split(" ")[0]}?
              </p>
            </div>
          </Show>

          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex items-start space-x-2 ${
                index % 2 === 0 ? "justify-end" : "justify-start"
              }`}
            >
              {index % 2 !== 0 && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-primary">
                  <Bot className="h-4 w-4 text-white" />
                </div>
              )}

              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  index % 2 === 0 ? "text-white" : "text-neutral-100"
                }`}
                style={{
                  backgroundColor: index % 2 === 0 ? "#32cd32" : "#121212",
                  border: index % 2 === 0 ? "none" : "1px solid #27272a",
                }}
              >
                <MarkdownRenderer key={index} markdown={message} />
              </div>

              {index % 2 === 0 && (
                <div
                  className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: "#3f3f46" }}
                >
                  <User className="h-4 w-4 text-white" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex items-start space-x-2">
              <div
                className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
                style={{ backgroundColor: "#32cd32" }}
              >
                <Bot className="h-4 w-4 text-white" />
              </div>
              <div
                className="p-3 rounded-lg"
                style={{
                  backgroundColor: "#121212",
                  border: "1px solid #27272a",
                }}
              >
                <div className="flex space-x-1">
                  <div className="w-1 h-1 bg-neutral-400 rounded-full animate-bounce"></div>
                  <div
                    className="w-1 h-1 bg-neutral-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-1 h-1 bg-neutral-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
      <div
        className={`p-4 border-none transition-all duration-300 ${
          messages.length === 0
            ? "flex-1 flex items-center justify-center"
            : "fixed w-full bottom-0 left-0"
        }`}
      >
        <form onSubmit={hitAPI} className="w-full max-w-3xl mx-auto">
          <div className="relative bg-neutral-900 border border-neutral-700 rounded-3xl p-2 ps-4 pe-4 shadow-lg">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <Input
                    autoFocus
                    value={prompt}
                    onChange={handleInputChange}
                    placeholder="Ask a Question or Command"
                    disabled={isLoading}
                    className="bg-transparent border-none text-neutral-300 placeholder:text-neutral-500 focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none outline-none ring-0 text-sm px-0"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isLoading || !prompt.trim()}
                  size="icon"
                  className="bg-neutral-700 hover:bg-neutral-600 text-white h-8 w-8 rounded-full"
                >
                  <ArrowUp className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex justify-start -ms-3">
                <Select
                  defaultValue={model}
                  onValueChange={(value: string) => setModel(value)}
                >
                  <SelectTrigger className="w-auto bg-transparent border-none text-neutral-300 hover:text-white focus:ring-0 focus:ring-offset-0">
                    <div className="flex items-center gap-2">
                      <Sparkle className="h-4 w-4 text-primary" />
                      <SelectValue />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="bg-neutral-800 border-neutral-700">
                    {models.data?.map((model) => (
                      <SelectItem
                        key={model.genericName}
                        value={model.genericName}
                        className="text-neutral-300 focus:bg-neutral-700 focus:text-white"
                      >
                        {model.displayName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
