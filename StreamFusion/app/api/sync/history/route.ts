import { verifyToken } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { userId, contentId, progress, timestamp } = await request.json();

    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return Response.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const decoded = verifyToken(token);

    if (!decoded) {
      return Response.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    // Here you would save to Cloudflare D1
    // For now, we'll just simulate the save
    console.log('Saving watch history:', {
      userId,
      contentId,
      progress,
      timestamp,
    });

    return Response.json({
      success: true,
      message: 'Watch history saved',
    });
  } catch (error) {
    console.error('Sync history error:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
