'use client';

import { useState, useMemo, useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Calendar, Clock, Search, Tag, X } from 'lucide-react';
import Fuse from 'fuse.js';
import { useSearchParams, useRouter } from 'next/navigation';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

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

function BlogPageInner() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedTag = searchParams.get('tag') || '';

  useEffect(() => {
    const fetchBlogData = async () => {
      try {
        const response = await fetch('/api/blog');
        const data = await response.json();
        setPosts(data.posts);
        setAllTags(data.tags);
      } catch (error) {
        console.error('Error fetching blog data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogData();
  }, []);

  // Fuse.js configuration for search
  const fuseOptions = {
    keys: [
      { name: 'frontmatter.title', weight: 0.7 },
      { name: 'frontmatter.description', weight: 0.3 },
      { name: 'frontmatter.tags', weight: 0.5 },
    ],
    threshold: 0.3,
    includeScore: true,
  };

  const fuse = new Fuse(posts, fuseOptions);

  const filteredPosts = useMemo(() => {
    let result = posts;

    // Filter by tag from URL
    if (selectedTag) {
      result = result.filter((post: Post) =>
        post.frontmatter.tags.map((t: string) => t.toLowerCase()).includes(selectedTag.toLowerCase())
      );
    }

    // Apply search
    if (searchTerm.trim()) {
      const searchResults = fuse.search(searchTerm);
      const searchedPosts = searchResults.map(result => result.item);
      
      if (selectedTag) {
        // If tag filter is active, search within filtered results
        const tagFuse = new Fuse(result, fuseOptions);
        const tagSearchResults = tagFuse.search(searchTerm);
        result = tagSearchResults.map(result => result.item);
      } else {
        result = searchedPosts;
      }
    }

    return result;
  }, [searchTerm, selectedTag, posts, fuse]);

  const handleTagClick = (tag: string) => {
    const params = new URLSearchParams(searchParams);
    if (selectedTag === tag) {
      params.delete('tag');
    } else {
      params.set('tag', tag);
    }
    router.push(`/blog?${params.toString()}`);
  };

  const clearFilters = () => {
    setSearchTerm('');
    router.push('/blog');
  };

  if (loading) {
    return (
      <div className="container py-20">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-10 bg-muted rounded w-1/3 mx-auto"></div>
            <div className="h-6 bg-muted rounded w-1/2 mx-auto"></div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-4">
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                  <div className="h-6 bg-muted rounded w-3/4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded"></div>
                    <div className="h-4 bg-muted rounded w-5/6"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-20">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
            Blog
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Catatan teknis seputar Next.js/React, praktik DevOps dasar, dan pelajaran dari proyek.
          </p>
          <p className="text-lg text-muted-foreground mt-4">
            Status: segera hadir.
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="sticky top-20 z-30 bg-background/80 backdrop-blur-md rounded-2xl border p-6 mb-8 shadow-sm"
        >
          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari artikel berdasarkan judul, deskripsi, atau tag..."
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              className="pl-10"
              aria-label="Search blog posts"
            />
          </div>

          {/* Tag Filter */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Tag className="h-4 w-4" />
                <span>Filter by Tags:</span>
              </div>
              
              {(selectedTag || searchTerm) && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearFilters}
                  className="text-xs"
                >
                  <X className="h-3 w-3 mr-1" />
                  Clear Filters
                </Button>
              )}
            </div>
            
            <div className="flex flex-wrap gap-2">
              {allTags.map((tag: string) => (
                <button
                  key={tag}
                  onClick={() => handleTagClick(tag)}
                  className={cn(
                    "inline-flex items-center rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-200",
                    "border border-primary/20 hover:border-primary/40",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    selectedTag === tag
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background hover:bg-primary/5 text-muted-foreground hover:text-primary"
                  )}
                  aria-pressed={selectedTag === tag}
                  aria-label={`Filter by ${tag}`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Results Counter */}
          <div className="mt-4 text-xs text-muted-foreground">
            {filteredPosts.length} artikel ditemukan
            {selectedTag && <span> dengan tag "{selectedTag}"</span>}
            {searchTerm && <span> untuk "{searchTerm}"</span>}
          </div>
        </motion.div>

        {/* Posts Grid */}
        {filteredPosts.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredPosts.map((post: Post, index: number) => (
              <motion.div
                key={post.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="group h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <CardHeader>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <time dateTime={post.frontmatter.date}>
                          {new Date(post.frontmatter.date).toLocaleDateString('id-ID', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </time>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{post.readingTime.text}</span>
                      </div>
                    </div>
                    
                    <CardTitle className="group-hover:text-primary transition-colors">
                      <Link href={`/blog/${post.slug}`}>
                        {post.frontmatter.title}
                      </Link>
                    </CardTitle>
                    
                    <CardDescription className="line-clamp-3">
                      {post.frontmatter.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="flex flex-wrap gap-1.5">
                      {post.frontmatter.tags.slice(0, 3).map((tag: string) => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className="text-xs cursor-pointer hover:bg-primary/10"
                          onClick={() => handleTagClick(tag)}
                        >
                          {tag}
                        </Badge>
                      ))}
                      {post.frontmatter.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{post.frontmatter.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-center py-12"
          >
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-lg font-semibold mb-2">Tidak ada artikel ditemukan</h3>
            <p className="text-muted-foreground mb-4">
              Coba ubah kata kunci pencarian atau pilih tag yang berbeda
            </p>
            <Button variant="outline" onClick={clearFilters}>
              Reset Filter
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default function BlogPage() {
  return (
    <Suspense fallback={<div className="container py-20"><div className="text-center">Loading...</div></div>}>
      <BlogPageInner />
    </Suspense>
  );
}