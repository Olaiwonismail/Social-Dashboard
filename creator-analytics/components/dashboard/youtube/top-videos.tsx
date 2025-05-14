"use client"

import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Eye, Clock, ThumbsUp, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Video {
  id: string
  title: string
  thumbnail: string
  views: number
  watch_time: number
  likes: number
  comments: number
}

interface TopVideosProps {
  videos: Video[]
}

export function TopVideos({ videos }: TopVideosProps) {
  // Format numbers to display with commas (e.g., 1,234)
  const formatNumber = (num?: number) => {
    return num ? num.toLocaleString() : "0"
  }

  // Format watch time from minutes to hours and minutes
  const formatWatchTime = (minutes?: number) => {
    if (!minutes) return "0 min"
    if (minutes < 60) return `${minutes} min`

    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60

    if (remainingMinutes === 0) return `${hours} hr`
    return `${hours} hr ${remainingMinutes} min`
  }

  // Handle empty videos array
  if (!videos || videos.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No videos available</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {videos.map((video) => (
        <Card key={video.id} className="overflow-hidden">
          <div className="flex flex-col md:flex-row">
            <div className="relative h-48 md:h-auto md:w-64 flex-shrink-0">
              <Image
                src={video.thumbnail || "/placeholder.svg?height=300&width=300"}
                alt={video.title || "YouTube video"}
                fill
                className="object-cover"
              />
              <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded-md text-xs">
                YouTube
              </div>
            </div>
            <CardContent className="p-4 flex-1">
              <h3 className="font-medium mb-2 line-clamp-2">{video.title}</h3>

              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Eye className="h-4 w-4 mr-1" />
                  <span>{formatNumber(video.views)} views</span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{formatWatchTime(video.watch_time)}</span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <ThumbsUp className="h-4 w-4 mr-1" />
                  <span>{formatNumber(video.likes)} likes</span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <MessageSquare className="h-4 w-4 mr-1" />
                  <span>{formatNumber(video.comments)} comments</span>
                </div>
              </div>

              <Button variant="outline" size="sm" asChild>
                <a href={`https://youtube.com/watch?v=${video.id}`} target="_blank" rel="noopener noreferrer">
                  Watch on YouTube
                </a>
              </Button>
            </CardContent>
          </div>
        </Card>
      ))}
    </div>
  )
}
