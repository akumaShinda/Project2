import { verifyToken } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { userId, watchlist } = await request.json();

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

    console.log('Updating watchlist:', { userId, watchlist });

    return Response.json({
      success: true,
      message: 'Watchlist updated',
    });
  } catch (error) {
    console.error('Update watchlist error:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
