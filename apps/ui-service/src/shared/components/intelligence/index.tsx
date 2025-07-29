"use client"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { ScrollArea } from "@/shared/components/ui/scroll-area"
import { X, Send, Bot, User, Sparkles } from "lucide-react"
import { endPoints } from "@/shared/constants/api-endpoints"
import ky from "ky"
import { FETCH_TIMEOUT } from "@/shared/lib/fetch-timeout"
import { appName } from "@/shared/constants/global-constants"
import MarkdownRenderer from "../markdown"

export default function Intelligence() {
  const [isOpen, setIsOpen] = useState(false)
  const [threadId, setThreadId] = useState(null)
  const [prompt, setPrompt] = useState("")
  const [isLoading, setLoading] = useState(false)
  const [messages, setMessages] = useState<string[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)

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
      const res: any = await ky
        .post(`${endPoints.intelligence}`, {
          json: { prompt, threadId: threadId ?? undefined },
          timeout: FETCH_TIMEOUT,
        })
        .json()

      if (!threadId) {
        setThreadId((res as any).threadId)
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
        <Sparkles className="scale-75 text-white" />
      </Button>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div
        className={`fixed top-0 bg-main right-0 h-full w-full sm:w-96 transform transition-transform duration-300 ease-in-out z-50 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-none">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <h2 className="text-md font-semibold text-white">
              {appName} Intelligence
            </h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(false)}
            className="text-zinc-400 hover:text-white bg-none hover:bg-background"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <ScrollArea className="flex-1 h-[calc(100vh-140px)] p-4">
          <div className="space-y-4">
            {messages.length === 0 && (
              <div className="text-center mt-8">
                <Sparkles className="h-12 w-12 mx-auto mb-4 text-primary" />
                <p className="text-primary">{appName} Intelligence</p>
                <p className="text-sm mt-2 text-white">
                  I can assist you today regarding your portfolio
                </p>
              </div>
            )}

            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex items-start space-x-2 ${index % 2 === 0 ? "justify-end" : "justify-start"}`}
              >
                {index % 2 !== 0 && (
                  <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-primary">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                )}

                <div
                  className={`max-w-[80%] p-3 rounded-lg ${index % 2 === 0 ? "text-white" : "text-zinc-100"}`}
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
                    <div className="w-1 h-1 bg-zinc-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-1 h-1 bg-zinc-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-1 h-1 bg-zinc-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        <div className="p-4" style={{ borderColor: "#27272a" }}>
          <form onSubmit={hitAPI} className="flex space-x-2">
            <Input
              value={prompt}
              onChange={handleInputChange}
              placeholder="Ask anything..."
              disabled={isLoading}
              className="h-11 flex-1 bg-transparent border text-white placeholder-zinc-400 focus:ring-1"
              style={{
                borderColor: "#3f3f46",
                backgroundColor: "#121212",
              }}
            />
            <Button
              type="submit"
              disabled={isLoading || !prompt.trim()}
              className="h-11 px-3"
              style={{ backgroundColor: "#32cd32" }}
            >
              <Send className="scale-75 text-white" />
            </Button>
          </form>
        </div>
      </div>
    </>
  )
}
