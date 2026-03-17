"use client"

import { useState } from "react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"

interface EmotionTrendData {
  date: string
  happy: number
  neutral: number
  confused: number
  focused: number
}

interface EmotionTrendChartProps {
  data?: EmotionTrendData[]
}

// Multilingual tooltips
const tooltipTranslations: Record<string, Record<string, string>> = {
  en: {
    happy: "Happy - You were enjoying the content!",
    neutral: "Neutral - Steady focus maintained",
    confused: "Confused - Consider reviewing this topic",
    focused: "Focused - Great concentration!",
    improvement: "Your focus has improved by",
    suggestion: "Try taking breaks when confusion increases",
  },
  hi: {
    happy: "खुश - आप सामग्री का आनंद ले रहे थे!",
    neutral: "तटस्थ - स्थिर ध्यान बनाए रखा",
    confused: "भ्रमित - इस विषय की समीक्षा करने पर विचार करें",
    focused: "केंद्रित - बढ़िया एकाग्रता!",
    improvement: "आपकी एकाग्रता में सुधार हुआ है",
    suggestion: "भ्रम बढ़ने पर ब्रेक लेने का प्रयास करें",
  },
  mr: {
    happy: "आनंदी - तुम्हाला सामग्री आवडली!",
    neutral: "तटस्थ - स्थिर लक्ष राखले",
    confused: "गोंधळलेले - हा विषय पुन्हा पहा",
    focused: "केंद्रित - उत्तम एकाग्रता!",
    improvement: "तुमची एकाग्रता सुधारली आहे",
    suggestion: "गोंधळ वाढल्यावर विश्रांती घ्या",
  },
  ta: {
    happy: "மகிழ்ச்சி - உள்ளடக்கத்தை ரசித்தீர்கள்!",
    neutral: "நடுநிலை - நிலையான கவனம்",
    confused: "குழப்பம் - இந்த தலைப்பை மறுபரிசீலனை செய்யுங்கள்",
    focused: "கவனம் - சிறந்த ஒருமுகப்படுத்தல்!",
    improvement: "உங்கள் கவனம் மேம்பட்டது",
    suggestion: "குழப்பம் அதிகரிக்கும் போது இடைவெளி எடுங்கள்",
  },
}

const COLORS = {
  happy: "#22c55e",
  neutral: "#6366f1",
  confused: "#f59e0b",
  focused: "#0ea5e9",
}

// Sample data for demonstration
const sampleData: EmotionTrendData[] = [
  { date: "Mon", happy: 65, neutral: 20, confused: 10, focused: 55 },
  { date: "Tue", happy: 70, neutral: 15, confused: 8, focused: 60 },
  { date: "Wed", happy: 55, neutral: 25, confused: 15, focused: 45 },
  { date: "Thu", happy: 80, neutral: 10, confused: 5, focused: 70 },
  { date: "Fri", happy: 75, neutral: 12, confused: 8, focused: 65 },
  { date: "Sat", happy: 85, neutral: 8, confused: 4, focused: 75 },
  { date: "Sun", happy: 60, neutral: 20, confused: 12, focused: 50 },
]

export function EmotionTrendChart({ data = sampleData }: EmotionTrendChartProps) {
  const [language, setLanguage] = useState("en")
  const t = tooltipTranslations[language] || tooltipTranslations.en

  const CustomTooltip = ({ active, payload, label }: { 
    active?: boolean
    payload?: Array<{ name: string; value: number; color: string }>
    label?: string
  }) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border border-border bg-card p-3 shadow-lg">
          <p className="mb-2 font-medium">{label}</p>
          {payload.map((entry) => (
            <div key={entry.name} className="flex items-center gap-2 text-sm">
              <div
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-muted-foreground">
                {t[entry.name as keyof typeof t] || entry.name}: {entry.value}%
              </span>
            </div>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-4">
      {/* Language Selector */}
      <div className="flex gap-2">
        {[
          { code: "en", label: "English" },
          { code: "hi", label: "Hindi" },
          { code: "mr", label: "Marathi" },
          { code: "ta", label: "Tamil" },
        ].map((lang) => (
          <button
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              language === lang.code
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {lang.label}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="date" className="text-xs" />
            <YAxis className="text-xs" />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              type="monotone"
              dataKey="happy"
              stroke={COLORS.happy}
              strokeWidth={2}
              dot={{ fill: COLORS.happy }}
            />
            <Line
              type="monotone"
              dataKey="focused"
              stroke={COLORS.focused}
              strokeWidth={2}
              dot={{ fill: COLORS.focused }}
            />
            <Line
              type="monotone"
              dataKey="confused"
              stroke={COLORS.confused}
              strokeWidth={2}
              dot={{ fill: COLORS.confused }}
            />
            <Line
              type="monotone"
              dataKey="neutral"
              stroke={COLORS.neutral}
              strokeWidth={2}
              dot={{ fill: COLORS.neutral }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Insight Card */}
      <div className="rounded-lg bg-muted/50 p-4">
        <h4 className="font-medium text-foreground">
          {language === "hi" ? "AI अंतर्दृष्टि" : language === "mr" ? "AI अंतर्दृष्टी" : "AI Insight"}
        </h4>
        <p className="mt-1 text-sm text-muted-foreground">
          {t.improvement} 15% {language === "hi" ? "इस सप्ताह।" : language === "mr" ? "या आठवड्यात." : "this week."} {t.suggestion}
        </p>
      </div>
    </div>
  )
}
