import { providerRegistry } from '@/lib/providers';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const type = searchParams.get('type') || 'all';

    if (!query) {
      return Response.json(
        { error: 'Query parameter is required' },
        { status: 400 }
      );
    }

    const contentId = `${type}-${query.replace(/\s+/g, '-')}`;

    // Extract with failover logic
    const result = await providerRegistry.extract(contentId, query);

    if (!result) {
      return Response.json(
        { error: 'No streams found' },
        { status: 404 }
      );
    }

    return Response.json(result);
  } catch (error) {
    console.error('Search error:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
