import Link from "next/link";
import { listArticles, type Article } from "@/lib/api";
import Pagination from "@/components/Pagination";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { AlertCircle, BookOpen, ArrowRight } from "lucide-react";
import { Suspense } from "react";

export const metadata = {
  title: "Preview – Sharing Vision",
};

const PAGE_SIZE = 5;

function ArticleCard({ article }: { article: Article }) {
  const preview =
    article.content.length > 250
      ? article.content.slice(0, 250) + "…"
      : article.content;

  const date = new Date(article.created_date).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Card className="hover:shadow-md transition-shadow group flex flex-col justify-between">
      <div>
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-4">
            <Link
              href={`/preview/${article.id}`}
              className="group-hover:text-emerald-600 transition-colors"
            >
              <CardTitle className="text-lg leading-snug cursor-pointer">
                {article.title}
              </CardTitle>
            </Link>
            <span className="shrink-0 inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 border border-emerald-200">
              {article.category}
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">{date}</p>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-zinc-600 leading-relaxed whitespace-pre-line">
            {preview}
          </p>
        </CardContent>
      </div>
      <CardFooter className="pt-2 border-t border-zinc-100 flex justify-end">
        <Link
          href={`/preview/${article.id}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 hover:text-emerald-700 hover:underline"
        >
          Read full article
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </CardFooter>
    </Card>
  );
}

interface PreviewPageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function PreviewPage({ searchParams }: PreviewPageProps) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, parseInt(pageParam ?? "1", 10) || 1);
  const offset = (page - 1) * PAGE_SIZE;

  // Fetch enough to know total published — fetch large batch then filter
  // The API doesn't support status filtering, so we fetch all and filter client-side.
  // For a better approach: fetch a big batch to determine total, then slice.
  const { data: allArticles, error } = await listArticles(100, 0);

  if (error) {
    return (
      <div className="flex items-center gap-2 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        <AlertCircle className="h-4 w-4 shrink-0" />
        Failed to load articles: {error.message}
      </div>
    );
  }

  const published = (allArticles ?? []).filter((a) => a.status === "publish");
  const totalPages = Math.max(1, Math.ceil(published.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageArticles = published.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">Blog Preview</h1>
        <p className="text-sm text-zinc-500 mt-1">
          Published articles — {published.length} total
        </p>
      </div>

      {published.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-zinc-400">
          <BookOpen className="h-12 w-12 mb-4" />
          <p className="text-base font-medium">No published articles yet</p>
          <p className="text-sm mt-1">
            Create and publish an article to see it here.
          </p>
        </div>
      ) : (
        <>
          <div className="grid gap-4">
            {pageArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
          <Suspense>
            <Pagination page={currentPage} totalPages={totalPages} />
          </Suspense>
        </>
      )}
    </div>
  );
}
