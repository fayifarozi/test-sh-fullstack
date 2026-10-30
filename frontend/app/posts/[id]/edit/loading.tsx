export default function EditLoading() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="h-7 w-36 animate-pulse rounded bg-zinc-200" />
        <div className="h-4 w-52 animate-pulse rounded bg-zinc-100" />
      </div>
      <div className="w-full max-w-2xl mx-auto rounded-xl border border-zinc-200 bg-white shadow-sm p-6 space-y-5">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="space-y-1.5">
            <div className="h-4 w-20 animate-pulse rounded bg-zinc-200" />
            <div className="h-9 w-full animate-pulse rounded-md bg-zinc-100" />
          </div>
        ))}
        <div className="space-y-1.5">
          <div className="h-4 w-20 animate-pulse rounded bg-zinc-200" />
          <div className="h-40 w-full animate-pulse rounded-md bg-zinc-100" />
        </div>
      </div>
    </div>
  );
}
