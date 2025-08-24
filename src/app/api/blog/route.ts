import { NextResponse } from 'next/server';
import { getAllPosts, getAllTags } from '../../../lib/blog';

export async function GET() {
  try {
    const posts = getAllPosts();
    const tags = getAllTags();
    
    return NextResponse.json({
      posts,
      tags,
    });
  } catch (error) {
    console.error('Error fetching blog data:', error);
    return NextResponse.json({ error: 'Failed to fetch blog data' }, { status: 500 });
  }
}
