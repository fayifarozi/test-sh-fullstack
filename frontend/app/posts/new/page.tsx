import ArticleForm from "@/components/ArticleForm";

export const metadata = {
  title: "Add New Article – Sharing Vision",
};

export default function NewPostPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900">Add New Article</h1>
        <p className="text-sm text-zinc-500 mt-1">
          Create a new article and publish or save as draft.
        </p>
      </div>
      <ArticleForm />
    </div>
  );
}
