"use client"

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

// Sample data - in real app this would come from API
const data = [
  { week: "Week 1", videos: 8, quizzes: 3, hours: 4.5 },
  { week: "Week 2", videos: 12, quizzes: 5, hours: 6.2 },
  { week: "Week 3", videos: 10, quizzes: 4, hours: 5.8 },
  { week: "Week 4", videos: 15, quizzes: 7, hours: 8.1 },
]

export function LearningProgressChart() {
  // Using direct hex colors instead of CSS variables for Recharts
  const primaryColor = "#4f6bf5"
  const accentColor = "#22c55e"

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="week"
            tick={{ fill: "#6b7280", fontSize: 12 }}
            axisLine={{ stroke: "#e5e7eb" }}
          />
          <YAxis
            tick={{ fill: "#6b7280", fontSize: 12 }}
            axisLine={{ stroke: "#e5e7eb" }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#ffffff",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
            }}
          />
          <Area
            type="monotone"
            dataKey="videos"
            stackId="1"
            stroke={primaryColor}
            fill={primaryColor}
            fillOpacity={0.6}
            name="Videos Watched"
          />
          <Area
            type="monotone"
            dataKey="quizzes"
            stackId="2"
            stroke={accentColor}
            fill={accentColor}
            fillOpacity={0.6}
            name="Quizzes Completed"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
