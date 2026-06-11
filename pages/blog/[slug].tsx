import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { GetStaticPaths, GetStaticProps } from "next";
import { blogPosts, BlogPost, getBlogPostBySlug } from "../../lib/blogPosts";
import { cormorant, jost } from "../../lib/fonts";

interface Props { post: BlogPost; }

export default function BlogPostPage({ post }: Props) {
  const dateLabel = new Date(post.date).toLocaleDateString("en-GB", {
    year: "numeric", month: "long", day: "numeric",
  });
  return (
    <>
      <Head>
        <title>{post.title} — Paula Pango</title>
        <meta name="description" content={post.excerpt} />
        <link rel="canonical" href={`https://www.paulapango.com/blog/${post.slug}`} />
      </Head>
      <article className="max-w-3xl mx-auto px-6 py-20">
        <nav className={`text-xs text-text-muted mb-10 flex items-center gap-2 ${jost.className}`}>
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-primary transition-colors">Journal</Link>
          <span>/</span>
          <span className="text-text">{post.title}</span>
        </nav>
        <header className="mb-10">
          <p className={`text-text-muted text-xs mb-4 ${jost.className}`}>{dateLabel}</p>
          <h1 className={`text-4xl md:text-5xl text-text leading-tight mb-6 ${cormorant.className}`}>
            {post.title}
          </h1>
          <div className="relative w-full overflow-hidden bg-surface aspect-[16/9]">
            <Image src={post.imageUrl} alt={post.title} fill priority
              className="object-cover object-center" sizes="(max-width: 768px) 100vw, 768px" />
          </div>
        </header>
        <div className={`text-text-muted leading-relaxed text-sm space-y-4 ${jost.className}`}
          style={{ lineHeight: "1.85" }}
          dangerouslySetInnerHTML={{ __html: post.content }} />
        <div className="mt-16 pt-8 border-t border-border">
          <Link href="/blog" className={`text-xs uppercase tracking-[0.15em] text-primary hover:underline ${jost.className}`}>
            Back to Journal
          </Link>
        </div>
      </article>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: blogPosts.map((p) => ({ params: { slug: p.slug } })),
  fallback: false,
});

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string;
  const post = getBlogPostBySlug(slug);
  if (!post) return { notFound: true };
  return { props: { post } };
};
