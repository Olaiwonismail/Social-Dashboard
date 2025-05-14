import { Skeleton } from "@/components/ui/skeleton"

export function DemographicsSkeleton() {
  return (
    <div className="h-[300px] w-full bg-muted/20 rounded-md border flex items-center justify-center">
      <div className="space-y-4 w-full px-6">
        {/* Chart placeholder */}
        <div className="flex items-end justify-between h-40">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-1 w-12">
              <Skeleton className="w-8 md:w-10" style={{ height: `${Math.random() * 50 + 20}%` }} />
              <Skeleton className="w-8 md:w-10" style={{ height: `${Math.random() * 50 + 20}%` }} />
              <Skeleton className="h-2 w-12" />
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex justify-center gap-4 mt-4">
          <div className="flex items-center gap-2">
            <Skeleton className="h-3 w-3 rounded-full" />
            <Skeleton className="h-3 w-16" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-3 w-3 rounded-full" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
      </div>
    </div>
  )
}
