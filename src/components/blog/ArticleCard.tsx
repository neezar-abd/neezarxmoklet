'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Calendar, Clock, ExternalLink, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface ArticleCardProps {
  title: string;
  excerpt: string;
  date: string;
  readingTime: string;
  tags: string[];
  href: string;
  className?: string;
  featured?: boolean;
}

interface ArticleCardSkeletonProps {
  className?: string;
}

export function ArticleCard({ 
  title, 
  excerpt, 
  date, 
  readingTime, 
  tags, 
  href, 
  className 
}: ArticleCardProps) {
  const formattedDate = new Date(date).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const isFeatured = className?.includes('featured-article');

  return (
    <motion.article
      whileHover={{ 
        y: -2,
        transition: { duration: 0.2, ease: "easeOut" }
      }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "group relative h-full",
        "motion-safe:transition-all motion-safe:duration-300",
        "motion-reduce:transition-none",
        className
      )}
    >
      <Link
        href={href}
        className={cn(
          "block h-full rounded-2xl overflow-hidden",
          "bg-gradient-to-br from-background/80 via-background/90 to-background/80",
          "backdrop-blur-sm border border-border/50",
          "shadow-md hover:shadow-lg",
          "motion-safe:hover:shadow-primary/20 motion-safe:hover:border-primary/30",
          "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
          "motion-safe:transition-all motion-safe:duration-300",
          "motion-reduce:transition-none",
          isFeatured ? "p-8 md:p-10" : "p-6"
        )}
      >
        <div className="relative z-10 h-full flex flex-col">
          {/* Meta Information */}
          <div className={cn(
            "flex items-center justify-between text-muted-foreground mb-4",
            isFeatured ? "text-sm" : "text-sm"
          )}>
            <div className="flex items-center gap-1">
              <Calendar className={cn(isFeatured ? "h-4 w-4" : "h-3 w-3")} />
              <time dateTime={date} className="font-medium">
                {formattedDate}
              </time>
            </div>
            <div className="flex items-center gap-1">
              <Clock className={cn(isFeatured ? "h-4 w-4" : "h-3 w-3")} />
              <span className="font-medium">{readingTime}</span>
            </div>
          </div>

          {/* Title with hover icon */}
          <h3 className={cn(
            "font-display font-bold mb-3 line-clamp-2 flex-grow-0",
            "text-primary group-hover:text-red-600 transition-colors duration-300",
            "relative",
            isFeatured 
              ? "text-2xl md:text-3xl lg:text-4xl pr-8" 
              : "text-lg md:text-xl pr-6"
          )}>
            {title}
            <ExternalLink 
              className={cn(
                "absolute right-0 top-0 opacity-0 transition-all duration-300",
                "group-hover:opacity-100 group-focus-within:opacity-100",
                "motion-reduce:opacity-100",
                isFeatured ? "h-5 w-5" : "h-4 w-4"
              )}
              aria-hidden="true"
            />
          </h3>

          {/* Excerpt */}
          <p className={cn(
            "text-muted-foreground mb-4 flex-grow leading-relaxed",
            isFeatured 
              ? "text-base md:text-lg line-clamp-3 mb-6" 
              : "text-sm md:text-base line-clamp-2"
          )}>
            {excerpt}
          </p>

          {/* Tags */}
          {tags.length > 0 && (
            <div className={cn(
              "flex flex-wrap gap-2 mt-auto",
              isFeatured ? "mb-6" : ""
            )} 
            onClick={(e) => e.preventDefault()}>
              {tags.slice(0, 3).map((tag) => (
                <Link
                  key={tag}
                  href={`/blog?tag=${encodeURIComponent(tag)}`}
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  className="focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 rounded-full"
                  aria-label={`Filter artikel dengan tag ${tag}`}
                >
                  <Badge
                    variant="outline"
                    className={cn(
                      "font-medium transition-colors duration-200",
                      "border-primary/30 text-primary/90 bg-primary/5",
                      "hover:bg-primary/10 hover:border-primary/50",
                      "focus:bg-primary/10 focus:border-primary/50",
                      isFeatured ? "text-sm px-3 py-1" : "text-xs"
                    )}
                  >
                    {tag}
                  </Badge>
                </Link>
              ))}
              {tags.length > 3 && (
                <Badge 
                  variant="outline" 
                  className={cn(
                    "font-medium border-muted-foreground/30 text-muted-foreground",
                    isFeatured ? "text-sm" : "text-xs"
                  )}
                >
                  +{tags.length - 3}
                </Badge>
              )}
            </div>
          )}

          {/* Featured CTA */}
          {isFeatured && (
            <div className={cn(
              "inline-flex items-center gap-2 font-semibold text-primary mt-4",
              "group-hover:gap-3 transition-all duration-300"
            )}>
              Baca Artikel
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
          )}
        </div>

        {/* Glow effect overlay */}
        <div 
          className={cn(
            "absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300",
            "bg-gradient-to-br from-primary/5 via-transparent to-red-500/5",
            "group-hover:opacity-100",
            "motion-reduce:opacity-0"
          )}
          aria-hidden="true"
        />
      </Link>
    </motion.article>
  );
}

export function ArticleCardSkeleton({ className }: ArticleCardSkeletonProps) {
  return (
    <div 
      className={cn(
        "h-full p-6 rounded-2xl bg-muted/50 border border-border/50",
        "animate-pulse",
        className
      )}
      role="status"
      aria-label="Loading artikel..."
    >
      <div className="h-full flex flex-col">
        {/* Meta skeleton */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 bg-muted rounded" />
            <div className="h-3 w-24 bg-muted rounded" />
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 bg-muted rounded" />
            <div className="h-3 w-16 bg-muted rounded" />
          </div>
        </div>

        {/* Title skeleton */}
        <div className="space-y-2 mb-3">
          <div className="h-5 bg-muted rounded w-full" />
          <div className="h-5 bg-muted rounded w-3/4" />
        </div>

        {/* Excerpt skeleton */}
        <div className="space-y-2 mb-4 flex-grow">
          <div className="h-4 bg-muted rounded w-full" />
          <div className="h-4 bg-muted rounded w-full" />
          <div className="h-4 bg-muted rounded w-2/3" />
        </div>

        {/* Tags skeleton */}
        <div className="flex gap-2 mt-auto">
          <div className="h-6 w-16 bg-muted rounded-full" />
          <div className="h-6 w-20 bg-muted rounded-full" />
          <div className="h-6 w-12 bg-muted rounded-full" />
        </div>
      </div>
    </div>
  );
}

// Grid container component for consistent spacing
export function ArticleCardGrid({ 
  children, 
  className 
}: { 
  children: React.ReactNode; 
  className?: string; 
}) {
  return (
    <div 
      className={cn(
        "grid gap-6",
        "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
        className
      )}
    >
      {children}
    </div>
  );
}
