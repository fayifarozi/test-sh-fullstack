import { listArticles } from "@/lib/api";
import AllPostsTable from "@/components/AllPostsTable";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus, AlertCircle } from "lucide-react";

export const metadata = {
  title: "All Posts – Sharing Vision",
};

// Fetch a large batch so we can do client-side tab filtering
const FETCH_LIMIT = 100;

export default async function PostsPage() {
  const { data: articles, error } = await listArticles(FETCH_LIMIT, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">All Posts</h1>
          <p className="text-sm text-zinc-500 mt-1">
            Manage and organize your articles.
          </p>
        </div>
        <Button variant="publish" asChild>
          <Link href="/posts/new">
            <Plus className="h-4 w-4" />
            Add New
          </Link>
        </Button>
      </div>

      {error ? (
        <div className="flex items-center gap-2 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>Failed to load articles: {error.message}</span>
        </div>
      ) : (
        <AllPostsTable articles={articles ?? []} />
      )}
    </div>
  );
}
