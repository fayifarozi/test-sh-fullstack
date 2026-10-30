import Link from "next/link";
import { FileText } from "lucide-react";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <div className="flex items-center gap-2 font-semibold text-zinc-900">
          <FileText className="h-5 w-5 text-emerald-600" />
          <span>Sharing Vision</span>
        </div>
        <nav className="flex items-center gap-1">
          <Link
            href="/posts"
            className="rounded-md px-3 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900"
          >
            All Posts
          </Link>
          <Link
            href="/posts/new"
            className="rounded-md px-3 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900"
          >
            Add New
          </Link>
          <Link
            href="/preview"
            className="rounded-md px-3 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900"
          >
            Preview
          </Link>
        </nav>
      </div>
    </header>
  );
}
