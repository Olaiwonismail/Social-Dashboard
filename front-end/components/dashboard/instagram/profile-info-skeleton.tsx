import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function ProfileInfoSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-6">
          {/* Profile Picture Skeleton */}
          <div className="flex flex-col items-center">
            <Skeleton className="h-24 w-24 rounded-full mb-2" />
            <Skeleton className="h-5 w-32 mb-1" />
            <Skeleton className="h-4 w-24" />
          </div>

          {/* Profile Stats Skeleton */}
          <div className="flex-1">
            <div className="grid grid-cols-3 gap-4 mb-4 text-center">
              <div className="flex flex-col items-center">
                <Skeleton className="h-7 w-16 mb-1" />
                <Skeleton className="h-4 w-10" />
              </div>
              <div className="flex flex-col items-center">
                <Skeleton className="h-7 w-16 mb-1" />
                <Skeleton className="h-4 w-16" />
              </div>
              <div className="flex flex-col items-center">
                <Skeleton className="h-7 w-16 mb-1" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>

            {/* Bio Skeleton */}
            <div className="mt-4">
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2 mb-2" />
              <Skeleton className="h-4 w-40 mt-3" />
            </div>
          </div>

          {/* Quick Stats Skeleton */}
          <div className="grid grid-cols-1 gap-4 mt-4 md:mt-0 w-full md:w-auto">
            <Skeleton className="h-20 w-full md:w-48" />
            <Skeleton className="h-20 w-full md:w-48" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
