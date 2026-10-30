import { notFound } from "next/navigation";
import Link from "next/link";
import { getArticle } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Tag,
  Pencil,
  AlertCircle,
  FileText,
} from "lucide-react";

export async function generateMetadata(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;
  const articleId = parseInt(id, 10);
  if (isNaN(articleId)) return { title: "Article – Sharing Vision" };

  const { data: article } = await getArticle(articleId);
  return {
    title: article ? `${article.title} – Sharing Vision` : "Article Detail",
  };
}

function calculateReadingTime(text: string): number {
  const wordsPerMinute = 200;
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
}

export default async function ArticleDetailPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;
  const articleId = parseInt(id, 10);

  if (isNaN(articleId)) {
    notFound();
  }

  const { data: article, error } = await getArticle(articleId);

  if (error?.message?.toLowerCase().includes("not found") || !article) {
    notFound();
  }

  if (error) {
    return (
      <div className="mx-auto max-w-3xl space-y-4 py-8">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/preview" className="flex items-center gap-2 text-zinc-600">
            <ArrowLeft className="h-4 w-4" />
            Back to Preview
          </Link>
        </Button>
        <div className="flex items-center gap-2 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>Failed to load article: {error.message}</span>
        </div>
      </div>
    );
  }

  const createdDate = new Date(article.created_date).toLocaleDateString(
    "id-ID",
    {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    },
  );

  const isUpdated =
    article.updated_date &&
    new Date(article.updated_date).getTime() -
      new Date(article.created_date).getTime() >
      60000;

  const updatedDate = isUpdated
    ? new Date(article.updated_date).toLocaleDateString("id-ID", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  const readingTime = calculateReadingTime(article.content);

  const statusBadge = {
    publish: {
      label: "Published",
      className:
        "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100",
    },
    draft: {
      label: "Draft",
      className:
        "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100",
    },
    thrash: {
      label: "Trashed",
      className: "bg-red-50 text-red-700 border-red-200 hover:bg-red-100",
    },
  }[article.status] ?? {
    label: article.status,
    className: "bg-zinc-50 text-zinc-700 border-zinc-200",
  };

  return (
    <div className="mx-auto max-w-3xl space-y-8 py-4">
      {/* Top Navigation & Action */}
      <div className="flex items-center justify-between border-b border-zinc-200 pb-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/preview" className="flex items-center gap-2 text-zinc-600">
            <ArrowLeft className="h-4 w-4" />
            Back to Preview
          </Link>
        </Button>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/posts/${article.id}/edit`}>
              <Pencil className="h-3.5 w-3.5 mr-1.5" />
              Edit Article
            </Link>
          </Button>
        </div>
      </div>

      {/* Article Header */}
      <header className="space-y-4">
        {/* Badges */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-700 border border-zinc-200">
            <Tag className="h-3 w-3" />
            {article.category}
          </span>
          <span
            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusBadge.className}`}
          >
            {statusBadge.label}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 md:text-4xl leading-tight">
          {article.title}
        </h1>

        {/* Meta Info */}
        <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-500 pt-1">
          <span className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-zinc-400" />
            {createdDate}
          </span>
          {updatedDate && (
            <span className="flex items-center gap-1.5 text-zinc-400">
              (diperbarui {updatedDate})
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-zinc-400" />
            ~{readingTime} min read
          </span>
        </div>
      </header>

      {/* Article Content Container */}
      <article className="rounded-2xl border border-zinc-200 bg-white p-8 md:p-10 shadow-sm">
        <div className="text-zinc-800 leading-relaxed text-base md:text-lg whitespace-pre-line font-normal space-y-4">
          {article.content}
        </div>
      </article>

      {/* Bottom Footer Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-zinc-200 pt-6">
        <div className="flex items-center gap-2 text-xs text-zinc-400">
          <FileText className="h-4 w-4" />
          <span>ID Artikel: #{article.id}</span>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" asChild>
            <Link href="/posts">All Posts</Link>
          </Button>
          <Button variant="default" asChild>
            <Link href="/preview">Browse More Articles</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
