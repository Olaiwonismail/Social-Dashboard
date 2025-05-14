"use client"

import { Pie, PieChart, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts"

interface TrafficSource {
  source: string
  views: number
}

interface TrafficSourcesProps {
  data: TrafficSource[]
}

// Function to get a readable name for traffic sources
const getSourceName = (source: string) => {
  const sourceMap: Record<string, string> = {
    YT_SEARCH: "YouTube Search",
    EXTERNAL: "External Websites",
    YT_SUGGESTED: "Suggested Videos",
    YT_CHANNEL_PAGE: "Channel Page",
    NOTIFICATION: "Notifications",
    BROWSE_FEATURES: "Browse Features",
    PLAYLIST: "Playlists",
    DIRECT_OR_UNKNOWN: "Direct or Unknown",
  }

  return sourceMap[source] || source
}

// Colors for the pie chart
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#FF6B6B", "#6B8E23", "#9370DB"]

export function TrafficSources({ data }: TrafficSourcesProps) {
  // Handle empty data
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px] bg-muted/20 rounded-md border">
        <p className="text-muted-foreground">No traffic source data available</p>
      </div>
    )
  }

  // Transform data for the chart
  const chartData = data.map((item, index) => ({
    name: getSourceName(item.source),
    value: item.views,
    color: COLORS[index % COLORS.length],
  }))

  // Calculate total views
  const totalViews = data.reduce((sum, item) => sum + item.views, 0)

  // Custom tooltip for the pie chart
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      const percentage = ((data.value / totalViews) * 100).toFixed(1)

      return (
        <div className="bg-background p-2 border rounded-md shadow-sm">
          <p className="font-medium">{data.name}</p>
          <p className="text-sm">{data.value.toLocaleString()} views</p>
          <p className="text-sm text-muted-foreground">{percentage}% of total</p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={chartData} cx="50%" cy="50%" labelLine={false} outerRadius={80} fill="#8884d8" dataKey="value">
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">Traffic Source Breakdown</h3>
        <div className="space-y-3">
          {chartData.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }} />
                <span>{item.name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-medium">{item.value.toLocaleString()}</span>
                <span className="text-sm text-muted-foreground">({((item.value / totalViews) * 100).toFixed(1)}%)</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
