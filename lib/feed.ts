import { Feed } from 'feed';
import { getAllPosts } from '../lib/mdx';

export async function generateRSSFeed() {
  const posts = getAllPosts();
  const siteURL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001';
  const date = new Date();

  const author = {
    name: 'Neezar Xmoklet',
    email: 'neezar@example.com',
    link: siteURL,
  };

  const feed = new Feed({
    title: 'Neezar Xmoklet Blog',
    description: 'Thoughts, tutorials, dan insights tentang web development dan teknologi',
    id: siteURL,
    link: siteURL,
    image: `${siteURL}/favicon.ico`,
    favicon: `${siteURL}/favicon.ico`,
    copyright: `All rights reserved ${date.getFullYear()}, Neezar Xmoklet`,
    updated: date,
    generator: 'Next.js using Feed for Node.js',
    feedLinks: {
      rss2: `${siteURL}/rss.xml`,
      json: `${siteURL}/feed.json`,
      atom: `${siteURL}/atom.xml`,
    },
    author,
  });

  posts.forEach((post) => {
    const url = `${siteURL}/blog/${post.slug}`;
    
    feed.addItem({
      title: post.frontmatter.title,
      id: url,
      link: url,
      description: post.frontmatter.description,
      content: post.excerpt,
      author: [author],
      contributor: [author],
      date: new Date(post.frontmatter.date),
      category: post.frontmatter.tags.map(tag => ({ name: tag })),
    });
  });

  return feed;
}

export async function generateRSS() {
  const feed = await generateRSSFeed();
  return feed.rss2();
}

export async function generateAtom() {
  const feed = await generateRSSFeed();
  return feed.atom1();
}

export async function generateJSON() {
  const feed = await generateRSSFeed();
  return feed.json1();
}
