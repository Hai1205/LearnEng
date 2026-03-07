import { Skeleton } from "@/components/ui/skeleton";

export default function QuizzSkeleton() {
  return (
    <div className="min-h-screen bg-linear-to-br from-[#0d1117] via-[#161b22] to-[#0d1117] font-serif flex items-center justify-center p-5">
      <div className="bg-white/4 backdrop-blur-2xl border border-white/10 rounded-[28px] p-10 max-w-125 w-full shadow-[0_24px_80px_rgba(0,0,0,0.5)]">
        {/* Header */}
        <div className="text-center mb-9">
          <Skeleton className="h-14 w-14 rounded-2xl mx-auto mb-2.5" />
          <Skeleton className="h-7 w-24 mx-auto mb-2 rounded-lg" />
          <Skeleton className="h-3 w-56 mx-auto rounded" />
        </div>

        <div className="flex flex-col gap-4.5">
          {/* Level */}
          <div>
            <Skeleton className="h-3 w-16 rounded mb-2.5" />
            <div className="flex gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="flex-1 h-10 rounded-[10px]" />
              ))}
            </div>
          </div>

          {/* Category dropdown */}
          <div>
            <Skeleton className="h-3 w-20 rounded mb-2.5" />
            <Skeleton className="h-10 w-full rounded-[10px]" />
          </div>

          {/* Topic dropdown */}
          <div>
            <Skeleton className="h-3 w-18 rounded mb-2.5" />
            <Skeleton className="h-10 w-full rounded-[10px]" />
          </div>

          {/* Question count */}
          <div>
            <Skeleton className="h-3 w-24 rounded mb-2.5" />
            <Skeleton className="h-10 w-full rounded-[10px]" />
          </div>

          {/* Shuffle toggle */}
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-28 rounded" />
            <Skeleton className="h-6 w-11 rounded-full" />
          </div>

          {/* Start button */}
          <Skeleton className="h-13 w-full rounded-2xl mt-2" />
        </div>
      </div>
    </div>
  );
}
