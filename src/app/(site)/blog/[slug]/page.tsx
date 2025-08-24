'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Calendar, Clock, ArrowLeft, ChevronRight, Share2 } from 'lucide-react';
import { MDXRemote } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypePrismPlus from 'rehype-prism-plus';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

interface PostFrontmatter {
  title: string;
  date: string;
  tags: string[];
  description: string;
  ogImage?: string;
  draft?: boolean;
}

interface Post {
  slug: string;
  frontmatter: PostFrontmatter;
  content: string;
  readingTime: {
    text: string;
    minutes: number;
    time: number;
    words: number;
  };
  excerpt: string;
}

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

// Generate TOC from content
function generateToc(content: string) {
  const headingRegex = /^(#{1,6})\s+(.+)$/gm;
  const toc: Array<{ level: number; text: string; id: string }> = [];
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    const id = text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-');
    
    toc.push({ level, text, id });
  }

  return toc;
}

// Table of Contents Component
function TableOfContents({ content }: { content: string }) {
  const [activeId, setActiveId] = useState<string>('');
  const toc = generateToc(content);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-80px 0px -80% 0px' }
    );

    // Observe all headings
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    headings.forEach((heading) => observer.observe(heading));

    return () => observer.disconnect();
  }, []);

  if (toc.length === 0) return null;

  return (
    <Card className="p-4 sticky top-24">
      <h3 className="font-semibold text-sm mb-3">Table of Contents</h3>
      <nav className="space-y-1">
        {toc.map((item: { level: number; text: string; id: string }) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className={`block text-sm transition-colors hover:text-primary ${
              activeId === item.id ? 'text-primary font-medium' : 'text-muted-foreground'
            }`}
            style={{ paddingLeft: `${(item.level - 1) * 12}px` }}
          >
            {item.text}
          </a>
        ))}
      </nav>
    </Card>
  );
}

// Share Button Component
function ShareButton({ title, url }: { title: string; url: string }) {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch (error) {
        console.log('Share failed:', error);
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(url);
      // You could show a toast notification here
    }
  };

  return (
    <Button variant="outline" size="sm" onClick={handleShare}>
      <Share2 className="h-4 w-4 mr-2" />
      Share
    </Button>
  );
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const [post, setPost] = useState<Post | null>(null);
  const [mdxSource, setMdxSource] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPost = async () => {
      try {
        const response = await fetch(`/api/blog/${params.slug}`);
        if (!response.ok) {
          notFound();
          return;
        }

        const postData = await response.json();

        const mdxSource = await serialize(postData.content, {
          mdxOptions: {
            remarkPlugins: [remarkGfm],
            rehypePlugins: [
              rehypeSlug,
              [
                rehypeAutolinkHeadings,
                {
                  behavior: 'wrap',
                  className: ['anchor'],
                },
              ],
              [rehypePrismPlus, { showLineNumbers: true }],
            ],
          },
        });

        setPost(postData);
        setMdxSource(mdxSource);
      } catch (error) {
        console.error('Error loading post:', error);
        notFound();
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [params.slug]);

  if (loading) {
    return (
      <div className="container py-20">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
            <div className="space-y-3">
              <div className="h-4 bg-muted rounded"></div>
              <div className="h-4 bg-muted rounded"></div>
              <div className="h-4 bg-muted rounded w-2/3"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!post || !mdxSource) {
    notFound();
  }

  return (
    <div className="container py-20">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Button variant="ghost" asChild>
            <Link href="/blog" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Blog
            </Link>
          </Button>
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Article Header */}
              <header className="mb-8">
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <time dateTime={post.frontmatter.date}>
                      {new Date(post.frontmatter.date).toLocaleDateString('id-ID', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </time>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{post.readingTime.text}</span>
                  </div>
                  <ShareButton 
                    title={post.frontmatter.title} 
                    url={typeof window !== 'undefined' ? window.location.href : ''} 
                  />
                </div>

                <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
                  {post.frontmatter.title}
                </h1>

                <p className="text-xl text-muted-foreground mb-6">
                  {post.frontmatter.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  {post.frontmatter.tags.map((tag: string) => (
                    <Link key={tag} href={`/blog?tag=${encodeURIComponent(tag)}`}>
                      <Badge variant="outline">
                        {tag}
                      </Badge>
                    </Link>
                  ))}
                </div>
              </header>

              {/* Article Content */}
              <div className="prose prose-lg max-w-none dark:prose-invert">
                <MDXRemote {...mdxSource} />
              </div>

              {/* Article Footer */}
              <footer className="mt-12 pt-8 border-t">
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-2">
                    <span className="text-sm text-muted-foreground">Tags:</span>
                    {post.frontmatter.tags.map((tag: string) => (
                      <Link key={tag} href={`/blog?tag=${encodeURIComponent(tag)}`}>
                        <Badge variant="secondary">
                          {tag}
                        </Badge>
                      </Link>
                    ))}
                  </div>
                  <ShareButton 
                    title={post.frontmatter.title} 
                    url={typeof window !== 'undefined' ? window.location.href : ''} 
                  />
                </div>
              </footer>
            </motion.article>

            {/* Navigation to other posts */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-12"
            >
              <div className="flex justify-center">
                <Button variant="outline" asChild>
                  <Link href="/blog" className="flex items-center gap-2">
                    Lihat Artikel Lainnya
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>

          {/* Sidebar with TOC */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <TableOfContents content={post.content} />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
