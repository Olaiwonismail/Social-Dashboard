import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Users, Eye, Video, Calendar } from "lucide-react"

interface ChannelInfoProps {
  channelInfo: {
    id?: string
    name?: string
    description?: string
    thumbnail?: string
    subscribers?: number
    total_views?: number
    total_videos?: number
    created_at?: string
  }
}

export function ChannelInfo({ channelInfo }: ChannelInfoProps) {
  // Format numbers to display with commas (e.g., 1,234)
  const formatNumber = (num?: number) => {
    return num ? num.toLocaleString() : "0"
  }

  // Handle missing data
  if (!channelInfo) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground">Channel information not available</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Channel Thumbnail */}
          <div className="flex flex-col items-center md:items-start">
            <div className="relative h-24 w-24 rounded-full overflow-hidden mb-2">
              <Image
                src={channelInfo.thumbnail || "/placeholder.svg?height=96&width=96"}
                alt={channelInfo.name || "Channel"}
                fill
                className="object-cover"
              />
            </div>
            <h2 className="text-xl font-bold">{channelInfo.name || "Channel Name"}</h2>
            <a
              href={`https://youtube.com/channel/${channelInfo.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary hover:underline"
            >
              View on YouTube
            </a>
          </div>

          {/* Channel Description */}
          <div className="flex-1">
            <p className="text-sm text-muted-foreground mb-4">
              {channelInfo.description || "No description available"}
            </p>

            {/* Channel Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Subscribers</p>
                  <p className="text-lg font-bold">{formatNumber(channelInfo.subscribers)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Total Views</p>
                  <p className="text-lg font-bold">{formatNumber(channelInfo.total_views)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Video className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Videos</p>
                  <p className="text-lg font-bold">{formatNumber(channelInfo.total_videos)}</p>
                </div>
              </div>
              {channelInfo.created_at && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Created</p>
                    <p className="text-lg font-bold">{new Date(channelInfo.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
