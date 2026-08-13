import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AdminHeader } from "@/components/admin/ui";
import { PostEditor } from "@/components/admin/post-editor";
import type { PostRow } from "@/components/admin/posts-manager";

export const dynamic = "force-dynamic";

export default async function AdminBlogEditPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;

  if (id) {
    const post = await prisma.blogPost.findUnique({ where: { id } });
    if (!post) notFound();

    const row: PostRow = {
      id: post.id,
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      category: post.category,
      image: post.image,
      imageAlt: post.imageAlt,
      published: post.published,
      publishedAt: post.publishedAt.toISOString(),
      content: post.content,
      author: post.author,
    };
    return (
      <>
        <AdminHeader
          title="Edit post"
          description="Compose with the rich text editor — headings, lists, quotes, links and images."
        />
        <PostEditor post={row} />
      </>
    );
  }

  return (
    <>
      <AdminHeader
        title="New post"
        description="Compose with the rich text editor — headings, lists, quotes, links and images."
      />
      <PostEditor post={null} />
    </>
  );
}