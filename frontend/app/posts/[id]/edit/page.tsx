import { notFound } from "next/navigation";
import { getArticle } from "@/lib/api";
import ArticleForm from "@/components/ArticleForm";
import { AlertCircle } from "lucide-react";

export const metadata = {
  title: "Edit Article – Sharing Vision",
};

export default async function EditPostPage(props: {
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
      <div className="flex items-center gap-2 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        <AlertCircle className="h-4 w-4 shrink-0" />
        Failed to load article: {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">Edit Article</h1>
        <p className="text-sm text-zinc-500 mt-1">
          Update your article and publish or save as draft.
        </p>
      </div>
      <ArticleForm
        articleId={articleId}
        defaultValues={{
          title: article.title,
          content: article.content,
          category: article.category,
        }}
      />
    </div>
  );
}
