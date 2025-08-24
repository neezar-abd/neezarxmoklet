'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Calendar, Clock, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
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

export function ArticlesResponsive() {
  const [posts, setPosts] = useState<PostData[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const carouselRef = useRef<HTMLDivElement>(null);
  const announceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/blog');
        if (response.ok) {
          const blogPosts: BlogPost[] = await response.json();
          
          // Convert blog posts to PostData format
          const convertedPosts: PostData[] = blogPosts.map(post => ({
            slug: post.slug,
            title: post.frontmatter.title,
            excerpt: post.excerpt || post.frontmatter.description,
            date: post.frontmatter.date,
            readingTime: post.readingTime.text,
            tags: post.frontmatter.tags
          }));
          
          setPosts(convertedPosts);
        } else {
          // Fallback to static data
          setPosts(fallbackPosts);
        }
      } catch (error) {
        console.error('Failed to fetch posts:', error);
        setPosts(fallbackPosts);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Update scroll buttons state
  const updateScrollButtons = () => {
    if (!carouselRef.current) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
  };

  // Handle scroll with momentum and snap
  const scrollToSlide = (direction: 'prev' | 'next') => {
    if (!carouselRef.current) return;

    const container = carouselRef.current;
    const cardWidth = container.clientWidth * 0.85; // 85vw
    const gap = 16; // 1rem gap
    const scrollAmount = cardWidth + gap;

    const newScrollLeft = direction === 'next' 
      ? container.scrollLeft + scrollAmount
      : container.scrollLeft - scrollAmount;

    container.scrollTo({
      left: newScrollLeft,
      behavior: 'smooth'
    });

    // Update current slide for accessibility
    const newSlide = Math.round(newScrollLeft / scrollAmount);
    setCurrentSlide(Math.max(0, Math.min(newSlide, posts.length - 1)));
    
    // Announce slide change
    if (announceRef.current && posts[newSlide]) {
      announceRef.current.textContent = `Artikel ${newSlide + 1} dari ${posts.length}: ${posts[newSlide].title}`;
    }
  };

  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      updateScrollButtons();
    };

    const carousel = carouselRef.current;
    if (carousel) {
      carousel.addEventListener('scroll', handleScroll);
      updateScrollButtons(); // Initial state

      return () => carousel.removeEventListener('scroll', handleScroll);
    }
  }, [posts]);

  const featuredPost = posts[0];
  const allPosts = posts; // For mobile carousel, show all posts
  const gridPosts = posts.slice(1, 7); // For desktop grid, skip featured

  if (loading) {
    return (
      <section id="articles" className="scroll-mt-24 py-20 bg-gradient-to-br from-background via-background to-muted/20">
        <div className="container">
          <div className="animate-pulse space-y-8">
            <div className="text-center space-y-4">
              <div className="h-8 bg-muted rounded w-64 mx-auto"></div>
              <div className="h-4 bg-muted rounded w-96 mx-auto"></div>
            </div>
            
            {/* Mobile Loading */}
            <div className="md:hidden">
              <div className="h-64 bg-muted rounded-2xl mb-4"></div>
              <div className="flex gap-4 overflow-hidden">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="min-w-[85vw] h-48 bg-muted rounded-2xl"></div>
                ))}
              </div>
            </div>

            {/* Desktop Loading */}
            <div className="hidden md:block">
              <div className="h-64 bg-muted rounded-2xl mb-8"></div>
              <ArticleCardGrid>
                {Array.from({ length: 6 }).map((_, i) => (
                  <ArticleCardSkeleton key={i} />
                ))}
              </ArticleCardGrid>
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

        {/* Accessibility announcer */}
        <div 
          ref={announceRef}
          className="sr-only" 
          aria-live="polite" 
          aria-atomic="true"
        />

        {/* Mobile Carousel (≤md) */}
        <div className="md:hidden">
          {/* Featured Article */}
          {featuredPost && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="mb-8"
            >
              <ArticleCard
                title={featuredPost.title}
                excerpt={featuredPost.excerpt}
                date={featuredPost.date}
                readingTime={featuredPost.readingTime}
                tags={featuredPost.tags}
                href={`/blog/${featuredPost.slug}`}
                featured={true}
              />
            </motion.div>
          )}

          {/* Carousel Container */}
          {allPosts.length > 1 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative mb-8"
            >
              {/* Carousel Title */}
              <h3 className="text-xl font-display font-semibold mb-4 px-4">
                Artikel Lainnya
              </h3>

              {/* Gradient Masks */}
              <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
              <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

              {/* Carousel */}
              <div
                ref={carouselRef}
                className={cn(
                  "flex gap-4 overflow-x-auto scrollbar-hide",
                  "scroll-smooth snap-x snap-mandatory",
                  "px-4 pb-4"
                )}
                style={{
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                }}
              >
                {allPosts.slice(1).map((post, index) => (
                  <motion.div
                    key={post.slug}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1 * index }}
                    className="min-w-[85vw] snap-center"
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

              {/* Navigation Controls */}
              <div className="flex justify-center gap-2 mt-4">
                <button
                  onClick={() => scrollToSlide('prev')}
                  disabled={!canScrollLeft}
                  className={cn(
                    "p-2 rounded-full transition-all duration-300",
                    "bg-background/80 backdrop-blur-sm border border-border/50",
                    "hover:bg-primary hover:text-primary-foreground",
                    "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                    "disabled:opacity-50 disabled:cursor-not-allowed",
                    "motion-safe:hover:scale-105"
                  )}
                  aria-label="Artikel sebelumnya"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                
                <button
                  onClick={() => scrollToSlide('next')}
                  disabled={!canScrollRight}
                  className={cn(
                    "p-2 rounded-full transition-all duration-300",
                    "bg-background/80 backdrop-blur-sm border border-border/50",
                    "hover:bg-primary hover:text-primary-foreground",
                    "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                    "disabled:opacity-50 disabled:cursor-not-allowed",
                    "motion-safe:hover:scale-105"
                  )}
                  aria-label="Artikel selanjutnya"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Desktop Grid (≥lg) - Reuse existing layout */}
        <div className="hidden md:block">
          {/* Featured Article */}
          {featuredPost && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="mb-12"
            >
              <ArticleCard
                title={featuredPost.title}
                excerpt={featuredPost.excerpt}
                date={featuredPost.date}
                readingTime={featuredPost.readingTime}
                tags={featuredPost.tags}
                href={`/blog/${featuredPost.slug}`}
                featured={true}
              />
            </motion.div>
          )}

          {/* Articles Grid */}
          {gridPosts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mb-12"
            >
              <ArticleCardGrid>
                {gridPosts.map((post, index) => (
                  <motion.div
                    key={post.slug}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1 * index }}
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
              </ArticleCardGrid>
            </motion.div>
          )}
        </div>

        {/* View All Articles Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center"
        >
          <Link 
            href="/blog"
            className={cn(
              "inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-semibold transition-all duration-300",
              "bg-gradient-to-r from-primary via-primary to-red-600 text-primary-foreground",
              "hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-1",
              "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
              "active:translate-y-0"
            )}
          >
            Baca Semua Artikel
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
