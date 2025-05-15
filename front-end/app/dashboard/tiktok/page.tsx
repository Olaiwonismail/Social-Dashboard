import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, ExternalLink } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function TikTokDashboardPage() {
  return (
    <div className="container px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">TikTok Analytics</h1>
        <p className="text-muted-foreground">Connect your TikTok account to view analytics.</p>
      </div>

      <Alert className="mb-8">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Not Connected</AlertTitle>
        <AlertDescription>
          You haven't connected your TikTok account yet. Click the button below to authorize access.
        </AlertDescription>
      </Alert>

      <Card className="max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-black flex items-center justify-center mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6"
            >
              <circle cx="8" cy="18" r="4" />
              <path d="M12 18V2l7 4" />
            </svg>
          </div>
          <CardTitle>Connect TikTok</CardTitle>
          <CardDescription>
            Link your TikTok account to track video performance, follower growth, and engagement metrics.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Button className="gap-2" asChild>
            <a href="https://myapp.com/auth/tiktok" target="_blank" rel="noopener noreferrer">
              Authorize TikTok <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        </CardContent>
      </Card>

      <div className="mt-12 text-center text-muted-foreground">
        <p>After connecting, you'll be able to view:</p>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
          <div className="border rounded-lg p-4">
            <h3 className="font-medium">Video Performance</h3>
            <p className="text-sm">Views, likes, comments, shares, and watch time for your content.</p>
          </div>
          <div className="border rounded-lg p-4">
            <h3 className="font-medium">Audience Insights</h3>
            <p className="text-sm">Follower demographics, growth trends, and active times.</p>
          </div>
          <div className="border rounded-lg p-4">
            <h3 className="font-medium">Content Strategy</h3>
            <p className="text-sm">Best performing videos, optimal posting times, and hashtag performance.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
