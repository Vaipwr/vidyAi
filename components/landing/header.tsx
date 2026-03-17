"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { BookOpen, Menu, X, ChevronDown, Check } from "lucide-react"
import { useState, useEffect } from "react"
import { useTranslation } from "@/lib/i18n/LanguageContext"
import { Language } from "@/lib/i18n/dictionaries"

export function LandingHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { setLanguage, language: currentLang, t } = useTranslation()

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 lg:px-8">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
              <BookOpen className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">
              VidyAI<span className="text-primary">++</span>
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex lg:items-center lg:gap-8">
          <Link href="/dashboard/courses" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            {t("nav.courses")}
          </Link>
          <Link href="/dashboard/mentors" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            {t("nav.mentors")}
          </Link>
          <Link href="/dashboard/community" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            {t("nav.community")}
          </Link>
          {mounted && (
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                {t("nav.languages")} <ChevronDown className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="w-40">
                <DropdownMenuItem onClick={() => setLanguage("en")} className="justify-between">
                  English {currentLang === "en" && <Check className="h-4 w-4" />}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage("hi")} className="justify-between">
                  Hindi (हिंदी) {currentLang === "hi" && <Check className="h-4 w-4" />}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage("mr")} className="justify-between">
                  Marathi (मराठी) {currentLang === "mr" && <Check className="h-4 w-4" />}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage("ta")} className="justify-between">
                  Tamil (தமிழ்) {currentLang === "ta" && <Check className="h-4 w-4" />}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* CTA Button */}
        <div className="hidden lg:flex lg:items-center lg:gap-4">
          <Button asChild>
            <Link href="/dashboard">{t("nav.start")}</Link>
          </Button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="lg:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6 text-foreground" />
          ) : (
            <Menu className="h-6 w-6 text-foreground" />
          )}
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-border lg:hidden">
          <div className="space-y-1 px-4 py-4">
            <Link
              href="/dashboard/courses"
              className="block rounded-lg px-3 py-2 text-base font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t("nav.courses")}
            </Link>
            <Link
              href="/dashboard/mentors"
              className="block rounded-lg px-3 py-2 text-base font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t("nav.mentors")}
            </Link>
            <Link
              href="/dashboard/community"
              className="block rounded-lg px-3 py-2 text-base font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t("nav.community")}
            </Link>
            <div className="border-t border-border pt-4">
              <Link
                href="/dashboard"
                className="mt-2 block rounded-lg bg-primary px-3 py-2 text-center text-base font-medium text-primary-foreground"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t("nav.start")}
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
