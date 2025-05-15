"use client"
import {
  Bar,
  Line,
  BarChart as RechartsBarChart,
  LineChart as RechartsLineChart,
  XAxis as RechartsXAxis,
  YAxis as RechartsYAxis,
  CartesianGrid as RechartsCartesianGrid,
  Tooltip as RechartsTooltip,
  Legend as RechartsLegend,
  ResponsiveContainer as RechartsResponsiveContainer,
} from "recharts"

// Re-export Recharts components
export {
  Bar,
  Line,
  RechartsBarChart as BarChart,
  RechartsLineChart as LineChart,
  RechartsXAxis as XAxis,
  RechartsYAxis as YAxis,
  RechartsCartesianGrid as CartesianGrid,
  RechartsTooltip as Tooltip,
  RechartsLegend as Legend,
  RechartsResponsiveContainer as ResponsiveContainer,
}

// Custom tooltip component
export const ChartTooltip = ({ active, payload, label, ...props }: any) => {
  if (!active || !payload?.length) {
    return null
  }

  return (
    <div className="rounded-lg border bg-background p-2 shadow-sm">
      <div className="grid grid-cols-2 gap-2">
        <div className="flex flex-col">
          <span className="text-[0.70rem] uppercase text-muted-foreground">{label}</span>
          <span className="font-bold text-muted-foreground">{payload[0].value}</span>
        </div>
      </div>
    </div>
  )
}
