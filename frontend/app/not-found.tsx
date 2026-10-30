import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <FileQuestion className="h-14 w-14 text-zinc-300 mb-4" />
      <h1 className="text-3xl font-bold text-zinc-900">404 – Not Found</h1>
      <p className="mt-2 text-zinc-500">
        The page or article you were looking for doesn&apos;t exist.
      </p>
      <Button variant="outline" asChild className="mt-6">
        <Link href="/posts">Back to All Posts</Link>
      </Button>
    </div>
  );
}
