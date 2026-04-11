import { createUser } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { username, email, password, role } = await request.json();

    if (!username || !email || !password) {
      return Response.json(
        { error: 'Username, email, and password are required' },
        { status: 400 }
      );
    }

    const result = await createUser(username, password, email, role || 'user');

    if (!result.success) {
      return Response.json(
        { error: result.error || 'Failed to create user' },
        { status: 400 }
      );
    }

    return Response.json(
      {
        success: true,
        user: {
          id: result.user?.id,
          username: result.user?.username,
          email: result.user?.email,
          role: result.user?.role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create user error:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
