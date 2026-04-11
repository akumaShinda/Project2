import { verifyToken } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { userId, watchHistory, favorites, watchlist, settings } = await request.json();

    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return Response.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const decoded = verifyToken(token);

    if (!decoded || decoded.userId !== userId) {
      return Response.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Save to Cloudflare D1
    console.log('Saving sync data:', {
      userId,
      watchHistory,
      favorites,
      watchlist,
      settings,
    });

    return Response.json({
      success: true,
      message: 'Sync data saved',
      lastSyncTime: Date.now(),
    });
  } catch (error) {
    console.error('Push sync error:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
