import { providerRegistry } from '@/lib/providers';
import { sanitizeStreamLinks } from '@/lib/stream-safety';

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

    const mergedLinks = sanitizeStreamLinks(results.flatMap((result) => result.links));
    const primaryProvider = results[0];
    const primary = {
      ...primaryProvider,
      links: mergedLinks,
      provider: results.map((result) => result.provider).join(', '),
      description: 'Combined streams with ad/pop-up filtering and provider failover',
    };

    return Response.json({
      contentId,
      providers: results,
      totalProviders: results.length,
      primary,
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
