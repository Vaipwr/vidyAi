"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play, Sparkles, Brain, Globe, ArrowRight } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog"

export function LandingHero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background px-4 py-20 lg:py-32">
      {/* Background decorations */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/4 top-20 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute right-1/4 top-40 h-64 w-64 rounded-full bg-accent/20 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">AI-Powered Learning Platform</span>
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                <span className="text-balance">Learn in Your</span>{" "}
                <span className="bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
                  Mother Tongue
                </span>
              </h1>
              <p className="max-w-xl text-lg leading-relaxed text-muted-foreground text-pretty">
                VidyAI++ uses AI to detect when you are confused and provides instant explanations
                in your preferred language. Education that understands you.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <Button size="lg" className="gap-2 text-base" asChild>
                <Link href="/register">
                  Start Learning Free
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="lg" variant="outline" className="gap-2 text-base">
                    <Play className="h-5 w-5" />
                    Watch Demo
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl p-0 overflow-hidden bg-black/95 border-none">
                  <DialogTitle className="sr-only">Platform Demo Video</DialogTitle>
                  <div className="aspect-video w-full">
                    <video
                      controls
                      autoPlay
                      className="h-full w-full object-contain"
                    >
                      <source src="/AI_Powered_Learning_Platform_Features.mp4" type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Feature Pills */}
            <div className="flex flex-wrap gap-3 pt-4">
              <Badge variant="secondary" className="gap-1.5 px-3 py-1.5 text-sm">
                <Brain className="h-4 w-4 text-primary" />
                Emotion Detection
              </Badge>
              <Badge variant="secondary" className="gap-1.5 px-3 py-1.5 text-sm">
                <Globe className="h-4 w-4 text-accent" />
                10+ Indian Languages
              </Badge>
              <Badge variant="secondary" className="gap-1.5 px-3 py-1.5 text-sm">
                <Sparkles className="h-4 w-4 text-primary" />
                AI Explanations
              </Badge>
            </div>
          </div>

          {/* Right Content - Hero Illustration */}
          <div className="relative">
            <div className="relative mx-auto aspect-square max-w-lg">
              {/* Main Card */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/20 to-accent/20 p-1">
                <div className="h-full w-full rounded-3xl bg-card p-6 shadow-2xl">
                  {/* Video Preview Area */}
                  <div className="relative aspect-video overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10">
                    <video
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="absolute inset-0 h-full w-full object-cover"
                      poster="/placeholder-video-poster.jpg"
                    >
                      <source src="/AI_Powered_Learning_Platform_Features.mp4" type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                    {/* Emotion Indicator */}
                    <div className="absolute right-3 top-3 flex items-center gap-2 rounded-full bg-card/90 px-3 py-1.5 backdrop-blur z-10">
                      <span className="relative flex h-2.5 w-2.5">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75"></span>
                        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-success"></span>
                      </span>
                      <span className="text-xs font-medium text-foreground">Engaged</span>
                    </div>
                  </div>

                  {/* AI Chat Preview */}
                  <div className="mt-4 space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary">
                        <Sparkles className="h-4 w-4 text-primary-foreground" />
                      </div>
                      <div className="rounded-2xl rounded-tl-none bg-muted p-3">
                        <p className="text-sm text-muted-foreground">
                          I noticed you paused. Would you like me to explain this concept in Hindi?
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2 pl-11">
                      <Button size="sm" variant="outline" className="h-8 rounded-full text-xs">
                        Yes, explain
                      </Button>
                      <Button size="sm" variant="ghost" className="h-8 rounded-full text-xs">
                        Continue
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -left-4 top-1/4 animate-bounce rounded-2xl bg-card p-3 shadow-lg" style={{ animationDuration: "3s" }}>
                <div className="flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/20">
                    <span className="text-lg">हिंदी</span>
                  </div>
                </div>
              </div>

              <div className="absolute -right-4 top-1/3 animate-bounce rounded-2xl bg-card p-3 shadow-lg" style={{ animationDuration: "4s", animationDelay: "1s" }}>
                <div className="flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20">
                    <span className="text-lg">मराठी</span>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-2 left-1/4 animate-bounce rounded-2xl bg-card p-3 shadow-lg" style={{ animationDuration: "3.5s", animationDelay: "0.5s" }}>
                <div className="flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success/20">
                    <span className="text-lg">தமிழ்</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
