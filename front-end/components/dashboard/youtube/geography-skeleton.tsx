import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function GeographySkeleton() {
  return (
    <div className="w-full">
      <Tabs defaultValue="views" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2 mb-4">
          <TabsTrigger value="views">Views by Country</TabsTrigger>
          <TabsTrigger value="watchTime">Watch Time by Country</TabsTrigger>
        </TabsList>

        <TabsContent value="views" className="pt-4">
          <div className="h-[300px] w-full bg-muted/20 rounded-md border flex items-center justify-center">
            <div className="space-y-4 w-full px-6">
              {/* Chart bars */}
              <div className="space-y-3 w-full">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-6" style={{ width: `${Math.random() * 50 + 30}%` }} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
