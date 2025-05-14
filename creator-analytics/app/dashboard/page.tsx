"use client"

import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Instagram, Tv, LogOut, Music, ChevronRight } from "lucide-react"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"

export default function DashboardPage() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const isInstagramConnected = String(user?.ig_is_connected).toLowerCase() === "true"
  const isYouTubeConnected = String(user?.yt_is_connected).toLowerCase() === "true"

  const handleLogout = () => {
    logout()
    router.push("/auth/login")
  }

  return (
    <div className="container px-4 py-8 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Social Media Dashboard</h1>
          <p className="text-muted-foreground mt-1">Get insights about your social media presence across platforms.</p>
        </div>
        <Button variant="outline" onClick={handleLogout} className="gap-2 self-start sm:self-auto">
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Instagram Card */}
        <Card className="overflow-hidden border-0 shadow-md">
          <div className="h-1.5 bg-gradient-to-r from-pink-500 to-purple-600" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-semibold">Instagram</CardTitle>
            <Instagram className="h-5 w-5 text-pink-500" />
          </CardHeader>
          <CardContent className="pb-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="text-xl font-bold">{isInstagramConnected ? "Connected" : "Not Connected"}</div>
              {isInstagramConnected && (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  Active
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground mb-5">
              {isInstagramConnected
                ? "View your Instagram analytics, track engagement, and monitor growth."
                : "Connect your Instagram account to access analytics and insights."}
            </p>
            <Button
              className="w-full gap-2 justify-between"
              size="sm"
              asChild
              variant={isInstagramConnected ? "default" : "outline"}
            >
              <Link href="/dashboard/instagram">
                {isInstagramConnected ? "View Dashboard" : "Connect Account"}
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* YouTube Card */}
        <Card className="overflow-hidden border-0 shadow-md">
          <div className="h-1.5 bg-gradient-to-r from-red-500 to-red-600" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-semibold">YouTube</CardTitle>
            <Tv className="h-5 w-5 text-red-500" />
          </CardHeader>
          <CardContent className="pb-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="text-xl font-bold">{isYouTubeConnected ? "Connected" : "Not Connected"}</div>
              {isYouTubeConnected && (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  Active
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground mb-5">
              {isYouTubeConnected
                ? "View your YouTube analytics, track video performance, and audience insights."
                : "Connect your YouTube account to access analytics and insights."}
            </p>
            <Button
              className="w-full gap-2 justify-between"
              size="sm"
              asChild
              variant={isYouTubeConnected ? "default" : "outline"}
            >
              <Link href="/dashboard/youtube">
                {isYouTubeConnected ? "View Dashboard" : "Connect Account"}
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* TikTok Card */}
        <Card className="overflow-hidden border-0 shadow-md relative">
          <div className="h-1.5 bg-gradient-to-r from-black to-teal-400" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-semibold">TikTok</CardTitle>
            <Music className="h-5 w-5 text-teal-500" />
          </CardHeader>
          <CardContent className="pb-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="text-xl font-bold">Not Connected</div>
              <Badge className="bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-100">Coming Soon</Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-5">
              TikTok integration is coming soon! Track your TikTok performance and audience engagement.
            </p>
            <Button className="w-full gap-2 justify-between" size="sm" variant="outline" disabled>
              Connect Account
              <ChevronRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {user && (
        <div className="mt-12">
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>Your profile details and connected accounts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Username</p>
                    <p className="font-medium">{user.username}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{user.email}</p>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h3 className="text-sm font-medium mb-3">Connected Platforms</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Instagram className="h-4 w-4 text-pink-500" />
                        <span>Instagram</span>
                      </div>
                      <Badge
                        variant={isInstagramConnected ? "outline" : "secondary"}
                        className={isInstagramConnected ? "bg-green-50 text-green-700 border-green-200" : ""}
                      >
                        {isInstagramConnected ? "Connected" : "Not Connected"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Tv className="h-4 w-4 text-red-500" />
                        <span>YouTube</span>
                      </div>
                      <Badge
                        variant={isYouTubeConnected ? "outline" : "secondary"}
                        className={isYouTubeConnected ? "bg-green-50 text-green-700 border-green-200" : ""}
                      >
                        {isYouTubeConnected ? "Connected" : "Not Connected"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
  <div className="flex items-center gap-2">
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 48 48"
      className="h-4 w-4"
    >
      {/* Black background square */}
      <rect width="48" height="48" fill="#000" rx="8" />
      
      {/* TikTok symbol */}
      <path fill="#25F4EE" d="M25.06 10.3h5.74V27.4a5.74 5.74 0 1 1-5.74-5.75v3.02a2.72 2.72 0 1 0 0 5.44V37.7a10.04 10.04 0 1 1 0-20.08V10.3Z"/>
      <path fill="#FE2C55" d="M21.3 14.02V10.3h5.75v3.73a10.04 10.04 0 0 0 0 19.8v3.73a13.8 13.8 0 1 1 0-27.55Z"/>
      <path fill="#FFF" d="M27.05 10.3v3.73a10.04 10.04 0 0 1 0 19.8v3.73a13.8 13.8 0 1 0 0-27.55V10.3Z"/>
    </svg>
    <span className="text-xs sm:text-sm">TikTok</span>
  </div>
  <Badge variant="secondary">Coming Soon</Badge>
</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
