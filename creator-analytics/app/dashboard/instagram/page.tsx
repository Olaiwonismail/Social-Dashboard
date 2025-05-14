"use client"

import { useState, useEffect } from "react"
import { ProfileInfo } from "@/components/dashboard/instagram/profile-info"
import { MediaPosts } from "@/components/dashboard/instagram/media-posts"
import { AccountInsights } from "@/components/dashboard/instagram/account-insights"
import { ProfileInfoSkeleton } from "@/components/dashboard/instagram/profile-info-skeleton"
import { AccountInsightsSkeleton } from "@/components/dashboard/instagram/account-insights-skeleton"
import { MediaPostsSkeleton } from "@/components/dashboard/instagram/media-posts-skeleton"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { RefreshCw, AlertCircle, ExternalLink, InstagramIcon, ChevronLeft } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { useMediaQuery } from "@/hooks/use-media-query"

const transformInsightsData = (data) => {
  if (!data?.user_insights)
    return { profile_views: [], website_clicks: [], impressions: [], reach: [], engagement: [], followers: [] }

  return {
    profile_views: data.user_insights.map((i) => ({ value: i.views, end_time: i.date })),
    website_clicks: data.user_insights.map((i) => ({ value: i.reach, end_time: i.date })),
    impressions: data.user_insights.map((i) => ({ value: i.views, end_time: i.date })),
    reach: data.user_insights.map((i) => ({ value: i.reach, end_time: i.date })),
    engagement: data.user_insights.map((i) => ({ value: i.total_interactions, end_time: i.date })),
    followers: data.user_insights.map((i) => ({ value: i.follower_count, end_time: i.date })),
  }
}

const transformMediaData = (data) => {
  if (!data) return []
  const all = [...(data.recent_media || []), ...(data.top_media || [])]
  const map = new Map()
  all.forEach((m) => {
    if (!map.has(m.id)) {
      map.set(m.id, {
        id: m.id,
        media_type: m.media_type || "IMAGE",
        media_url: m.media_url || "/placeholder.svg?height=300&width=300",
        permalink: m.permalink || `https://instagram.com/p/${m.id}`,
        caption: m.caption,
        timestamp: m.timestamp,
        like_count: m.like_count,
        comments_count: m.comments_count,
        insights: {
          impressions: m.impressions,
          reach: m.reach,
          engagement: (m.like_count || 0) + (m.comments_count || 0) + (m.saves_count || 0) + (m.shares_count || 0),
          saves: m.saves_count || 0,
          comments: m.comments_count || 0,
          shares: m.shares_count || 0,
        },
      })
    }
  })
  return Array.from(map.values())
}

export default function InstagramDashboardPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState(null)
  const [status, setStatus] = useState(null)
  const [error, setError] = useState(null)
  const [selectedPeriod, setSelectedPeriod] = useState("7days")
  const [activeTab, setActiveTab] = useState("insights")
  const isMobile = useMediaQuery("(max-width: 640px)")

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.email) return
      setLoading(true)
      setError(null)
      try {
        const res = await fetch("http://localhost:8080/instagram/instagram/dashboard", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: user.email }),
        })
        if (res.status === 401) {
          setStatus(401)
        } else if (!res.ok) {
          throw new Error(`Error ${res.status}`)
        } else {
          const json = await res.json()
          setData(json)
        }
      } catch (e) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [user?.email])

  const handleRefresh = () => {
    setLoading(true)
    setError(null)
    setStatus(null)
    setData(null)
    setTimeout(() => window.location.reload(), 500)
  }

  const handleAuthorize = async () => {
    try {
      const res = await fetch("http://localhost:8080/instagram/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email }),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.detail || "Authentication failed")
      }

      const responseData = await res.json()

      // Verify response structure
      if (responseData.redirect_url) {
        window.location.href = responseData.redirect_url
      } else {
        throw new Error("Invalid server response")
      }
    } catch (e) {
      setError(e.message)
    }
  }

  const handleDisconnect = async () => {
    try {
      const res = await fetch("http://localhost:8080/instagram/disconnect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email }),
      })

      if (!res.ok) {
        throw new Error(`Error ${res.status}`)
      }

      // Reset state to show connection screen
      setStatus(401)
      setData(null)
      setError(null)
    } catch (e) {
      setError(e.message)
    }
  }

  if (status === 401) {
    return (
      <div className="container px-4 py-6 sm:py-8 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="flex items-center gap-2 sm:gap-4 mb-6 sm:mb-8">
          <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard")} className="gap-1">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only sm:not-sr-only">Back</span>
          </Button>
          <div>
            <h1 className="text-xl sm:text-3xl font-bold tracking-tight">Instagram Analytics</h1>
            <p className="text-xs sm:text-base text-muted-foreground">Monitor your Instagram profile performance</p>
          </div>
        </div>

        <Alert className="mb-6 sm:mb-8 border-amber-200 bg-amber-50 text-amber-800">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Not Connected</AlertTitle>
          <AlertDescription>
            Your Instagram account isn't connected yet. Click below to authorize access.
          </AlertDescription>
        </Alert>

        <Card className="max-w-md mx-auto border-0 shadow-md overflow-hidden">
          <div className="h-1.5 bg-gradient-to-r from-pink-500 to-purple-600" />
          <CardHeader className="text-center p-4 sm:p-6">
            <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center mb-4">
              <InstagramIcon className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
            </div>
            <CardTitle className="text-xl sm:text-2xl">Connect Instagram</CardTitle>
            <CardDescription className="text-sm">
              Link your account to track post performance, follower growth, and engagement analytics.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center pb-6 sm:pb-8 p-4 sm:p-6">
            <Button
              className="gap-2 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
              onClick={handleAuthorize}
              disabled={loading}
              size={isMobile ? "default" : "lg"}
            >
              Authorize Instagram <ExternalLink className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        <div className="mt-8 sm:mt-12 text-center text-muted-foreground">
          <p className="font-medium text-sm sm:text-base mb-4">After connecting, you'll be able to view:</p>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-3xl mx-auto">
            <div className="border rounded-lg p-4 sm:p-6 bg-white shadow-sm">
              <h3 className="font-medium mb-2 text-sm sm:text-base">Post Analytics</h3>
              <p className="text-xs sm:text-sm">Track likes, comments, saves, and reach for your posts and reels.</p>
            </div>
            <div className="border rounded-lg p-4 sm:p-6 bg-white shadow-sm">
              <h3 className="font-medium mb-2 text-sm sm:text-base">Audience Demographics</h3>
              <p className="text-xs sm:text-sm">Age, gender, location, and active times of your followers.</p>
            </div>
            <div className="border rounded-lg p-4 sm:p-6 bg-white shadow-sm">
              <h3 className="font-medium mb-2 text-sm sm:text-base">Engagement Trends</h3>
              <p className="text-xs sm:text-sm">Best performing content, story interactions, and hashtag reach.</p>
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
              <InstagramIcon className="h-4 w-4 sm:h-5 sm:w-5 text-pink-500" />
              <h1 className="text-xl sm:text-3xl font-bold tracking-tight">Instagram Analytics</h1>
            </div>
            <p className="text-xs sm:text-base text-muted-foreground mt-1">
              Monitor your Instagram profile performance
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto mt-2 sm:mt-0">
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDisconnect}
            disabled={loading}
            className="text-xs sm:text-sm"
          >
            {isMobile ? "Disconnect" : "Disconnect Account"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={loading}
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

      {loading || !data ? (
        <ProfileInfoSkeleton />
      ) : (
        <ProfileInfo
          profile={{
            username: data.profile.username,
            full_name: data.profile.full_name || "",
            biography: data.profile.bio,
            profile_picture_url: data.profile.profile_picture_url,
            followers_count: data.profile.followers_count,
            follows_count: data.profile.follows_count,
            media_count: data.profile.media_count,
            profile_views: data.profile.profile_views,
            link_in_bio: data.profile.link_in_bio,
          }}
          engagementRate={data.engagement_rate}
        />
      )}

      <div className="mt-6 sm:mt-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-xs mx-auto grid-cols-3 mb-4 sm:mb-6">
            <TabsTrigger value="insights" className="text-xs sm:text-sm">
              Account Insights
            </TabsTrigger>
            <TabsTrigger value="engagement" className="text-xs sm:text-sm">
              Engagement
            </TabsTrigger>
            <TabsTrigger value="content" className="text-xs sm:text-sm">
              Content
            </TabsTrigger>
          </TabsList>

          <TabsContent value="insights" className="mt-0 space-y-6 sm:space-y-8">
            <Card className="border-0 shadow-md overflow-hidden">
              <div className="h-1.5 bg-gradient-to-r from-pink-500 to-purple-600" />
              <CardHeader className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <CardTitle className="text-base sm:text-xl">Account Insights</CardTitle>
                    <CardDescription className="text-xs sm:text-sm">Track your profile views and reach</CardDescription>
                  </div>
                  <Tabs
                    defaultValue="7days"
                    value={selectedPeriod}
                    onValueChange={setSelectedPeriod}
                    className="w-full sm:w-[250px]"
                  >
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="7days" className="text-xs sm:text-sm">
                        7 Days
                      </TabsTrigger>
                      <TabsTrigger value="30days" className="text-xs sm:text-sm">
                        30 Days
                      </TabsTrigger>
                      <TabsTrigger value="90days" className="text-xs sm:text-sm">
                        90 Days
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                {loading ? (
                  <AccountInsightsSkeleton />
                ) : (
                  <AccountInsights
                    data={{
                      profile_views: transformInsightsData(data).profile_views || [],
                      website_clicks: transformInsightsData(data).reach || [],
                    }}
                    period={selectedPeriod}
                    labels={{
                      profile_views: "Profile Views",
                      website_clicks: "Reach",
                    }}
                  />
                )}
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md overflow-hidden">
              <div className="h-1.5 bg-gradient-to-r from-pink-500 to-purple-600" />
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-base sm:text-xl">Audience Growth</CardTitle>
                <CardDescription className="text-xs sm:text-sm">Follower growth and views metrics</CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                {loading ? (
                  <AccountInsightsSkeleton />
                ) : (
                  <AccountInsights
                    data={{
                      profile_views: transformInsightsData(data).followers || [],
                      website_clicks: transformInsightsData(data).impressions || [],
                    }}
                    period={selectedPeriod}
                    labels={{
                      profile_views: "Followers",
                      website_clicks: "Views",
                    }}
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="engagement" className="mt-0">
            <Card className="border-0 shadow-md overflow-hidden">
              <div className="h-1.5 bg-gradient-to-r from-pink-500 to-purple-600" />
              <CardHeader className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <CardTitle className="text-base sm:text-xl">Engagement Metrics</CardTitle>
                    <CardDescription className="text-xs sm:text-sm">
                      Track interactions with your content
                    </CardDescription>
                  </div>
                  <Tabs
                    defaultValue="7days"
                    value={selectedPeriod}
                    onValueChange={setSelectedPeriod}
                    className="w-full sm:w-[250px]"
                  >
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="7days" className="text-xs sm:text-sm">
                        7 Days
                      </TabsTrigger>
                      <TabsTrigger value="30days" className="text-xs sm:text-sm">
                        30 Days
                      </TabsTrigger>
                      <TabsTrigger value="90days" className="text-xs sm:text-sm">
                        90 Days
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                {loading ? (
                  <AccountInsightsSkeleton />
                ) : (
                  <AccountInsights
                    data={{
                      profile_views: transformInsightsData(data).engagement || [],
                      website_clicks: data.user_insights.map((i) => ({
                        value: i.likes + i.comments,
                        end_time: i.date,
                      })),
                    }}
                    period={selectedPeriod}
                    labels={{
                      profile_views: "Total Interactions",
                      website_clicks: "Likes & Comments",
                    }}
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content" className="mt-0">
            <Card className="border-0 shadow-md overflow-hidden">
              <div className="h-1.5 bg-gradient-to-r from-pink-500 to-purple-600" />
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-base sm:text-xl">Content Performance</CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  View performance metrics for your posts
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                {loading ? <MediaPostsSkeleton /> : <MediaPosts posts={transformMediaData(data)} />}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
