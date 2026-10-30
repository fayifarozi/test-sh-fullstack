"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createArticle, updateArticle, type ArticlePayload } from "@/lib/api";
import { AlertCircle, Loader2 } from "lucide-react";

interface ArticleFormProps {
  /** When provided, form is in edit mode */
  articleId?: number;
  defaultValues?: {
    title: string;
    content: string;
    category: string;
  };
}

interface FieldErrors {
  title?: string;
  content?: string;
  category?: string;
  _root?: string;
}

const RULES = {
  title: { min: 20, label: "Title" },
  content: { min: 200, label: "Content" },
  category: { min: 3, label: "Category" },
};

function validate(values: {
  title: string;
  content: string;
  category: string;
}): FieldErrors {
  const errors: FieldErrors = {};
  if (!values.title.trim()) {
    errors.title = "Title is required.";
  } else if (values.title.trim().length < RULES.title.min) {
    errors.title = `Title must be at least ${RULES.title.min} characters.`;
  }
  if (!values.content.trim()) {
    errors.content = "Content is required.";
  } else if (values.content.trim().length < RULES.content.min) {
    errors.content = `Content must be at least ${RULES.content.min} characters.`;
  }
  if (!values.category.trim()) {
    errors.category = "Category is required.";
  } else if (values.category.trim().length < RULES.category.min) {
    errors.category = `Category must be at least ${RULES.category.min} characters.`;
  }
  return errors;
}

export default function ArticleForm({ articleId, defaultValues }: ArticleFormProps) {
  const router = useRouter();
  const isEdit = articleId !== undefined;

  const [title, setTitle] = useState(defaultValues?.title ?? "");
  const [content, setContent] = useState(defaultValues?.content ?? "");
  const [category, setCategory] = useState(defaultValues?.category ?? "");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [pending, setPending] = useState<"publish" | "draft" | null>(null);

  async function handleSubmit(status: "publish" | "draft") {
    const fieldErrors = validate({ title, content, category });
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setPending(status);

    const payload: ArticlePayload = {
      title: title.trim(),
      content: content.trim(),
      category: category.trim(),
      status,
    };

    const { error } = isEdit
      ? await updateArticle(articleId, payload)
      : await createArticle(payload);

    setPending(null);

    if (error) {
      if (error.errors) {
        setErrors(error.errors as FieldErrors);
      } else {
        setErrors({ _root: error.message });
      }
      return;
    }

    router.push("/posts");
    router.refresh();
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{isEdit ? "Edit Article" : "Add New Article"}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {errors._root && (
          <div className="flex items-center gap-2 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {errors._root}
          </div>
        )}

        <div className="space-y-1.5">
          <Label htmlFor="title">
            Title <span className="text-zinc-400 text-xs">(min 20 chars)</span>
          </Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter article title…"
            aria-describedby={errors.title ? "title-error" : undefined}
          />
          {errors.title && (
            <p id="title-error" className="text-xs text-red-600">
              {errors.title}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="category">
            Category <span className="text-zinc-400 text-xs">(min 3 chars)</span>
          </Label>
          <Input
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="e.g. Technology, Sports…"
            aria-describedby={errors.category ? "category-error" : undefined}
          />
          {errors.category && (
            <p id="category-error" className="text-xs text-red-600">
              {errors.category}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="content">
            Content <span className="text-zinc-400 text-xs">(min 200 chars)</span>
          </Label>
          <Textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your article content here…"
            className="min-h-[200px]"
            aria-describedby={errors.content ? "content-error" : undefined}
          />
          <div className="flex justify-between">
            {errors.content ? (
              <p id="content-error" className="text-xs text-red-600">
                {errors.content}
              </p>
            ) : (
              <span />
            )}
            <span className="text-xs text-zinc-400">{content.trim().length} chars</span>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <Button
            variant="publish"
            onClick={() => handleSubmit("publish")}
            disabled={pending !== null}
          >
            {pending === "publish" && (
              <Loader2 className="h-4 w-4 animate-spin" />
            )}
            Publish
          </Button>
          <Button
            variant="draft"
            onClick={() => handleSubmit("draft")}
            disabled={pending !== null}
          >
            {pending === "draft" && (
              <Loader2 className="h-4 w-4 animate-spin" />
            )}
            Draft
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push("/posts")}
            disabled={pending !== null}
          >
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
