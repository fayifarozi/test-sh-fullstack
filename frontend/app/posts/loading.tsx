export default function PostsLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-7 w-32 animate-pulse rounded bg-zinc-200" />
          <div className="h-4 w-48 animate-pulse rounded bg-zinc-100" />
        </div>
        <div className="h-9 w-24 animate-pulse rounded-md bg-zinc-200" />
      </div>
      <div className="h-9 w-72 animate-pulse rounded-lg bg-zinc-100" />
      <div className="overflow-hidden rounded-lg border border-zinc-200">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 border-b border-zinc-100 px-4 py-3 last:border-0"
          >
            <div className="h-4 flex-1 animate-pulse rounded bg-zinc-100" />
            <div className="h-5 w-20 animate-pulse rounded-full bg-zinc-100" />
            <div className="h-8 w-16 animate-pulse rounded-md bg-zinc-100" />
          </div>
        ))}
      </div>
    </div>
  );
}
