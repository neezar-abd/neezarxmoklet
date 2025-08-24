import { NextResponse } from 'next/server';
import { generateJSON } from '../../../../lib/feed';

export async function GET() {
  try {
    const json = await generateJSON();
    
    return new NextResponse(json, {
      headers: {
        'Content-Type': 'application/feed+json; charset=utf-8',
        'Cache-Control': 'public, s-maxage=1200, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    console.error('Error generating JSON feed:', error);
    return new NextResponse('Error generating JSON feed', { status: 500 });
  }
}
