"use client"
import { useState, useRef, useEffect, FormEventHandler } from "react"
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
import { PanelRightClose, Bot, User, ArrowUp, BrainCircuit } from "lucide-react"
import { endPoints } from "@/shared/constants/api-endpoints"
import ky from "ky"
import { FETCH_TIMEOUT } from "@/shared/lib/fetch-timeout"
import { appName } from "@/shared/constants/global-constants"
import MarkdownRenderer from "../markdown"
import Show from "../show"
import { suggestedPrompts } from "./suggested-prompts"
import { Badge } from "../ui/badge"
import { Thread } from "@/shared/types"

enum Model {
  Gemini = "gemini-2.5-flash-lite",
  GPT = "openai/gpt-4o-mini",
}

export default function Intelligence() {
  const [isOpen, setIsOpen] = useState(false)
  const [threadId, setThreadId] = useState<string | null>(null)
  const [prompt, setPrompt] = useState("")
  const [isLoading, setLoading] = useState(false)
  const [messages, setMessages] = useState<string[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [model, setModel] = useState<Model>(Model.Gemini)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrompt(e.target.value)
  }

  const streamResponseText = (
    fullText: string,
    callback: (chunk: string) => void,
    delay = 40
  ) => {
    let i = 0
    const words = fullText.split(" ")
    const interval = setInterval(() => {
      if (i < words.length) {
        callback(words.slice(0, i + 1).join(" ") + " ")
        i++
      } else {
        clearInterval(interval)
      }
    }, delay)
  }

  const hitAPI = async (e: any) => {
    e.preventDefault()
    setMessages((prev) => [...prev, prompt])
    setPrompt("")
    setLoading(true)

    try {
      const res: Thread = await ky
        .post(`${endPoints.intelligence}`, {
          json: { prompt, model, threadId: threadId ?? undefined },
          timeout: FETCH_TIMEOUT,
        })
        .json()

      if (!threadId) {
        setThreadId(res.threadId)
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
      setMessages((prevMessages) => [...prevMessages, "An error occurred"])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        variant="default"
        size="icon"
        className="h-12 w-12 fixed bottom-6 right-6 z-50 bg-primary hover:bg-primary rounded-full"
      >
        <BrainCircuit className="h-4 w-4 text-white" />
      </Button>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div
        className={`fixed top-0 bg-background right-0 h-full w-full sm:w-96 flex flex-col transition-transform duration-300 ease-in-out z-50 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-none">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(false)}
            className="text-neutral-400 hover:text-white bg-none hover:bg-background"
          >
            <PanelRightClose className="h-5 w-5" />
          </Button>
        </div>

        <ScrollArea className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-4">
            <Show condition={messages.length === 0}>
              <div className="text-center mt-8">
                <BrainCircuit className="h-12 w-12 mx-auto mb-4 text-primary" />
                <p className="text-primary">{appName} Intelligence</p>
                <p className="text-sm mt-2 text-white p-6">
                  {appName} Intelligence is an agentic workflow powered by AI,
                  so mistakes are possible. Please use carefully.
                </p>
                <p className="text-sm mt-2 text-neutral-400 mb-4">
                  Try these actions
                </p>
                {suggestedPrompts.map((item, index) => (
                  <Badge
                    key={index}
                    className="text-primary bg-neutral-800 p-1 ps-4 pe-4 ms-2 mb-2 cursor-pointer"
                    onClick={(e): void => {
                      setPrompt(item)
                    }}
                  >
                    {item}
                  </Badge>
                ))}
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

        <div className="p-4 border-none">
          <form onSubmit={hitAPI}>
            <div className="w-full max-w-4xl mx-auto">
              <div className="relative bg-neutral-900 border border-neutral-700 rounded-2xl p-2 ps-4 pe-4 shadow-lg">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <Input
                        autoFocus
                        value={prompt}
                        onChange={handleInputChange}
                        placeholder="Ask anything..."
                        disabled={isLoading}
                        className="bg-transparent border-none text-neutral-300 placeholder:text-neutral-500 focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none outline-none ring-0 text-sm px-0"
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={isLoading || !prompt.trim()}
                      size="icon"
                      className="bg-neutral-700 hover:bg-neutral-600 text-white h-8 w-8"
                    >
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex justify-start -ms-3">
                    <Select
                      defaultValue={Model.Gemini}
                      onValueChange={(value: Model) => setModel(value)}
                    >
                      <SelectTrigger className="w-auto bg-transparent border-none text-neutral-300 hover:text-white focus:ring-0 focus:ring-offset-0">
                        <div className="flex items-center gap-2">
                          <BrainCircuit className="h-4 w-4 text-primary" />
                          <SelectValue />
                        </div>
                      </SelectTrigger>
                      <SelectContent className="bg-neutral-800 border-neutral-700">
                        <SelectItem
                          value={Model.Gemini}
                          className="text-neutral-300 focus:bg-neutral-700 focus:text-white"
                        >
                          Gemini 2.5
                        </SelectItem>
                        <SelectItem
                          value={Model.GPT}
                          className="text-neutral-300 focus:bg-neutral-700 focus:text-white"
                        >
                          GPT 4o
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
