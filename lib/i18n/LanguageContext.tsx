"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { Language, dictionaries } from "./dictionaries"

type LanguageContextType = {
    language: Language
    setLanguage: (lang: Language) => void
    t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguageState] = useState<Language>("en")

    // Optional: Persist language preference in localStorage
    useEffect(() => {
        const saved = localStorage.getItem("preferredLanguage") as Language
        if (saved && Object.keys(dictionaries).includes(saved)) {
            setLanguageState(saved)
        }
    }, [])

    const setLanguage = (lang: Language) => {
        setLanguageState(lang)
        localStorage.setItem("preferredLanguage", lang)
    }

    const t = (key: string): string => {
        // Fallback to english if the key is missing in the current language
        return dictionaries[language]?.[key] || dictionaries.en[key] || key
    }

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    )
}

export function useTranslation() {
    const context = useContext(LanguageContext)
    if (context === undefined) {
        throw new Error("useTranslation must be used within a LanguageProvider")
    }
    return context
}
