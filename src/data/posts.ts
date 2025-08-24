export interface PostData {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readingTime: string;
  tags: string[];
}

export const fallbackPosts: PostData[] = [
  {
    slug: 'nextjs-14-guide',
    title: 'Complete Guide to Next.js 14: App Router, Server Components, and Beyond',
    excerpt: 'Explore the latest features in Next.js 14 including the stable App Router, Server Components, and new performance optimizations that will transform your React development workflow.',
    date: '2024-12-15',
    readingTime: '8 min read',
    tags: ['Next.js', 'React', 'Web Development', 'JavaScript']
  },
  {
    slug: 'typescript-react-tips',
    title: 'Advanced TypeScript Patterns for React Developers',
    excerpt: 'Master advanced TypeScript patterns including conditional types, utility types, and generic constraints to build more robust and type-safe React applications.',
    date: '2024-12-10',
    readingTime: '12 min read',
    tags: ['TypeScript', 'React', 'Patterns', 'Development']
  },
  {
    slug: 'tailwind-css-guide',
    title: 'Mastering Tailwind CSS: From Basics to Advanced Techniques',
    excerpt: 'Learn how to harness the full power of Tailwind CSS with advanced techniques, custom configurations, and best practices for scalable design systems.',
    date: '2024-12-05',
    readingTime: '10 min read',
    tags: ['Tailwind CSS', 'CSS', 'Design', 'Frontend']
  },
  {
    slug: 'react-performance',
    title: 'React Performance Optimization: Advanced Techniques',
    excerpt: 'Deep dive into React performance optimization with useMemo, useCallback, React.memo, and advanced profiling techniques to create lightning-fast applications.',
    date: '2024-11-28',
    readingTime: '15 min read',
    tags: ['React', 'Performance', 'Optimization', 'JavaScript']
  },
  {
    slug: 'modern-javascript',
    title: 'Modern JavaScript Features Every Developer Should Know',
    excerpt: 'Explore the latest JavaScript features including optional chaining, nullish coalescing, private class fields, and top-level await that are changing how we write code.',
    date: '2024-11-20',
    readingTime: '9 min read',
    tags: ['JavaScript', 'ES2024', 'Modern JS', 'Development']
  },
  {
    slug: 'web-accessibility',
    title: 'Building Accessible Web Applications: A Complete Guide',
    excerpt: 'Learn how to create inclusive web experiences with proper ARIA labels, semantic HTML, keyboard navigation, and screen reader compatibility.',
    date: '2024-11-15',
    readingTime: '11 min read',
    tags: ['Accessibility', 'A11y', 'Web Development', 'UX']
  }
];
