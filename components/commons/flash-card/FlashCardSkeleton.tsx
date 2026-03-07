import { Skeleton } from "@/components/ui/skeleton";

export default function FlashCardSkeleton() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center px-4 pb-12 font-serif">
      <div className="w-full max-w-115 pt-8">
        {/* Header */}
        <div className="text-center mb-6">
          <Skeleton className="h-8 w-52 mx-auto mb-2 rounded-lg" />
          <Skeleton className="h-3 w-64 mx-auto rounded" />
        </div>

        {/* Mode tabs */}
        <Skeleton className="h-10 w-full rounded-full mb-4" />

        {/* Topic dropdown */}
        <Skeleton className="h-10 w-full rounded-xl mb-3.5" />

        {/* Stats row */}
        <div className="flex justify-between mb-1.5">
          <Skeleton className="h-3 w-28 rounded" />
          <Skeleton className="h-3 w-16 rounded" />
        </div>

        {/* Progress bar */}
        <Skeleton className="h-1 w-full rounded-full mb-1" />
      </div>

      <div className="w-full max-w-115 mt-5">
        {/* Card */}
        <Skeleton className="h-72 w-full rounded-2xl" />

        {/* Navigation */}
        <div className="flex items-center justify-center gap-3.5 mt-4">
          <Skeleton className="w-10 h-10 rounded-full" />
          <div className="flex gap-1 items-center">
            {Array.from({ length: 7 }).map((_, i) => (
              <Skeleton
                key={i}
                className={
                  i === 3
                    ? "h-1.5 w-4.5 rounded-sm"
                    : "h-1.5 w-1.5 rounded-full"
                }
              />
            ))}
          </div>
          <Skeleton className="w-10 h-10 rounded-full" />
        </div>

        {/* Action buttons */}
        <div className="flex justify-center gap-3 mt-5">
          <Skeleton className="h-9 w-32 rounded-full" />
          <Skeleton className="h-9 w-32 rounded-full" />
        </div>
      </div>

      {/* Footer counter */}
      <Skeleton className="h-3 w-40 rounded mt-8" />
    </div>
  );
}
