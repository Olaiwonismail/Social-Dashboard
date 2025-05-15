"use client"

import { useState } from "react"
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
  Legend,
  ChartTooltip,
} from "@/components/ui/chart"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface ChannelMetricsProps {
  data: {
    views: Array<{ date: string; value: number }>
    watchTime: Array<{ date: string; value: number }>
    subscribers: Array<{ date: string; gained: number; lost: number; net: number }>
    engagement: Array<{ date: string; likes: number; comments: number; shares: number; total: number }>
  }
  defaultMetric?: "views" | "watchTime" | "subscribers" | "engagement"
}

export function ChannelMetrics({ data, defaultMetric = "views" }: ChannelMetricsProps) {
  const [activeMetric, setActiveMetric] = useState(defaultMetric)

  // Format date to a more readable format
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
    } catch (e) {
      return dateString
    }
  }

  // Handle empty data
  if (
    !data ||
    (data.views.length === 0 &&
      data.watchTime.length === 0 &&
      data.subscribers.length === 0 &&
      data.engagement.length === 0)
  ) {
    return (
      <div className="flex items-center justify-center h-[300px] bg-muted/20 rounded-md border">
        <p className="text-muted-foreground">No data available</p>
      </div>
    )
  }

  return (
    <div>
      <Tabs value={activeMetric} onValueChange={(value) => setActiveMetric(value as any)} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-4 mb-4">
          <TabsTrigger value="views">Views</TabsTrigger>
          <TabsTrigger value="watchTime">Watch Time</TabsTrigger>
          <TabsTrigger value="subscribers">Subscribers</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
        </TabsList>

        {/* Views Tab */}
        <TabsContent value="views" className="pt-4">
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={data.views.map((item) => ({
                  date: formatDate(item.date),
                  Views: item.value,
                }))}
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
                <Legend />
                <Line type="monotone" dataKey="Views" stroke="#FF0000" activeDot={{ r: 8 }} strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 text-sm">
            <p className="text-muted-foreground">
              <span className="font-medium text-foreground">
                {data.views.length > 0
                  ? Math.round(data.views.reduce((acc, item) => acc + item.value, 0) / data.views.length)
                  : 0}
              </span>{" "}
              average daily views
            </p>
          </div>
        </TabsContent>

        {/* Watch Time Tab */}
        <TabsContent value="watchTime" className="pt-4">
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data.watchTime.map((item) => ({
                  date: formatDate(item.date),
                  "Watch Time (min)": item.value,
                }))}
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
                <Legend />
                <Bar dataKey="Watch Time (min)" fill="#FF0000" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 text-sm">
            <p className="text-muted-foreground">
              <span className="font-medium text-foreground">
                {data.watchTime.reduce((acc, item) => acc + item.value, 0).toLocaleString()}
              </span>{" "}
              total minutes watched
            </p>
          </div>
        </TabsContent>

        {/* Subscribers Tab */}
        <TabsContent value="subscribers" className="pt-4">
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data.subscribers.map((item) => ({
                  date: formatDate(item.date),
                  Gained: item.gained,
                  Lost: -item.lost,
                  Net: item.net,
                }))}
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
                <Legend />
                <Bar dataKey="Gained" fill="#4CAF50" radius={[4, 4, 0, 0]} stackId="stack" />
                <Bar dataKey="Lost" fill="#F44336" radius={[4, 4, 0, 0]} stackId="stack" />
                <Line type="monotone" dataKey="Net" stroke="#2196F3" strokeWidth={2} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 text-sm">
            <p className="text-muted-foreground">
              <span className="font-medium text-foreground">
                {data.subscribers.reduce((acc, item) => acc + item.net, 0)}
              </span>{" "}
              net subscribers gained
            </p>
          </div>
        </TabsContent>

        {/* Engagement Tab */}
        <TabsContent value="engagement" className="pt-4">
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data.engagement.map((item) => ({
                  date: formatDate(item.date),
                  Likes: item.likes,
                  Comments: item.comments,
                  Shares: item.shares,
                }))}
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
                <Legend />
                <Bar dataKey="Likes" fill="#2196F3" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Comments" fill="#FF9800" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Shares" fill="#9C27B0" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 text-sm">
            <p className="text-muted-foreground">
              <span className="font-medium text-foreground">
                {data.engagement.reduce((acc, item) => acc + item.total, 0)}
              </span>{" "}
              total engagement actions
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
