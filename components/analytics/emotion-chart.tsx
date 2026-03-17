"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

interface EmotionData {
  emotion: string
  count: number
  avg_confidence: number
}

interface EmotionChartProps {
  data: EmotionData[]
}

const EMOTION_COLORS: Record<string, string> = {
  happy: "#22c55e",
  neutral: "#6366f1",
  confused: "#f59e0b",
  sad: "#64748b",
  surprised: "#ec4899",
  angry: "#ef4444",
  fearful: "#8b5cf6",
  disgusted: "#f97316",
}

export function EmotionChart({ data }: EmotionChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-muted-foreground">
        No emotion data available yet. Start watching videos with emotion detection enabled!
      </div>
    )
  }

  const chartData = data.map((item) => ({
    name: item.emotion.charAt(0).toUpperCase() + item.emotion.slice(1),
    value: item.count,
    color: EMOTION_COLORS[item.emotion] || "#94a3b8",
  }))

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={2}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
            }}
            formatter={(value: number) => [`${value} times`, "Detected"]}
          />
          <Legend
            verticalAlign="middle"
            align="right"
            layout="vertical"
            iconType="circle"
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
