"use client"
const API_URL = process.env.NEXT_PUBLIC_API_URL 
import { useState, useEffect, useCallback } from "react"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  RefreshCw,
  Tv,
  Youtube,
  TrendingUp,
  Users,
  BarChart3,
  Globe,
  ChevronLeft,
  Grid3X3,
  Eye,
  Clock,
  ThumbsUp,
  MessageSquare,
  Grid,
  List,
  ExternalLink,
  AlertCircle,
} from "lucide-react"
import { ChannelInfo } from "@/components/dashboard/youtube/channel-info"
import { ChannelInfoSkeleton } from "@/components/dashboard/youtube/channel-info-skeleton"
import { ChannelMetrics } from "@/components/dashboard/youtube/channel-metrics"
import { TopVideos } from "@/components/dashboard/youtube/top-videos"
import { Demographics } from "@/components/dashboard/youtube/demographics"
import { TrafficSources } from "@/components/dashboard/youtube/traffic-sources"
import { Geography } from "@/components/dashboard/youtube/geography"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useMediaQuery } from "@/hooks/use-media-query"
// Import skeletons individually
import { ChannelMetricsSkeleton } from "@/components/dashboard/youtube/channel-metrics-skeleton"
import { TopVideosSkeleton } from "@/components/dashboard/youtube/top-videos-skeleton"
import { DemographicsSkeleton } from "@/components/dashboard/youtube/demographics-skeleton"
import { TrafficSourcesSkeleton } from "@/components/dashboard/youtube/traffic-sources-skeleton"
import { GeographySkeleton } from "@/components/dashboard/youtube/geography-skeleton"

// YouTube Posts Section Component Types
type VideoPost = {
  id: string
  title: string
  thumbnail: string
  views: number
  watch_time: number
  likes: number
  comments: number
  published_at?: string
}

// YouTube Posts Section Components
function VideoCard({ video }: { video: VideoPost }) {
  return (
    <div className="rounded-lg border overflow-hidden bg-card flex flex-col">
      <div className="relative aspect-video bg-muted">
        <Image
          src={video.thumbnail || "/placeholder.svg"}
          alt={video.title}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute bottom-2 right-2">
          <Badge variant="secondary" className="bg-black/70 text-white text-xs">
            {video.watch_time} min
          </Badge>
        </div>
      </div>
      <div className="p-3 flex-1 flex flex-col">
        <h3 className="font-medium text-sm mb-2 line-clamp-2">{video.title}</h3>
        <div className="mt-auto flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Eye className="h-3 w-3" /> {video.views}
            </span>
            <span className="flex items-center gap-1">
              <ThumbsUp className="h-3 w-3" /> {video.likes}
            </span>
            <span className="flex items-center gap-1">
              <MessageSquare className="h-3 w-3" /> {video.comments}
            </span>
          </div>
          <a
            href={`https://youtube.com/watch?v=${video.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-primary/80"
          >
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>
    </div>
  )
}

function VideoListItem({ video }: { video: VideoPost }) {
  return (
    <div className="rounded-lg border overflow-hidden bg-card">
      <div className="flex flex-col sm:flex-row">
        <div className="relative w-full sm:w-48 aspect-video sm:aspect-[16/9]">
          <Image
            src={video.thumbnail || "/placeholder.svg"}
            alt={video.title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 192px"
          />
        </div>
        <div className="p-3 flex-1 flex flex-col">
          <h3 className="font-medium text-sm mb-2">{video.title}</h3>
          <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Eye className="h-3 w-3" /> {video.views} views
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" /> {video.watch_time} min
            </span>
            <span className="flex items-center gap-1">
              <ThumbsUp className="h-3 w-3" /> {video.likes}
            </span>
            <span className="flex items-center gap-1">
              <MessageSquare className="h-3 w-3" /> {video.comments}
            </span>
            <a
              href={`https://youtube.com/watch?v=${video.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto text-primary hover:text-primary/80 flex items-center gap-1"
            >
              View <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

function YouTubePostsSectionSkeleton({ viewMode }: { viewMode: "grid" | "list" }) {
  return (
    <Card className="border-0 shadow-md overflow-hidden">
      <div className="h-1.5 bg-gradient-to-r from-red-500 to-red-600" />
      <CardHeader className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-48 mt-2" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-8 w-16" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array(6)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="rounded-lg border overflow-hidden bg-card">
                  <Skeleton className="aspect-video w-full" />
                  <div className="p-3">
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-3/4 mb-2" />
                    <div className="flex justify-between mt-4">
                      <Skeleton className="h-3 w-24" />
                      <Skeleton className="h-3 w-3" />
                    </div>
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {Array(4)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="rounded-lg border overflow-hidden bg-card">
                  <div className="flex flex-col sm:flex-row">
                    <Skeleton className="w-full sm:w-48 aspect-video" />
                    <div className="p-3 flex-1">
                      <Skeleton className="h-4 w-full max-w-md mb-2" />
                      <Skeleton className="h-4 w-3/4 max-w-sm mb-4" />
                      <div className="flex flex-wrap gap-2">
                        <Skeleton className="h-3 w-16" />
                        <Skeleton className="h-3 w-16" />
                        <Skeleton className="h-3 w-16" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function YouTubePostsSection({ videos, loading }: { videos: VideoPost[]; loading: boolean }) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState<"recent" | "popular">("recent")

  const sortedVideos = [...(videos || [])].sort((a, b) => {
    if (sortBy === "popular") {
      return b.views - a.views
    }
    // Default to recent (would use published_at if available)
    return 0
  })

  if (loading) {
    return <YouTubePostsSectionSkeleton viewMode={viewMode} />
  }

  if (!videos || videos.length === 0) {
    return (
      <Card className="border-0 shadow-md overflow-hidden">
        <div className="h-1.5 bg-gradient-to-r from-red-500 to-red-600" />
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-base sm:text-xl">All Posts</CardTitle>
          <CardDescription className="text-xs sm:text-sm">Your YouTube content</CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 text-center">
          <p className="text-muted-foreground">No videos found. Start uploading content to see it here.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-0 shadow-md overflow-hidden">
      <div className="h-1.5 bg-gradient-to-r from-red-500 to-red-600" />
      <CardHeader className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="text-base sm:text-xl">All Posts</CardTitle>
            <CardDescription className="text-xs sm:text-sm">Your YouTube content</CardDescription>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Tabs
              defaultValue="recent"
              value={sortBy}
              onValueChange={(value) => setSortBy(value as "recent" | "popular")}
            >
              <TabsList className="h-8">
                <TabsTrigger value="recent" className="text-xs px-2 py-1">
                  Recent
                </TabsTrigger>
                <TabsTrigger value="popular" className="text-xs px-2 py-1">
                  Popular
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="flex items-center border rounded-md p-1 h-8">
              <Button
                variant="ghost"
                size="icon"
                className={`h-6 w-6 ${viewMode === "grid" ? "bg-muted" : ""}`}
                onClick={() => setViewMode("grid")}
              >
                <Grid className="h-4 w-4" />
                <span className="sr-only">Grid view</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={`h-6 w-6 ${viewMode === "list" ? "bg-muted" : ""}`}
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
                <span className="sr-only">List view</span>
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedVideos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {sortedVideos.map((video) => (
              <VideoListItem key={video.id} video={video} />
            ))}
          </div>
        )}
      </CardContent>
      {videos.length > 6 && (
        <CardFooter className="p-4 sm:p-6 flex justify-center border-t">
          <Button variant="outline" size="sm">
            Load More
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}

// Main Dashboard Data Transformation Functions
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

// Main Dashboard Component
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
      const res = await fetch(`${API_URL}/youtube/yt-metrics?frequency=daily&end_date=${today}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user?.email }),
      })

      if (!res.ok) {
        const body = await res.text()
        console.log("API failed:", res.status, body)
        throw new Error(`API ${res.status}`)
      }

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
      const res = await fetch(`${API_URL}/youtube/disconnect`, {
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
  const totalEngagement =
    data?.channel_metrics?.rows?.reduce((sum, r) => sum + ((r[7] || 0) + (r[9] || 0) + (r[10] || 0)), 0) ?? 0

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
              onClick={async () => {
                try {
                  const res = await fetch(`${API_URL}/youtube/auth/initiate`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email: user?.email }),
                  })

                  // if (!res.ok) {throw new Error(`Error ${res.status}`);}
                  const data = await res.json()

                  // Redirect to the authorization URL
                  if (data) {
                    window.location.href = data
                  } else {
                    throw new Error("No authorization URL received")
                  }
                } catch (error) {
                  console.error("YouTube authorization error:", error)
                  setError(error.message)
                }
              }}
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
            <p className="text-lg sm:text-2xl font-bold">{loading ? "Loading..." : totalViews.toLocaleString()}</p>
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
            <p className="text-lg sm:text-2xl font-bold">{loading ? "Loading..." : totalEngagement.toLocaleString()}</p>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-5 mb-4 sm:mb-6 bg-muted/50 p-1 rounded-lg">
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
          <TabsTrigger
            value="posts"
            className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-sm text-xs sm:text-sm"
          >
            <span className="flex items-center gap-1 sm:gap-2">
              <Grid3X3 className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">All Posts</span>
              <span className="sm:hidden">Posts</span>
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
                {!data || loading ? <TopVideosSkeleton /> : <TopVideos videos={data.top_videos || []} />}
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

        <TabsContent value="posts" className="mt-0">
          <YouTubePostsSection videos={data?.top_videos || []} loading={loading} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
