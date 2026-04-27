import { Skeleton } from "@/shared/components/ui/skeleton";

export function ProfileSkeleton() {
  return (
    <div className="space-y-4">
      <div className="rounded-3xl border p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center">
          <Skeleton className="h-24 w-24 rounded-full" />
          <div className="flex-1 space-y-3">
            <Skeleton className="h-8 w-56" />
            <Skeleton className="h-4 w-72" />
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-7 w-24 rounded-full" />
              <Skeleton className="h-7 w-28 rounded-full" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="rounded-2xl border p-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="mt-3 h-8 w-16" />
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-3xl border p-5">
          <Skeleton className="h-6 w-44" />
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="rounded-2xl border p-4">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="mt-3 h-5 w-32" />
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border p-5">
          <Skeleton className="h-6 w-32" />
          <div className="mt-5 space-y-4">
            <Skeleton className="h-20 w-full rounded-2xl" />
            <Skeleton className="h-20 w-full rounded-2xl" />
            <Skeleton className="h-20 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
