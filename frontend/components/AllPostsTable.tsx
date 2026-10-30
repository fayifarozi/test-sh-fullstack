"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { updateArticle, deleteArticle, type Article } from "@/lib/api";
import { Pencil, Trash2, Loader2, FileText, Eye } from "lucide-react";

interface AllPostsTableProps {
  articles: Article[];
}

type TabStatus = "publish" | "draft" | "thrash";

const TAB_CONFIG: { value: TabStatus; label: string }[] = [
  { value: "publish", label: "Published" },
  { value: "draft", label: "Drafts" },
  { value: "thrash", label: "Trashed" },
];

function ArticleTable({
  articles,
  onThrash,
  showThrash,
}: {
  articles: Article[];
  onThrash: (article: Article) => void;
  showThrash: boolean;
}) {
  if (articles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-zinc-400">
        <FileText className="h-10 w-10 mb-3" />
        <p className="text-sm">No articles here yet.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-zinc-200">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-zinc-200 bg-zinc-50">
            <th className="px-4 py-3 text-left font-medium text-zinc-500">Title</th>
            <th className="px-4 py-3 text-left font-medium text-zinc-500">Category</th>
            <th className="px-4 py-3 text-right font-medium text-zinc-500">Actions</th>
          </tr>
        </thead>
        <tbody>
          {articles.map((article, idx) => (
            <tr
              key={article.id}
              className={
                idx < articles.length - 1 ? "border-b border-zinc-100" : ""
              }
            >
              <td className="px-4 py-3 font-medium text-zinc-900 max-w-xs truncate">
                {article.title}
              </td>
              <td className="px-4 py-3 text-zinc-500">
                <span className="inline-flex items-center rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600">
                  {article.category}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-1">
                  <Button variant="ghost" size="icon" asChild title="View Article">
                    <Link href={`/preview/${article.id}`}>
                      <Eye className="h-4 w-4 text-zinc-600 hover:text-zinc-900" />
                      <span className="sr-only">View</span>
                    </Link>
                  </Button>
                  <Button variant="ghost" size="icon" asChild title="Edit">
                    <Link href={`/posts/${article.id}/edit`}>
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Link>
                  </Button>
                  {showThrash && (
                    <Button
                      variant="ghost"
                      size="icon"
                      title="Move to Trash"
                      className="text-red-500 hover:text-red-600 hover:bg-red-50"
                      onClick={() => onThrash(article)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Thrash</span>
                    </Button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function AllPostsTable({ articles }: AllPostsTableProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [thrashTarget, setThrashTarget] = useState<Article | null>(null);
  const [thrashing, setThrashing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const byStatus = (status: TabStatus) =>
    articles.filter((a) => a.status === status);

  async function confirmThrash() {
    if (!thrashTarget) return;
    setThrashing(true);
    setErrorMsg(null);
    const { error } = await updateArticle(thrashTarget.id, {
      title: thrashTarget.title,
      content: thrashTarget.content,
      category: thrashTarget.category,
      status: "thrash",
    });
    setThrashing(false);
    if (error) {
      setErrorMsg(error.message);
      return;
    }
    setThrashTarget(null);
    startTransition(() => router.refresh());
  }

  return (
    <>
      <Tabs defaultValue="publish">
        <TabsList className="mb-4">
          {TAB_CONFIG.map(({ value, label }) => (
            <TabsTrigger key={value} value={value}>
              {label}
              <span className="ml-1.5 rounded-full bg-zinc-200 px-1.5 py-0.5 text-xs font-medium text-zinc-600">
                {byStatus(value).length}
              </span>
            </TabsTrigger>
          ))}
        </TabsList>

        {TAB_CONFIG.map(({ value }) => (
          <TabsContent key={value} value={value}>
            <ArticleTable
              articles={byStatus(value)}
              onThrash={setThrashTarget}
              showThrash={value !== "thrash"}
            />
          </TabsContent>
        ))}
      </Tabs>

      {/* Thrash confirmation dialog */}
      <Dialog
        open={thrashTarget !== null}
        onOpenChange={(open) => {
          if (!open) {
            setThrashTarget(null);
            setErrorMsg(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Move to Trash?</DialogTitle>
            <DialogDescription>
              &ldquo;{thrashTarget?.title}&rdquo; will be moved to Trashed. You
              can restore it by editing and re-publishing.
            </DialogDescription>
          </DialogHeader>
          {errorMsg && (
            <p className="text-sm text-red-600">{errorMsg}</p>
          )}
          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => {
                setThrashTarget(null);
                setErrorMsg(null);
              }}
              disabled={thrashing}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmThrash}
              disabled={thrashing}
            >
              {thrashing && <Loader2 className="h-4 w-4 animate-spin" />}
              Move to Trash
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
