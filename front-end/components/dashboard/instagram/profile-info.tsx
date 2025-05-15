import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Users, LinkIcon, TrendingUp } from "lucide-react"

// Update the ProfileInfoProps interface to match the new data structure
interface ProfileInfoProps {
  profile: {
    username?: string
    full_name?: string
    biography?: string
    profile_picture_url?: string
    media_count?: number
    followers_count?: number
    follows_count?: number
    link_in_bio?: string
    profile_views?: number
  }
  engagementRate?: number
}

export function ProfileInfo({ profile, engagementRate }: ProfileInfoProps) {
  // Format numbers to display with commas (e.g., 1,234)
  const formatNumber = (num?: number) => {
    return num ? num.toLocaleString() : "0"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-6">
          {/* Profile Picture */}
          <div className="flex flex-col items-center">
            <Avatar className="h-24 w-24 mb-2">
              <AvatarImage src={profile.profile_picture_url || "/placeholder.svg"} alt={profile.username || "User"} />
              <AvatarFallback>
                {profile.username ? profile.username.substring(0, 2).toUpperCase() : "UN"}
              </AvatarFallback>
            </Avatar>
            <h3 className="text-lg font-semibold">@{profile.username || "username"}</h3>
            <p className="text-sm text-muted-foreground">{profile.full_name || ""}</p>
          </div>

          {/* Profile Stats */}
          <div className="flex-1">
            <div className="grid grid-cols-3 gap-4 mb-4 text-center">
              <div className="flex flex-col">
                <span className="text-2xl font-bold">{formatNumber(profile.media_count)}</span>
                <span className="text-sm text-muted-foreground">Posts</span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold">{formatNumber(profile.followers_count)}</span>
                <span className="text-sm text-muted-foreground">Followers</span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold">{formatNumber(profile.follows_count)}</span>
                <span className="text-sm text-muted-foreground">Following</span>
              </div>
            </div>

            {/* Bio Section */}
            <div className="mt-4">
              <p className="text-sm mb-2">{profile.biography || "No biography available"}</p>
              {profile.link_in_bio && (
                <a
                  href={profile.link_in_bio}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm flex items-center text-primary hover:underline"
                >
                  <LinkIcon className="h-3 w-3 mr-1" /> {profile.link_in_bio}
                </a>
              )}
            </div>
          </div>

          {/* Quick Stats Cards */}
          <div className="grid grid-cols-1 gap-4 mt-4 md:mt-0 w-full md:w-auto">
            <div className="flex items-center gap-2 rounded-lg border p-3">
              <TrendingUp className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Engagement Rate</p>
                <p className="text-lg font-bold">{engagementRate ? engagementRate.toFixed(2) : "0.00"}%</p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-lg border p-3">
              <Users className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Profile Views</p>
                <p className="text-lg font-bold">{formatNumber(profile.profile_views)}</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
