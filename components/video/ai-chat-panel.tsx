"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Send, Sparkles, Clock, Volume2, Loader2, Share2, Check } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp?: number
}

interface AiChatPanelProps {
  videoId: string
  videoTitle: string
  currentTimestamp: number
  currentEmotion: string | null
  isConfused: boolean
}

const QUICK_PROMPTS = [
  { label: "Explain this concept", icon: Sparkles },
  { label: "Give me an example", icon: Sparkles },
  { label: "Summarize so far", icon: Clock },
  { label: "Quiz me on this", icon: Sparkles },
]

export function AiChatPanel({
  videoTitle,
  currentTimestamp,
  currentEmotion,
  isConfused,
}: AiChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: `Hello! I am your AI learning assistant. I am here to help you understand "${videoTitle}". Feel free to ask me any questions about the video content!`,
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState("en")
  const [streamingContent, setStreamingContent] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()
  const [sharingId, setSharingId] = useState<string | null>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, streamingContent])

  // Auto-suggest help when confused
  useEffect(() => {
    if (isConfused && messages[messages.length - 1]?.role !== "assistant") {
      const helpMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: `I noticed you might be having trouble understanding this part. At ${formatTime(currentTimestamp)}, the video discusses an important concept. Would you like me to explain it in a simpler way?`,
        timestamp: currentTimestamp,
      }
      setMessages((prev) => [...prev, helpMessage])
    }
  }, [isConfused, currentTimestamp, messages])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const handleSend = async (customMessage?: string) => {
    const messageText = customMessage || input.trim()
    if (!messageText || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: messageText,
      timestamp: currentTimestamp,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)
    setStreamingContent("")

    try {
      const response = await fetch("/api/ai/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          videoTitle,
          question: messageText,
          timestamp: currentTimestamp,
          emotion: currentEmotion,
          language: selectedLanguage,
          chatHistory: messages.slice(-6),
        }),
      })

      // Handle streaming response
      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let fullContent = ""

      if (reader) {
        try {
          while (true) {
            const { done, value } = await reader.read()
            if (done) break
            
            const chunk = decoder.decode(value, { stream: true })
            fullContent += chunk
            setStreamingContent(fullContent)
          }
        } catch {
          // Stream might be closed, use what we have
        }
      }

      // If we got content, use it; otherwise use the full response text
      if (!fullContent && response.ok) {
        fullContent = await response.text()
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: fullContent || "I am here to help! Please ask me any question about the video content.",
        timestamp: currentTimestamp,
      }

      setMessages((prev) => [...prev, assistantMessage])
      setStreamingContent("")
    } catch (error) {
      console.error("Error getting AI response:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I am ready to help you understand this topic! Please try asking your question again, or click one of the quick prompts below.",
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
      setStreamingContent("")
    }
  }

  const handleSpeak = (text: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = selectedLanguage === "hi" ? "hi-IN" : "en-US"
      speechSynthesis.speak(utterance)
    }
  }

  const handleShareToForum = async (message: Message) => {
    if (message.role !== "assistant") return
    setSharingId(message.id)
    
    try {
      const res = await fetch("/api/forum", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: `AI Explanation: ${videoTitle}`,
          content: message.content,
          category: "AI Explanations",
          isAiGenerated: true,
          videoTitle,
          timestamp: message.timestamp,
        }),
      })
      
      if (res.ok) {
        toast({
          title: "Shared to Community!",
          description: "Your AI explanation has been posted to the forum for others to learn from.",
        })
      }
    } catch (error) {
      console.error("Failed to share:", error)
      toast({
        title: "Failed to share",
        description: "Please try again.",
        variant: "destructive",
      })
    } finally {
      setSharingId(null)
    }
  }

  return (
    <div className="flex h-full flex-col border-l border-border bg-card">
      {/* Header */}
      <div className="border-b border-border p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">AI Learning Assistant</h3>
            <p className="text-xs text-muted-foreground">
              Ask me anything about this video
            </p>
          </div>
        </div>

        {/* Language Selector */}
        <div className="mt-3 flex gap-2">
          {[
            { code: "en", label: "English" },
            { code: "hi", label: "Hindi" },
            { code: "mr", label: "Marathi" },
            { code: "ta", label: "Tamil" },
          ].map((lang) => (
            <button
              key={lang.code}
              onClick={() => setSelectedLanguage(lang.code)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                selectedLanguage === lang.code
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {lang.label}
            </button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${
                message.role === "user" ? "flex-row-reverse" : ""
              }`}
            >
              <Avatar className="h-8 w-8 shrink-0">
                <AvatarFallback
                  className={
                    message.role === "assistant"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }
                >
                  {message.role === "assistant" ? "AI" : "You"}
                </AvatarFallback>
              </Avatar>
              <div
                className={`group relative max-w-[80%] rounded-2xl px-4 py-2 ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                {message.timestamp !== undefined && (
                  <p className="mt-1 text-xs opacity-60">
                    at {formatTime(message.timestamp)}
                  </p>
                )}
                {message.role === "assistant" && (
                  <div className="absolute -right-16 top-2 flex flex-col gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                    <button
                      onClick={() => handleSpeak(message.content)}
                      className="rounded p-1 hover:bg-muted"
                      title="Read aloud"
                    >
                      <Volume2 className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                    </button>
                    <button
                      onClick={() => handleShareToForum(message)}
                      className="rounded p-1 hover:bg-muted"
                      title="Share to community forum"
                      disabled={sharingId === message.id}
                    >
                      {sharingId === message.id ? (
                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                      ) : (
                        <Share2 className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
          {/* Streaming message */}
          {streamingContent && (
            <div className="flex gap-3">
              <Avatar className="h-8 w-8 shrink-0">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  AI
                </AvatarFallback>
              </Avatar>
              <div className="max-w-[80%] rounded-2xl bg-muted px-4 py-2">
                <p className="text-sm whitespace-pre-wrap">{streamingContent}</p>
              </div>
            </div>
          )}
          {isLoading && !streamingContent && (
            <div className="flex gap-3">
              <Avatar className="h-8 w-8 shrink-0">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  AI
                </AvatarFallback>
              </Avatar>
              <div className="flex items-center gap-2 rounded-2xl bg-muted px-4 py-3">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm text-muted-foreground">Thinking...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Quick Prompts */}
      <div className="border-t border-border px-4 py-2">
        <div className="flex flex-wrap gap-2">
          {QUICK_PROMPTS.map((prompt) => (
            <button
              key={prompt.label}
              onClick={() => handleSend(prompt.label)}
              disabled={isLoading}
              className="flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground transition-colors hover:bg-secondary/80 disabled:opacity-50"
            >
              <prompt.icon className="h-3 w-3" />
              {prompt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-border p-4">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSend()
          }}
          className="flex gap-2"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button type="submit" size="icon" disabled={!input.trim() || isLoading}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  )
}
