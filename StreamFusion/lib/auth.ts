// Authentication utilities with username/password login
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'Akuma';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'SkylineR30';

// In-memory user store (replace with database in production)
export interface User {
  id: string;
  username: string;
  passwordHash: string;
  email: string;
  role: 'admin' | 'user';
  createdAt: Date;
  lastLogin?: Date;
}

// Initialize with admin user
const users = new Map<string, User>();

// Hash and store admin password on startup
async function initializeAdmin() {
  const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);
  users.set('admin', {
    id: 'admin-001',
    username: ADMIN_USERNAME,
    passwordHash: hashedPassword,
    email: 'admin@streamfusion.local',
    role: 'admin',
    createdAt: new Date(),
  });
}

initializeAdmin();

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateToken(userId: string, username: string, role: string) {
  return jwt.sign(
    { userId, username, role, iat: Date.now() },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as {
      userId: string;
      username: string;
      role: string;
      iat: number;
    };
  } catch (error) {
    return null;
  }
}

export async function authenticateUser(
  username: string,
  password: string
): Promise<{ success: boolean; token?: string; user?: Partial<User>; error?: string }> {
  // Find user by username
  let user: User | undefined;
  for (const [_, u] of users) {
    if (u.username === username) {
      user = u;
      break;
    }
  }

  if (!user) {
    return { success: false, error: 'User not found' };
  }

  // Verify password
  const passwordMatch = await verifyPassword(password, user.passwordHash);
  if (!passwordMatch) {
    return { success: false, error: 'Invalid password' };
  }

  // Generate token
  const token = generateToken(user.id, user.username, user.role);

  // Update last login
  user.lastLogin = new Date();

  return {
    success: true,
    token,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
  };
}

export async function createUser(
  username: string,
  password: string,
  email: string,
  role: 'user' | 'admin' = 'user'
): Promise<{ success: boolean; user?: User; error?: string }> {
  // Check if user already exists
  for (const [_, u] of users) {
    if (u.username === username) {
      return { success: false, error: 'Username already exists' };
    }
  }

  const passwordHash = await hashPassword(password);
  const newUser: User = {
    id: `user-${Date.now()}`,
    username,
    passwordHash,
    email,
    role,
    createdAt: new Date(),
  };

  users.set(newUser.id, newUser);
  return { success: true, user: newUser };
}

export function getUserById(userId: string): User | undefined {
  return users.get(userId);
}

export function getAllUsers(): User[] {
  return Array.from(users.values());
}

export async function updateUserPassword(
  userId: string,
  newPassword: string
): Promise<{ success: boolean; error?: string }> {
  const user = users.get(userId);
  if (!user) {
    return { success: false, error: 'User not found' };
  }

  user.passwordHash = await hashPassword(newPassword);
  return { success: true };
}

export function deleteUser(userId: string): boolean {
  return users.delete(userId);
}
