import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function AccountInsightsSkeleton() {
  return (
    <div className="w-full">
      <Tabs defaultValue="profile_views" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2 mb-4">
          <TabsTrigger value="profile_views">Profile Views</TabsTrigger>
          <TabsTrigger value="website_clicks">Website Clicks</TabsTrigger>
        </TabsList>

        <TabsContent value="profile_views" className="pt-4">
          <div className="h-[300px] w-full bg-muted/20 rounded-md border flex items-center justify-center">
            <div className="space-y-4 w-full px-6">
              {/* X-Axis labels */}
              <div className="flex justify-between mt-auto">
                {[...Array(7)].map((_, i) => (
                  <Skeleton key={i} className="h-2 w-10" />
                ))}
              </div>

              {/* Chart bars/lines */}
              <div className="flex items-end justify-between h-40">
                {[...Array(7)].map((_, i) => (
                  <Skeleton key={i} className="w-8 h-12 md:w-12" style={{ height: `${Math.random() * 70 + 30}%` }} />
                ))}
              </div>

              {/* Y-Axis labels */}
              <div className="flex justify-between">
                {[...Array(7)].map((_, i) => (
                  <Skeleton key={i} className="h-2 w-6" />
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4">
            <Skeleton className="h-4 w-72" />
          </div>
        </TabsContent>

        <TabsContent value="website_clicks">{/* Similar structure for website clicks tab */}</TabsContent>
      </Tabs>
    </div>
  )
}
