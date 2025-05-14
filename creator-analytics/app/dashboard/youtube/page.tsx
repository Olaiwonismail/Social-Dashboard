"use client"
import { useState, useEffect, useCallback } from "react"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { RefreshCw, Tv, Youtube, TrendingUp, Users, BarChart3, Globe, ChevronLeft } from "lucide-react"
import { ChannelInfo } from "@/components/dashboard/youtube/channel-info"
import { ChannelInfoSkeleton } from "@/components/dashboard/youtube/channel-info-skeleton"
import { ChannelMetrics } from "@/components/dashboard/youtube/channel-metrics"
import { TopVideos } from "@/components/dashboard/youtube/top-videos"
import { Demographics } from "@/components/dashboard/youtube/demographics"
import { TrafficSources } from "@/components/dashboard/youtube/traffic-sources"
import { Geography } from "@/components/dashboard/youtube/geography"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { useMediaQuery } from "@/hooks/use-media-query"
// Import skeletons individually
import { ChannelMetricsSkeleton } from "@/components/dashboard/youtube/channel-metrics-skeleton"
import { TopVideosSkeleton } from "@/components/dashboard/youtube/top-videos-skeleton"
import { DemographicsSkeleton } from "@/components/dashboard/youtube/demographics-skeleton"
import { TrafficSourcesSkeleton } from "@/components/dashboard/youtube/traffic-sources-skeleton"
import { GeographySkeleton } from "@/components/dashboard/youtube/geography-skeleton"

const transformChannelMetricsData = (data) => {
  const rows = data?.channel_metrics?.rows || []
  const headers = data?.channel_metrics?.columnHeaders || []
  const idx = headers.reduce((acc, h, i) => ({ ...acc, [h.name]: i }), {})
  return {
    views: rows.map((r) => ({ date: r[idx.day], value: r[idx.views] || 0 })),
    watchTime: rows.map((r) => ({ date: r[idx.day], value: r[idx.estimatedMinutesWatched] || 0 })),
    subscribers: rows.map((r) => ({
      date: r[idx.day],
      net: (r[idx.subscribersGained] || 0) - (r[idx.subscribersLost] || 0),
    })),
    engagement: rows.map((r) => ({
      date: r[idx.day],
      total: (r[idx.likes] || 0) + (r[idx.comments] || 0) + (r[idx.shares] || 0),
    })),
  }
}

const transformDemographicsData = (data) =>
  data?.demographics?.map(([ageGroup, gender, pct]) => ({ ageGroup, gender, percentage: pct })) || []

const transformTrafficSourcesData = (data) => data?.traffic_sources?.map(([source, views]) => ({ source, views })) || []

const transformGeographyData = (data) =>
  data?.geography?.map(([country, views, watchTime]) => ({ country, views, watchTime })) || []

export default function YouTubeDashboardPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState("overview")
  const [disconnecting, setDisconnecting] = useState(false)
  const isMobile = useMediaQuery("(max-width: 640px)")

  // Connection status from user object
  const isYouTubeConnected = String(user?.yt_is_connected).toLowerCase() === "true"

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const today = new Date().toISOString().split("T")[0]
     const res = await fetch(
  `http://localhost:8080/api/v1/posts/yt-metrics?frequency=daily&end_date=${today}`,
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: user?.email }),
  }
)
      if (!res.ok) {
  const body = await res.text();
  console.log("API failed:", res.status, body);
  throw new Error(`API ${res.status}`);
}

      if (!res.ok) throw new Error(`Error ${res.status}`)
      const json = await res.json()
      if (!json.channel_metrics) throw new Error("Invalid data format from API")
      setData(json)
    } catch (e: any) {
      setError(e.message)
      setData(null)
    } finally {
      setLoading(false)
    }
  }, [user?.email])

  // Initial fetch
  useEffect(() => {
    if (isYouTubeConnected) fetchData()
  }, [isYouTubeConnected, fetchData])

  const handleRefresh = () => {
    if (isYouTubeConnected) {
      setLoading(true)
      setError(null)
      setData(null)
      fetchData()
    }
  }

  const handleDisconnect = async () => {
    setDisconnecting(true)
    try {
      const res = await fetch("http://localhost:8080/api/v1/posts/disconnect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user?.email }),
      })

      if (!res.ok) throw new Error("Failed to disconnect YouTube account")

      // Refresh the page to update connection status
      window.location.reload()
    } catch (e: any) {
      setError(e.message)
    } finally {
      setDisconnecting(false)
    }
  }

  // Safely compute summary metrics
const totalViews = data?.channel_metrics?.rows?.reduce((sum, r) => sum + (r[1] || 0), 0) ?? 0
const totalWatchTime = data?.channel_metrics?.rows?.reduce((sum, r) => sum + (r[2] || 0), 0) ?? 0
const totalSubscribers = data?.channel_metrics?.rows?.reduce((sum, r) => sum + ((r[5] || 0) - (r[6] || 0)), 0) ?? 0
const totalEngagement = data?.channel_metrics?.rows?.reduce((sum, r) => sum + ((r[7] || 0) + (r[9] || 0) + (r[10] || 0)), 0) ?? 0

  // Show connection card when not connected
  if (!isYouTubeConnected) {
    return (
      <div className="container px-4 py-6 sm:py-8 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="flex items-center gap-2 sm:gap-4 mb-6 sm:mb-8">
          <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard")} className="gap-1">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only sm:not-sr-only">Back</span>
          </Button>
          <div>
            <h1 className="text-xl sm:text-3xl font-bold tracking-tight">YouTube Analytics</h1>
            <p className="text-xs sm:text-base text-muted-foreground">Monitor your YouTube channel performance</p>
          </div>
        </div>

        <Alert className="mb-6 sm:mb-8 border-amber-200 bg-amber-50 text-amber-800">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Not Connected</AlertTitle>
          <AlertDescription>
            Your YouTube account isn't connected yet. Click below to authorize access.
          </AlertDescription>
        </Alert>

        <Card className="max-w-md mx-auto border-0 shadow-md overflow-hidden">
          <div className="h-1.5 bg-gradient-to-r from-red-500 to-red-600" />
          <CardHeader className="text-center p-4 sm:p-6">
            <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-r from-red-500 to-red-600 flex items-center justify-center mb-4">
              <Youtube className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
            </div>
            <CardTitle className="text-xl sm:text-2xl">Connect YouTube</CardTitle>
            <CardDescription className="text-sm">
              Link your channel to track video performance, audience demographics, and engagement metrics.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center pb-6 sm:pb-8 p-4 sm:p-6">
            <Button
              className="gap-2 bg-red-600 hover:bg-red-700"
              onClick={fetchData}
              
              size={isMobile ? "default" : "lg"}
            >
              Authorize YouTube <Tv className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        <div className="mt-8 sm:mt-12 text-center text-muted-foreground">
          <p className="font-medium text-sm sm:text-base mb-4">After connecting, you'll be able to view:</p>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-3xl mx-auto">
            <div className="border rounded-lg p-4 sm:p-6 bg-white shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="h-4 w-4 text-red-500" />
                <h3 className="font-medium text-sm sm:text-base">Channel Analytics</h3>
              </div>
              <p className="text-xs sm:text-sm">Views, watch time, and revenue metrics for your channel.</p>
            </div>
            <div className="border rounded-lg p-4 sm:p-6 bg-white shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-4 w-4 text-red-500" />
                <h3 className="font-medium text-sm sm:text-base">Audience Demographics</h3>
              </div>
              <p className="text-xs sm:text-sm">Age, gender, and location data for your viewers.</p>
            </div>
            <div className="border rounded-lg p-4 sm:p-6 bg-white shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Globe className="h-4 w-4 text-red-500" />
                <h3 className="font-medium text-sm sm:text-base">Traffic Sources</h3>
              </div>
              <p className="text-xs sm:text-sm">Discover how viewers are finding your content.</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container px-4 py-6 sm:py-8 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 sm:gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard")} className="gap-1">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only sm:not-sr-only">Back</span>
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <Youtube className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" />
              <h1 className="text-xl sm:text-3xl font-bold tracking-tight">YouTube Analytics</h1>
            </div>
            <p className="text-xs sm:text-base text-muted-foreground mt-1">
              Monitor your YouTube channel performance and growth
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 self-end sm:self-auto mt-2 sm:mt-0">
          <Button
            variant="destructive"
            onClick={handleDisconnect}
            disabled={disconnecting || loading}
            size="sm"
            className="text-xs sm:text-sm"
          >
            {disconnecting ? "Disconnecting..." : isMobile ? "Disconnect" : "Disconnect"}
          </Button>
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={loading}
            size="sm"
            className="gap-1 sm:gap-2 text-xs sm:text-sm"
          >
            <RefreshCw className={`h-3 w-3 sm:h-4 sm:w-4 ${loading ? "animate-spin" : ""}`} />
            {loading ? "Refreshing" : isMobile ? "Refresh" : "Refresh Data"}
          </Button>
        </div>
      </div>

      {error && (
        <Alert className="mb-6 border-destructive/50 bg-destructive/10">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription className="flex flex-col gap-2">
            <p className="text-xs sm:text-sm">{error}</p>
            <Button variant="outline" size="sm" onClick={handleRefresh} className="self-start text-xs sm:text-sm">
              Try Again
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <div className="mb-6 sm:mb-8">
        {loading || !data ? <ChannelInfoSkeleton /> : <ChannelInfo channelInfo={data.channel_info} />}
      </div>

      <Card className="mb-6 sm:mb-8 border-0 shadow-md overflow-hidden">
        <div className="h-1.5 bg-gradient-to-r from-red-500 to-red-600" />
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-base sm:text-xl">Channel Summary</CardTitle>
          <CardDescription className="text-xs sm:text-sm">Last period overview</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 p-4 sm:p-6">
          <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-3 sm:p-4 rounded-lg border border-muted/80 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-red-500" />
              <p className="text-xs sm:text-sm font-medium">Total Views</p>
            </div>
            <p className="text-lg sm:text-2xl font-bold">
              {loading ? "Loading..." : totalViews.toLocaleString()}
              
            </p>
          </div>
          <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-3 sm:p-4 rounded-lg border border-muted/80 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="h-3 w-3 sm:h-4 sm:w-4 text-amber-500" />
              <p className="text-xs sm:text-sm font-medium">Watch Time</p>
            </div>
            <p className="text-lg sm:text-2xl font-bold">
              {loading ? "Loading..." : totalWatchTime.toLocaleString()} min
            </p>
          </div>
          <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-3 sm:p-4 rounded-lg border border-muted/80 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />
              <p className="text-xs sm:text-sm font-medium">Subscribers</p>
            </div>
            <p className="text-lg sm:text-2xl font-bold">
              {loading ? "Loading..." : totalSubscribers.toLocaleString()}
            </p>
          </div>
          <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-3 sm:p-4 rounded-lg border border-muted/80 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Globe className="h-3 w-3 sm:h-4 sm:w-4 text-violet-500" />
              <p className="text-xs sm:text-sm font-medium">Engagement</p>
            </div>
            <p className="text-lg sm:text-2xl font-bold">
              {loading ? "Loading..." : totalEngagement.toLocaleString()}
            </p>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-4 sm:mb-6 bg-muted/50 p-1 rounded-lg">
          <TabsTrigger
            value="overview"
            className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-sm text-xs sm:text-sm"
          >
            <span className="flex items-center gap-1 sm:gap-2">
              <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Overview</span>
              <span className="sm:hidden">Overview</span>
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="audience"
            className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-sm text-xs sm:text-sm"
          >
            <span className="flex items-center gap-1 sm:gap-2">
              <Users className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Audience</span>
              <span className="sm:hidden">Audience</span>
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="content"
            className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-sm text-xs sm:text-sm"
          >
            <span className="flex items-center gap-1 sm:gap-2">
              <Tv className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Content</span>
              <span className="sm:hidden">Content</span>
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="reach"
            className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-sm text-xs sm:text-sm"
          >
            <span className="flex items-center gap-1 sm:gap-2">
              <Globe className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Reach</span>
              <span className="sm:hidden">Reach</span>
            </span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-0">
          <div className="grid gap-6 sm:gap-8">
            <Card className="border-0 shadow-md overflow-hidden">
              <div className="h-1.5 bg-gradient-to-r from-red-500 to-red-600" />
              <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 p-4 sm:p-6">
                <CardTitle className="text-base sm:text-xl">Channel Performance</CardTitle>
                <Tabs defaultValue="views" className="w-full sm:w-[200px]">
                  <TabsList className="grid grid-cols-2">
                    <TabsTrigger value="views" className="text-xs sm:text-sm">
                      Views
                    </TabsTrigger>
                    <TabsTrigger value="watchTime" className="text-xs sm:text-sm">
                      Watch Time
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                {loading ? <ChannelMetricsSkeleton /> : <ChannelMetrics data={transformChannelMetricsData(data)} />}
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md overflow-hidden">
              <div className="h-1.5 bg-gradient-to-r from-red-500 to-red-600" />
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-base sm:text-xl">Top Videos</CardTitle>
                <CardDescription className="text-xs sm:text-sm">Your best performing content</CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                {(!data || loading)
  ? <TopVideosSkeleton />
  : <TopVideos videos={data.top_videos || []} />}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="audience" className="mt-0">
          <div className="grid gap-6 sm:gap-8">
            <Card className="border-0 shadow-md overflow-hidden">
              <div className="h-1.5 bg-gradient-to-r from-red-500 to-red-600" />
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-base sm:text-xl">Demographics</CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Age and gender distribution of your audience
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                {loading ? <DemographicsSkeleton /> : <Demographics data={transformDemographicsData(data)} />}
              </CardContent>
            </Card>
            <Card className="border-0 shadow-md overflow-hidden">
              <div className="h-1.5 bg-gradient-to-r from-red-500 to-red-600" />
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-base sm:text-xl">Geography</CardTitle>
                <CardDescription className="text-xs sm:text-sm">Where your viewers are located</CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                {loading ? <GeographySkeleton /> : <Geography data={transformGeographyData(data)} />}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="content" className="mt-0">
          <Card className="border-0 shadow-md overflow-hidden">
            <div className="h-1.5 bg-gradient-to-r from-red-500 to-red-600" />
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-base sm:text-xl">Content Performance</CardTitle>
              <CardDescription className="text-xs sm:text-sm">Engagement metrics over time</CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              {loading ? (
                <ChannelMetricsSkeleton />
              ) : (
                <ChannelMetrics data={transformChannelMetricsData(data)} defaultMetric="engagement" />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reach" className="mt-0">
          <Card className="border-0 shadow-md overflow-hidden">
            <div className="h-1.5 bg-gradient-to-r from-red-500 to-red-600" />
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-base sm:text-xl">Traffic Sources</CardTitle>
              <CardDescription className="text-xs sm:text-sm">How viewers are finding your content</CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              {loading ? <TrafficSourcesSkeleton /> : <TrafficSources data={transformTrafficSourcesData(data)} />}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
