"use client"

import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ChartTooltip,
} from "@/components/ui/chart"

interface DemographicItem {
  ageGroup: string
  gender: string
  percentage: number
}

interface DemographicsProps {
  data: DemographicItem[]
}

export function Demographics({ data }: DemographicsProps) {
  // Handle empty data
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px] bg-muted/20 rounded-md border">
        <p className="text-muted-foreground">No demographics data available</p>
      </div>
    )
  }

  // Transform data for the chart
  const transformedData = data.reduce((acc: any[], item) => {
    const existingItem = acc.find((i) => i.ageGroup === item.ageGroup)

    if (existingItem) {
      existingItem[item.gender] = item.percentage
    } else {
      const newItem: any = { ageGroup: item.ageGroup }
      newItem[item.gender] = item.percentage
      acc.push(newItem)
    }

    return acc
  }, [])

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={transformedData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#888" opacity={0.2} />
          <XAxis dataKey="ageGroup" />
          <YAxis label={{ value: "Percentage (%)", angle: -90, position: "insideLeft" }} />
          <Tooltip content={<ChartTooltip />} />
          <Legend />
          <Bar dataKey="male" name="Male" fill="#2196F3" radius={[4, 4, 0, 0]} />
          <Bar dataKey="female" name="Female" fill="#FF4081" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
