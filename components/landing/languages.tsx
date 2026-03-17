"use client"

import { useTranslation } from "@/lib/i18n/LanguageContext"
import { Language } from "@/lib/i18n/dictionaries"

const languages = [
  { code: "en", name: "English", native: "English", speakers: "125M+" },
  { code: "hi", name: "Hindi", native: "हिंदी", speakers: "600M+" },
  { code: "mr", name: "Marathi", native: "मराठी", speakers: "83M+" },
  { code: "ta", name: "Tamil", native: "தமிழ்", speakers: "78M+" },
  { code: "te", name: "Telugu", native: "తెలుగు", speakers: "82M+" },
  { code: "bn", name: "Bengali", native: "বাংলা", speakers: "230M+" },
  { code: "gu", name: "Gujarati", native: "ગુજરાતી", speakers: "56M+" },
  { code: "kn", name: "Kannada", native: "ಕನ್ನಡ", speakers: "44M+" },
  { code: "ml", name: "Malayalam", native: "മലയാളം", speakers: "38M+" },
  { code: "pa", name: "Punjabi", native: "ਪੰਜਾਬੀ", speakers: "113M+" },
  { code: "or", name: "Odia", native: "ଓଡ଼ିଆ", speakers: "35M+" },
  { code: "as", name: "Assamese", native: "অসমীয়া", speakers: "15M+" },
]

export function LandingLanguages() {
  const { setLanguage, t, language: currentLanguage } = useTranslation()

  const handleLanguageClick = (code: string) => {
    setLanguage(code as Language)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <section className="bg-gradient-to-b from-muted/30 to-background px-4 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance">
            {t("langs.title1")} <span className="text-primary">{t("langs.title2")}</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground text-pretty">
            {t("langs.desc")}
          </p>
        </div>

        {/* Languages Grid */}
        <div className="mt-12 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageClick(lang.code)}
              className={`group flex w-full items-center gap-4 rounded-xl border text-left p-4 transition-all hover:shadow-md ${currentLanguage === lang.code
                  ? "border-primary bg-primary/5 shadow-sm"
                  : "border-border bg-card hover:border-primary/50"
                }`}
            >
              <div className={`flex h-12 w-12 items-center justify-center rounded-lg text-xl font-semibold ${currentLanguage === lang.code
                  ? "bg-primary text-primary-foreground"
                  : "bg-primary/10 text-primary"
                }`}>
                {lang.native.charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-foreground">{lang.native}</p>
                <p className="text-sm text-muted-foreground">{lang.name}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Bottom Note */}
        <p className="mt-8 text-center text-sm text-muted-foreground">
          {t("langs.more")}
        </p>
      </div>
    </section>
  )
}
