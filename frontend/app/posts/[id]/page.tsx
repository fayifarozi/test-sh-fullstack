import { redirect } from "next/navigation";

export default async function PostDetailPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;
  redirect(`/preview/${id}`);
}
