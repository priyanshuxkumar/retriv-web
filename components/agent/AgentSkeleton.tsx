import { Skeleton } from "@/components/ui/skeleton"

export function AgentSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <Skeleton className="h-8 w-[200px] mb-2" />
          <Skeleton className="h-4 w-[300px]" />
        </div>
        <Skeleton className="h-10 w-[100px]" />
      </div>

      <div className="space-y-2">
        <Skeleton className="h-10 w-full" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array(4)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="border rounded-lg p-4 space-y-3">
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-8 w-[60px]" />
                <Skeleton className="h-3 w-[80px]" />
              </div>
            ))}
        </div>

        <div className="border rounded-lg p-6 mt-4 space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-5 w-[150px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>

          <div className="space-y-4 pt-4">
            {Array(3)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="flex gap-4 pb-4 border-b last:border-0">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-[200px]" />
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-[100px]" />
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}
