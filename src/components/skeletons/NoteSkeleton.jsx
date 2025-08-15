import { Skeleton } from "@/components/ui/skeleton";

const NoteSkeleton = () => {
  return (
    <div className="space-y-3 rounded-lg border border-border bg-card p-4 shadow-sm">
      <Skeleton className="h-6 w-3/4" />

      <Skeleton className="h-4 w-1/2" />

      <Skeleton className="h-4 w-1/4" />

      <Skeleton className="h-4 w-1/4" />
    </div>
  );
};

export default NoteSkeleton;
