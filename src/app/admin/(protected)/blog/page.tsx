import { prisma } from "@/lib/prisma";
import { AdminHeader } from "@/components/admin/ui";
import { PostsManager, type PostRow } from "@/components/admin/posts-manager";

export default async function AdminBlogPage() {
  const rows = await prisma.blogPost.findMany({
    orderBy: { publishedAt: "desc" },
  });

  const posts: PostRow[] = rows.map((p) => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    category: p.category,
    image: p.image,
    imageAlt: p.imageAlt,
    published: p.published,
    publishedAt: p.publishedAt.toISOString(),
    content: p.content,
    author: p.author,
  }));

  return (
    <>
      <AdminHeader
        title="Journal"
        description="Write, edit and publish blog posts — Markdown content with rich-text preview."
      />
      <PostsManager posts={posts} />
    </>
  );
}