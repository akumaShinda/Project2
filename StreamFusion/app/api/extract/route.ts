import { providerRegistry } from '@/lib/providers';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const contentId = searchParams.get('contentId');

    if (!contentId) {
      return Response.json(
        { error: 'contentId is required' },
        { status: 400 }
      );
    }

    // Try to extract from all providers for redundancy
    const results = await providerRegistry.extractMultiple(contentId, contentId);

    if (results.length === 0) {
      return Response.json(
        { error: 'Content not found' },
        { status: 404 }
      );
    }

    return Response.json({
      contentId,
      providers: results,
      totalProviders: results.length,
      primary: results[0],
      fallbacks: results.slice(1),
    });
  } catch (error) {
    console.error('Extract error:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
