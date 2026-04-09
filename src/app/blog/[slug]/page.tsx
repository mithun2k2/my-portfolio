import BlogPostClient from "./BlogPostClient"
import { blogPosts } from "../../../data/blog"

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }))
}

interface Props {
  params: { slug: string }
}

export default function BlogPostPage({ params }: Props) {
  return <BlogPostClient slug={params.slug} />
}