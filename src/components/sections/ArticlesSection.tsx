'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { fallbackPosts, type PostData } from '@/data/posts';
import { ArticleCard, ArticleCardSkeleton, ArticleCardGrid } from '@/components/blog/ArticleCard';

interface BlogPost {
  slug: string;
  frontmatter: {
    title: string;
    description: string;
    date: string;
    tags: string[];
  };
  readingTime: {
    text: string;
  };
  excerpt: string;
}

interface ArticlesSectionProps {
  limit?: number;
}

export function ArticlesSection({ limit = 4 }: ArticlesSectionProps) {
  const [posts, setPosts] = useState<PostData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/blog');
        if (response.ok) {
          const blogPosts: BlogPost[] = await response.json();
          
          // Convert blog posts to PostData format and sort by date descending
          const convertedPosts: PostData[] = blogPosts
            .map(post => ({
              slug: post.slug,
              title: post.frontmatter.title,
              excerpt: post.excerpt || post.frontmatter.description,
              date: post.frontmatter.date,
              readingTime: post.readingTime.text,
              tags: post.frontmatter.tags
            }))
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
          
          setPosts(convertedPosts);
        } else {
          // Fallback to static data, also sorted by date descending
          const sortedFallbackPosts = [...fallbackPosts]
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
          setPosts(sortedFallbackPosts);
        }
      } catch (error) {
        console.error('Failed to fetch posts:', error);
        // Fallback to static data, sorted by date descending
        const sortedFallbackPosts = [...fallbackPosts]
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setPosts(sortedFallbackPosts);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Get featured post (first post) and grid posts (remaining posts up to limit)
  const featuredPost = posts[0];
  const gridPosts = posts.slice(1, Math.min(limit, posts.length));

  if (loading) {
    return (
      <section id="articles" className="scroll-mt-24 py-20 bg-gradient-to-br from-background via-background to-muted/20">
        <div className="container">
          <div className="animate-pulse space-y-8">
            <div className="text-center space-y-4">
              <div className="h-8 bg-muted rounded w-64 mx-auto"></div>
              <div className="h-4 bg-muted rounded w-96 mx-auto"></div>
            </div>
            <div className="h-64 bg-muted rounded-2xl"></div>
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: Math.min(3, limit - 1) }).map((_, i) => (
                <ArticleCardSkeleton key={i} />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="articles" className="scroll-mt-24 py-20 bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-4">
            Artikel Terbaru
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Insights terbaru tentang teknologi, pengembangan web, dan tips praktis untuk developer
          </p>
        </motion.div>

        {/* Featured Article */}
        {featuredPost && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ 
              duration: 0.7, 
              delay: 0.1,
              ease: "easeOut"
            }}
            className="mb-12"
          >
            <ArticleCard
              title={featuredPost.title}
              excerpt={featuredPost.excerpt}
              date={featuredPost.date}
              readingTime={featuredPost.readingTime}
              tags={featuredPost.tags}
              href={`/blog/${featuredPost.slug}`}
              className="featured-article"
            />
          </motion.div>
        )}

        {/* Articles Grid */}
        {gridPosts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ 
              duration: 0.7, 
              delay: 0.2,
              ease: "easeOut"
            }}
            className="mb-12"
          >
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
              {gridPosts.map((post, index) => (
                <motion.div
                  key={post.slug}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ 
                    duration: 0.5, 
                    delay: 0.1 * index,
                    ease: "easeOut"
                  }}
                >
                  <ArticleCard
                    title={post.title}
                    excerpt={post.excerpt}
                    date={post.date}
                    readingTime={post.readingTime}
                    tags={post.tags}
                    href={`/blog/${post.slug}`}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* View All Articles Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ 
            duration: 0.6, 
            delay: 0.3,
            ease: "easeOut"
          }}
          className="text-center"
        >
          <Link 
            href="/blog"
            className={cn(
              "inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-semibold transition-all duration-300",
              "bg-gradient-to-r from-primary via-primary to-red-600 text-primary-foreground",
              "hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-1",
              "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
              "active:translate-y-0",
              "motion-reduce:transform-none motion-reduce:transition-none"
            )}
            aria-label="Baca semua artikel - menuju halaman blog"
          >
            Baca Semua Artikel
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 motion-reduce:transform-none" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
