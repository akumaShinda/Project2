import { verifyToken } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

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

    // Fetch from Cloudflare D1
    // For now, returning mock data
    return Response.json({
      userId,
      watchHistory: [],
      favorites: [],
      watchlist: [],
      settings: {
        quality: '1080p',
        autoPlay: true,
        subtitles: true,
        theme: 'dark',
      },
      lastSyncTime: Date.now(),
    });
  } catch (error) {
    console.error('Pull sync error:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
