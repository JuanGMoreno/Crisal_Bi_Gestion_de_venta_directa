import { Skeleton } from "@/shared/components/ui/skeleton";

export function SalesTableSkeleton() {
  return (
    <div className="space-y-4">
      <div className="rounded-md border p-3">
        <div className="flex items-center justify-between gap-3">
          <Skeleton className="h-9 w-72" />
          <Skeleton className="h-9 w-40" />
        </div>
      </div>
      <div className="rounded-md border">
        <div className="space-y-3 p-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-12 w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}

