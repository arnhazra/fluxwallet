"use client"
import { useChat } from "@ai-sdk/react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { ScrollArea } from "@/shared/components/ui/scroll-area"
import { X, Send, Bot, User, Atom } from "lucide-react"
import { endPoints } from "@/shared/constants/api-endpoints"
import { brandName } from "@/shared/constants/global-constants"

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({ api: endPoints.intelligence })
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (input.trim()) {
      handleSubmit(e)
    }
  }

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        variant="default"
        size="default"
        className="h-12 w-12 fixed bottom-6 right-6 z-50 bg-primary hover:bg-primary text-black rounded-full"
      >
        <Atom />
      </Button>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-96 transform transition-transform duration-300 ease-in-out z-50 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ backgroundColor: "#18181b" }}
      >
        <div
          className="flex items-center justify-between p-4 border-b"
          style={{ borderColor: "#27272a" }}
        >
          <div className="flex items-center space-x-2">
            <Atom className="scale-75" style={{ color: "#32cd32" }} />
            <h2 className="text-md font-semibold text-white">
              {brandName} Intelligence
            </h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-white"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <ScrollArea className="flex-1 h-[calc(100vh-140px)] p-4">
          <div className="space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-gray-400 mt-8">
                <Bot
                  className="h-12 w-12 mx-auto mb-4"
                  style={{ color: "#32cd32" }}
                />
                <p>Hello! I'm your Portfolio assistant.</p>
                <p className="text-sm mt-2">How can I help you today?</p>
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start space-x-2 ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {message.role === "assistant" && (
                  <div
                    className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: "#32cd32" }}
                  >
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                )}

                <div
                  className={`max-w-[80%] p-3 rounded-lg ${message.role === "user" ? "text-white" : "text-gray-100"}`}
                  style={{
                    backgroundColor:
                      message.role === "user" ? "#32cd32" : "#121212",
                    border:
                      message.role === "user" ? "none" : "1px solid #27272a",
                  }}
                >
                  <div className="whitespace-pre-wrap text-sm">
                    {message.content}
                  </div>
                </div>

                {message.role === "user" && (
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
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        <div className="p-4 border-t" style={{ borderColor: "#27272a" }}>
          <form onSubmit={onSubmit} className="flex space-x-2">
            <Input
              value={input}
              onChange={handleInputChange}
              placeholder="Type your message..."
              disabled={isLoading}
              className="flex-1 bg-transparent border text-white placeholder-gray-400 focus:ring-1"
              style={{
                borderColor: "#3f3f46",
                backgroundColor: "#121212",
              }}
            />
            <Button
              type="submit"
              disabled={isLoading || !input.trim()}
              size="sm"
              className="px-3"
              style={{ backgroundColor: "#32cd32" }}
            >
              <Send className="h-4 w-4 text-white" />
            </Button>
          </form>
        </div>
      </div>
    </>
  )
}
