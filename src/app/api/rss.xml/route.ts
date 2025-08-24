import { NextResponse } from 'next/server';
import { generateRSS } from '../../../../lib/feed';

export async function GET() {
  try {
    const rss = await generateRSS();
    
    return new NextResponse(rss, {
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Cache-Control': 'public, s-maxage=1200, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    console.error('Error generating RSS feed:', error);
    return new NextResponse('Error generating RSS feed', { status: 500 });
  }
}
