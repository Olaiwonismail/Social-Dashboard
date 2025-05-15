import { Skeleton } from "@/components/ui/skeleton"

export function MediaPostsSkeleton() {
  // Create an array of 6 skeletons for media posts
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, index) => (
        <div key={index} className="border rounded-md overflow-hidden">
          {/* Media image */}
          <Skeleton className="h-48 w-full" />

          {/* Post content */}
          <div className="p-4 space-y-4">
            {/* Date and likes */}
            <div className="flex justify-between">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-3 w-10" />
            </div>

            {/* Caption */}
            <div className="space-y-2">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-5/6" />
              <Skeleton className="h-3 w-4/6" />
            </div>

            {/* Button */}
            <Skeleton className="h-8 w-full" />
          </div>
        </div>
      ))}
    </div>
  )
}
