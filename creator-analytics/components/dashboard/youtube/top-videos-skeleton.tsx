import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

export function TopVideosSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(2)].map((_, index) => (
        <Card key={index} className="overflow-hidden">
          <div className="flex flex-col md:flex-row">
            <Skeleton className="h-48 md:h-auto md:w-64 flex-shrink-0" />
            <CardContent className="p-4 flex-1">
              <Skeleton className="h-6 w-3/4 mb-4" />

              <div className="grid grid-cols-2 gap-2 mb-4">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-24" />
              </div>

              <Skeleton className="h-9 w-36" />
            </CardContent>
          </div>
        </Card>
      ))}
    </div>
  )
}
