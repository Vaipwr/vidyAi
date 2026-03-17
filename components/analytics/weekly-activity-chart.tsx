"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

// Sample data - in real app this would come from API
const data = [
  { day: "Mon", hours: 2.5, target: 2 },
  { day: "Tue", hours: 1.8, target: 2 },
  { day: "Wed", hours: 3.2, target: 2 },
  { day: "Thu", hours: 2.1, target: 2 },
  { day: "Fri", hours: 1.5, target: 2 },
  { day: "Sat", hours: 4.2, target: 3 },
  { day: "Sun", hours: 3.8, target: 3 },
]

export function WeeklyActivityChart() {
  // Using direct hex colors instead of CSS variables for Recharts
  const primaryColor = "#4f6bf5"
  const mutedColor = "#e5e7eb"

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
          <XAxis
            dataKey="day"
            tick={{ fill: "#6b7280", fontSize: 12 }}
            axisLine={{ stroke: "#e5e7eb" }}
          />
          <YAxis
            tick={{ fill: "#6b7280", fontSize: 12 }}
            axisLine={{ stroke: "#e5e7eb" }}
            label={{ value: "Hours", angle: -90, position: "insideLeft", fill: "#6b7280" }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#ffffff",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
            }}
            formatter={(value: number, name: string) => [
              `${value}h`,
              name === "hours" ? "Study Time" : "Target",
            ]}
          />
          <Bar
            dataKey="target"
            fill={mutedColor}
            radius={[4, 4, 0, 0]}
            name="Target"
          />
          <Bar
            dataKey="hours"
            fill={primaryColor}
            radius={[4, 4, 0, 0]}
            name="Actual"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
