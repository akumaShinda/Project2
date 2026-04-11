import { verifyToken } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { token } = await request.json();

    if (!token) {
      return Response.json(
        { error: 'Token is required' },
        { status: 400 }
      );
    }

    const decoded = verifyToken(token);

    if (!decoded) {
      return Response.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    return Response.json(
      {
        valid: true,
        user: {
          userId: decoded.userId,
          username: decoded.username,
          role: decoded.role,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Verify error:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
