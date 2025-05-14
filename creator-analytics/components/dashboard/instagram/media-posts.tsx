"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Heart, MessageCircle, Bookmark, Eye, Users, Share } from "lucide-react"

// Update the MediaInsights interface to match the new data structure
interface MediaInsights {
  impressions?: number
  reach?: number
  engagement?: number
  saves?: number
  comments?: number
  shares?: number
}

// Update the MediaPost interface to match the new data structure
interface MediaPost {
  id: string
  media_type?: string
  media_url?: string
  permalink?: string
  caption?: string
  timestamp?: string
  like_count?: number
  comments_count?: number
  insights?: MediaInsights
}

interface MediaPostsProps {
  posts?: MediaPost[] | null
}

export function MediaPosts({ posts }: MediaPostsProps) {
  const [selectedPost, setSelectedPost] = useState<MediaPost | null>(null)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  // Format date to a more readable format
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Unknown date"
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    } catch (e) {
      return "Invalid date"
    }
  }

  // Truncate text if it's too long
  const truncateText = (text?: string, maxLength = 100) => {
    if (!text) return ""
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + "..."
  }

  // Handle empty or null posts array
  if (!posts || posts.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No media posts available</p>
      </div>
    )
  }

  return (
    <div>
      {/* View mode toggle */}
      <div className="flex justify-end mb-4">
        <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as "grid" | "list")} className="w-[200px]">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="grid">Grid</TabsTrigger>
            <TabsTrigger value="list">List</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Grid view */}
      {viewMode === "grid" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Card key={post.id} className="overflow-hidden">
              <div className="relative h-48 w-full">
                <Image
                  src={post.media_url || "/placeholder.svg?height=300&width=300"}
                  alt={post.caption || "Instagram post"}
                  fill
                  className="object-cover"
                />
                {/* Media type indicator */}
                <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded-md text-xs">
                  {post.media_type === "VIDEO"
                    ? "Video"
                    : post.media_type === "CAROUSEL_ALBUM"
                      ? "Album"
                      : post.media_type === "STORY"
                        ? "Story"
                        : "Image"}
                </div>
              </div>

              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-3 w-3 mr-1" />
                    {formatDate(post.timestamp)}
                  </div>
                  {post.like_count !== undefined && (
                    <div className="flex items-center text-sm">
                      <Heart className="h-3 w-3 mr-1 text-rose-500" />
                      {post.like_count}
                    </div>
                  )}
                </div>

                <p className="text-sm text-muted-foreground mb-4">{truncateText(post.caption)}</p>

                {/* Insights Dialog Trigger */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="w-full" onClick={() => setSelectedPost(post)}>
                      View Insights
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>Post Insights</DialogTitle>
                      <DialogDescription>Detailed performance metrics for this post.</DialogDescription>
                    </DialogHeader>

                    {selectedPost && (
                      <div className="space-y-4">
                        {/* Post info */}
                        <div className="flex space-x-4">
                          <div className="relative h-20 w-20 flex-shrink-0">
                            <Image
                              src={selectedPost.media_url || "/placeholder.svg"}
                              alt="Post thumbnail"
                              fill
                              className="rounded-md object-cover"
                            />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Posted on {formatDate(selectedPost.timestamp)}
                            </p>
                            <p className="text-sm mt-1">{truncateText(selectedPost.caption, 120)}</p>
                          </div>
                        </div>

                        {/* Insights tabs */}
                        <Tabs defaultValue="performance">
                          <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="performance">Performance</TabsTrigger>
                            <TabsTrigger value="engagement">Engagement</TabsTrigger>
                          </TabsList>

                          <TabsContent value="performance" className="mt-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="flex flex-col items-center rounded-lg border p-3">
                                <Eye className="h-5 w-5 text-muted-foreground mb-1" />
                                <p className="text-sm text-muted-foreground">Impressions</p>
                                <p className="text-lg font-bold">{selectedPost.insights?.impressions || 0}</p>
                              </div>
                              <div className="flex flex-col items-center rounded-lg border p-3">
                                <Users className="h-5 w-5 text-muted-foreground mb-1" />
                                <p className="text-sm text-muted-foreground">Reach</p>
                                <p className="text-lg font-bold">{selectedPost.insights?.reach || 0}</p>
                              </div>
                            </div>
                          </TabsContent>

                          <TabsContent value="engagement" className="mt-4">
                            <div className="grid grid-cols-2 gap-3">
                              <div className="flex flex-col items-center rounded-lg border p-3">
                                <Heart className="h-4 w-4 text-muted-foreground mb-1" />
                                <p className="text-xs text-muted-foreground">Likes</p>
                                <p className="text-lg font-bold">{selectedPost.like_count || 0}</p>
                              </div>
                              <div className="flex flex-col items-center rounded-lg border p-3">
                                <MessageCircle className="h-4 w-4 text-muted-foreground mb-1" />
                                <p className="text-xs text-muted-foreground">Comments</p>
                                <p className="text-lg font-bold">{selectedPost.comments_count || 0}</p>
                              </div>
                              <div className="flex flex-col items-center rounded-lg border p-3">
                                <Bookmark className="h-4 w-4 text-muted-foreground mb-1" />
                                <p className="text-xs text-muted-foreground">Saves</p>
                                <p className="text-lg font-bold">{selectedPost.insights?.saves || 0}</p>
                              </div>
                              <div className="flex flex-col items-center rounded-lg border p-3">
                                <Share className="h-4 w-4 text-muted-foreground mb-1" />
                                <p className="text-xs text-muted-foreground">Shares</p>
                                <p className="text-lg font-bold">{selectedPost.insights?.shares || 0}</p>
                              </div>
                            </div>
                          </TabsContent>
                        </Tabs>

                        <div className="flex justify-end">
                          <Button variant="outline" asChild>
                            <a href={selectedPost.permalink || "#"} target="_blank" rel="noopener noreferrer">
                              View on Instagram
                            </a>
                          </Button>
                        </div>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* List view */}
      {viewMode === "list" && (
        <div className="space-y-4">
          {posts.map((post) => (
            <Card key={post.id} className="overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <div className="relative h-48 md:h-auto md:w-48 flex-shrink-0">
                  <Image
                    src={post.media_url || "/placeholder.svg?height=300&width=300"}
                    alt={post.caption || "Instagram post"}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded-md text-xs">
                    {post.media_type === "VIDEO"
                      ? "Video"
                      : post.media_type === "CAROUSEL_ALBUM"
                        ? "Album"
                        : post.media_type === "STORY"
                          ? "Story"
                          : "Image"}
                  </div>
                </div>
                <CardContent className="p-4 flex-1">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3 mr-1" />
                      {formatDate(post.timestamp)}
                    </div>
                    <div className="flex items-center gap-3">
                      {post.like_count !== undefined && (
                        <div className="flex items-center text-sm">
                          <Heart className="h-3 w-3 mr-1 text-rose-500" />
                          {post.like_count}
                        </div>
                      )}
                      {post.comments_count !== undefined && (
                        <div className="flex items-center text-sm">
                          <MessageCircle className="h-3 w-3 mr-1 text-blue-500" />
                          {post.comments_count}
                        </div>
                      )}
                    </div>
                  </div>

                  <p className="text-sm mb-4">{truncateText(post.caption, 200)}</p>

                  <div className="flex flex-wrap gap-4 mt-auto">
                    <div className="flex items-center text-sm">
                      <Eye className="h-4 w-4 mr-1 text-muted-foreground" />
                      <span>{post.insights?.impressions || 0} impressions</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Users className="h-4 w-4 mr-1 text-muted-foreground" />
                      <span>{post.insights?.reach || 0} reach</span>
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setSelectedPost(post)}>
                          View Insights
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[500px]">
                        {/* Same dialog content as in grid view */}
                        <DialogHeader>
                          <DialogTitle>Post Insights</DialogTitle>
                          <DialogDescription>Detailed performance metrics for this post.</DialogDescription>
                        </DialogHeader>

                        {selectedPost && (
                          <div className="space-y-4">
                            {/* Post info */}
                            <div className="flex space-x-4">
                              <div className="relative h-20 w-20 flex-shrink-0">
                                <Image
                                  src={selectedPost.media_url || "/placeholder.svg"}
                                  alt="Post thumbnail"
                                  fill
                                  className="rounded-md object-cover"
                                />
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">
                                  Posted on {formatDate(selectedPost.timestamp)}
                                </p>
                                <p className="text-sm mt-1">{truncateText(selectedPost.caption, 120)}</p>
                              </div>
                            </div>

                            {/* Insights tabs */}
                            <Tabs defaultValue="performance">
                              <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="performance">Performance</TabsTrigger>
                                <TabsTrigger value="engagement">Engagement</TabsTrigger>
                              </TabsList>

                              <TabsContent value="performance" className="mt-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="flex flex-col items-center rounded-lg border p-3">
                                    <Eye className="h-5 w-5 text-muted-foreground mb-1" />
                                    <p className="text-sm text-muted-foreground">Impressions</p>
                                    <p className="text-lg font-bold">{selectedPost.insights?.impressions || 0}</p>
                                  </div>
                                  <div className="flex flex-col items-center rounded-lg border p-3">
                                    <Users className="h-5 w-5 text-muted-foreground mb-1" />
                                    <p className="text-sm text-muted-foreground">Reach</p>
                                    <p className="text-lg font-bold">{selectedPost.insights?.reach || 0}</p>
                                  </div>
                                </div>
                              </TabsContent>

                              <TabsContent value="engagement" className="mt-4">
                                <div className="grid grid-cols-2 gap-3">
                                  <div className="flex flex-col items-center rounded-lg border p-3">
                                    <Heart className="h-4 w-4 text-muted-foreground mb-1" />
                                    <p className="text-xs text-muted-foreground">Likes</p>
                                    <p className="text-lg font-bold">{selectedPost.like_count || 0}</p>
                                  </div>
                                  <div className="flex flex-col items-center rounded-lg border p-3">
                                    <MessageCircle className="h-4 w-4 text-muted-foreground mb-1" />
                                    <p className="text-xs text-muted-foreground">Comments</p>
                                    <p className="text-lg font-bold">{selectedPost.comments_count || 0}</p>
                                  </div>
                                  <div className="flex flex-col items-center rounded-lg border p-3">
                                    <Bookmark className="h-4 w-4 text-muted-foreground mb-1" />
                                    <p className="text-xs text-muted-foreground">Saves</p>
                                    <p className="text-lg font-bold">{selectedPost.insights?.saves || 0}</p>
                                  </div>
                                  <div className="flex flex-col items-center rounded-lg border p-3">
                                    <Share className="h-4 w-4 text-muted-foreground mb-1" />
                                    <p className="text-xs text-muted-foreground">Shares</p>
                                    <p className="text-lg font-bold">{selectedPost.insights?.shares || 0}</p>
                                  </div>
                                </div>
                              </TabsContent>
                            </Tabs>

                            <div className="flex justify-end">
                              <Button variant="outline" asChild>
                                <a href={selectedPost.permalink || "#"} target="_blank" rel="noopener noreferrer">
                                  View on Instagram
                                </a>
                              </Button>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
