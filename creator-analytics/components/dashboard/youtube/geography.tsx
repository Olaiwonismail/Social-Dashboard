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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface GeographyItem {
  country: string
  views: number
  watchTime: number
}

interface GeographyProps {
  data: GeographyItem[]
}

// Function to get country name from country code
const getCountryName = (code: string) => {
  const countryMap: Record<string, string> = {
    US: "United States",
    IN: "India",
    GB: "United Kingdom",
    CA: "Canada",
    AU: "Australia",
    DE: "Germany",
    FR: "France",
    BR: "Brazil",
    JP: "Japan",
    MX: "Mexico",
    NG: "Nigeria",
  }

  return countryMap[code] || code
}

export function Geography({ data }: GeographyProps) {
  // Handle empty data
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px] bg-muted/20 rounded-md border">
        <p className="text-muted-foreground">No geography data available</p>
      </div>
    )
  }

  // Transform data for the chart
  const chartData = data.map((item) => ({
    country: getCountryName(item.country),
    Views: item.views,
    "Watch Time (min)": item.watchTime,
  }))

  return (
    <Tabs defaultValue="views" className="w-full">
      <TabsList className="grid w-full max-w-md grid-cols-2 mb-4">
        <TabsTrigger value="views">Views by Country</TabsTrigger>
        <TabsTrigger value="watchTime">Watch Time by Country</TabsTrigger>
      </TabsList>

      <TabsContent value="views" className="pt-4">
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{
                top: 5,
                right: 30,
                left: 100,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#888" opacity={0.2} />
              <XAxis type="number" />
              <YAxis type="category" dataKey="country" tick={{ fontSize: 12 }} />
              <Tooltip content={<ChartTooltip />} />
              <Legend />
              <Bar dataKey="Views" fill="#FF0000" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </TabsContent>

      <TabsContent value="watchTime" className="pt-4">
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{
                top: 5,
                right: 30,
                left: 100,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#888" opacity={0.2} />
              <XAxis type="number" />
              <YAxis type="category" dataKey="country" tick={{ fontSize: 12 }} />
              <Tooltip content={<ChartTooltip />} />
              <Legend />
              <Bar dataKey="Watch Time (min)" fill="#FF0000" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </TabsContent>
    </Tabs>
  )
}
