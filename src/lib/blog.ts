import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';

const postsDirectory = path.join(process.cwd(), 'content/posts');

export interface PostFrontmatter {
  title: string;
  date: string;
  tags: string[];
  description: string;
  ogImage?: string;
  draft?: boolean;
}

export interface Post {
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

export function getPostSlugs(): string[] {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }
  return fs.readdirSync(postsDirectory)
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => file.replace(/\.mdx$/, ''));
}

export function getPostBySlug(slug: string): Post | null {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.mdx`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);
    
    const frontmatter = data as PostFrontmatter;
    
    // Skip draft posts in production
    if (frontmatter.draft && process.env.NODE_ENV === 'production') {
      return null;
    }
    
    const stats = readingTime(content);
    
    // Create excerpt from content (first 160 characters)
    const excerpt = content
      .replace(/^---[\s\S]*?---/, '') // Remove frontmatter
      .replace(/#{1,6}\s+/g, '') // Remove headings
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Convert links to text
      .replace(/`([^`]+)`/g, '$1') // Remove code backticks
      .replace(/\*{1,2}([^*]+)\*{1,2}/g, '$1') // Remove bold/italic
      .trim()
      .substring(0, 160) + '...';

    return {
      slug,
      frontmatter,
      content,
      readingTime: stats,
      excerpt,
    };
  } catch (error) {
    console.error(`Error reading post ${slug}:`, error);
    return null;
  }
}

export function getAllPosts(): Post[] {
  const slugs = getPostSlugs();
  const posts = slugs
    .map((slug) => getPostBySlug(slug))
    .filter((post): post is Post => post !== null)
    .sort((a, b) => {
      return new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime();
    });

  return posts;
}

export function getPostsByTag(tag: string): Post[] {
  const allPosts = getAllPosts();
  return allPosts.filter((post) =>
    post.frontmatter.tags.map(t => t.toLowerCase()).includes(tag.toLowerCase())
  );
}

export function getAllTags(): string[] {
  const posts = getAllPosts();
  const tags = new Set<string>();
  
  posts.forEach((post) => {
    post.frontmatter.tags.forEach((tag) => {
      tags.add(tag);
    });
  });
  
  return Array.from(tags).sort();
}

export function generateToc(content: string) {
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
