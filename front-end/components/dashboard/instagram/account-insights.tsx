"use client"

import {
  Bar,
  Line,
  BarChart,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ChartTooltip,
} from "@/components/ui/chart"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Update the props interface to include custom labels
interface AccountInsightsProps {
  data: {
    profile_views?: Array<{ value: number; end_time: string }> | number | null
    website_clicks?: Array<{ value: number; end_time: string }> | number | null
  }
  period: string // "7days", "30days", "90days"
  labels?: {
    profile_views?: string
    website_clicks?: string
  }
}

export function AccountInsights({ data, period, labels = {} }: AccountInsightsProps) {
  // Set default labels
  const metricLabels = {
    profile_views: labels.profile_views || "Profile Views",
    website_clicks: labels.website_clicks || "Website Clicks",
  }

  // Update the processData function to handle different data types
  const processData = (dataInput: Array<{ value: number; end_time: string }> | number | null | undefined) => {
    // If data is null or undefined, return empty array
    if (dataInput === null || dataInput === undefined) {
      return []
    }

    // If data is a single number, create a single entry array
    if (typeof dataInput === "number") {
      return [
        {
          date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          value: dataInput,
        },
      ]
    }

    // If data is an array, process it normally
    if (Array.isArray(dataInput)) {
      return dataInput
        .map((item) => ({
          date: new Date(item.end_time).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          value: item.value,
        }))
        .reverse()
    }

    // Fallback to empty array
    return []
  }

  // Process data for both metrics
  const profileViewsData = processData(data.profile_views)
  const websiteClicksData = processData(data.website_clicks)

  return (
    <Tabs defaultValue="profile_views" className="w-full">
      <TabsList className="grid w-full max-w-md grid-cols-2 mb-4">
        <TabsTrigger value="profile_views">{metricLabels.profile_views}</TabsTrigger>
        <TabsTrigger value="website_clicks">{metricLabels.website_clicks}</TabsTrigger>
      </TabsList>

      <TabsContent value="profile_views" className="pt-4">
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={profileViewsData}
              margin={{
                top: 5,
                right: 20,
                left: 10,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#888" opacity={0.2} />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
                tickLine={{ stroke: "#888", strokeWidth: 1 }}
                axisLine={{ stroke: "#888", strokeWidth: 1 }}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                tickLine={{ stroke: "#888", strokeWidth: 1 }}
                axisLine={{ stroke: "#888", strokeWidth: 1 }}
              />
              <Tooltip content={<ChartTooltip />} />
              <Line
                type="monotone"
                dataKey="value"
                name={metricLabels.profile_views}
                stroke="#6366F1"
                activeDot={{ r: 8 }}
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 text-sm">
          <p className="text-muted-foreground">
            <span className="font-medium text-foreground">
              {profileViewsData.length > 0
                ? Math.round(profileViewsData.reduce((acc, item) => acc + item.value, 0) / profileViewsData.length)
                : 0}
            </span>{" "}
            average daily {metricLabels.profile_views.toLowerCase()} over the last{" "}
            {period === "7days" ? "7" : period === "30days" ? "30" : "90"} days
          </p>
        </div>
      </TabsContent>

      <TabsContent value="website_clicks" className="pt-4">
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={websiteClicksData}
              margin={{
                top: 5,
                right: 20,
                left: 10,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#888" opacity={0.2} />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
                tickLine={{ stroke: "#888", strokeWidth: 1 }}
                axisLine={{ stroke: "#888", strokeWidth: 1 }}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                tickLine={{ stroke: "#888", strokeWidth: 1 }}
                axisLine={{ stroke: "#888", strokeWidth: 1 }}
              />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey="value" name={metricLabels.website_clicks} fill="#6366F1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 text-sm">
          <p className="text-muted-foreground">
            <span className="font-medium text-foreground">
              {websiteClicksData.length > 0 ? websiteClicksData.reduce((acc, item) => acc + item.value, 0) : 0}
            </span>{" "}
            total {metricLabels.website_clicks.toLowerCase()} over the last{" "}
            {period === "7days" ? "7" : period === "30days" ? "30" : "90"} days
          </p>
        </div>
      </TabsContent>
    </Tabs>
  )
}
