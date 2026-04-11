'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';

interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'user';
  createdAt?: string;
  lastLogin?: string;
}

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated and is admin
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (!storedUser || !token) {
      router.push('/login');
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    if (parsedUser.role !== 'admin') {
      toast.error('Access denied');
      router.push('/dashboard');
      return;
    }

    setUser(parsedUser);
    loadUsers();
  }, [router]);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      // Mock data - in production this would fetch from API
      const mockUsers: User[] = [
        {
          id: 'admin-001',
          username: 'Akuma',
          email: 'admin@streamfusion.local',
          role: 'admin',
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
        },
        {
          id: 'user-001',
          username: 'demo_user',
          email: 'user@streamfusion.local',
          role: 'user',
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ];

      setUsers(mockUsers);
    } catch (error) {
      toast.error('Failed to load users');
      console.error('Load users error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      setUsers(users.filter((u) => u.id !== userId));
      toast.success('User deleted successfully');
    } catch (error) {
      toast.error('Failed to delete user');
      console.error('Delete user error:', error);
      loadUsers();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-darker flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-darker">
      {/* Header */}
      <header className="bg-dark border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              StreamFusion Admin
            </h1>
            <p className="text-sm text-gray-400">Local Admin Panel</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400">
              Welcome, <span className="font-semibold text-primary">{user?.username}</span>
            </span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition text-sm font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-dark rounded-lg p-6 border border-gray-800">
            <h3 className="text-gray-400 text-sm font-medium mb-2">Total Users</h3>
            <p className="text-3xl font-bold text-primary">{users.length}</p>
          </div>
          <div className="bg-dark rounded-lg p-6 border border-gray-800">
            <h3 className="text-gray-400 text-sm font-medium mb-2">Admin Users</h3>
            <p className="text-3xl font-bold text-secondary">
              {users.filter((u) => u.role === 'admin').length}
            </p>
          </div>
          <div className="bg-dark rounded-lg p-6 border border-gray-800">
            <h3 className="text-gray-400 text-sm font-medium mb-2">Regular Users</h3>
            <p className="text-3xl font-bold text-blue-500">
              {users.filter((u) => u.role === 'user').length}
            </p>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-dark rounded-lg border border-gray-800 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center">
            <h2 className="text-lg font-semibold">User Management</h2>
            <Link
              href="/admin/users/create"
              className="px-4 py-2 bg-primary hover:bg-opacity-90 rounded-lg transition text-sm font-medium"
            >
              Add User
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-darker border-b border-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-400">
                    Username
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-400">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-400">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-400">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-400">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b border-gray-800 hover:bg-darker/50 transition">
                    <td className="px-6 py-3 font-medium">{u.username}</td>
                    <td className="px-6 py-3 text-sm text-gray-400">{u.email}</td>
                    <td className="px-6 py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          u.role === 'admin'
                            ? 'bg-secondary/20 text-secondary'
                            : 'bg-primary/20 text-primary'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-400">
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-3 text-sm">
                      <div className="flex gap-2">
                        <Link
                          href={`/admin/users/${u.id}`}
                          className="text-primary hover:text-secondary transition"
                        >
                          Edit
                        </Link>
                        {u.id !== 'admin-001' && (
                          <button
                            onClick={() => handleDeleteUser(u.id)}
                            className="text-red-500 hover:text-red-400 transition"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-dark rounded-lg p-6 border border-gray-800">
            <h3 className="text-lg font-semibold mb-4">System Settings</h3>
            <div className="space-y-3">
              <Link
                href="/admin/settings/providers"
                className="block p-3 hover:bg-darker rounded-lg transition text-sm text-gray-300 hover:text-primary"
              >
                ? Provider Configuration
              </Link>
              <Link
                href="/admin/settings/cache"
                className="block p-3 hover:bg-darker rounded-lg transition text-sm text-gray-300 hover:text-primary"
              >
                ? Cache Management
              </Link>
              <Link
                href="/admin/settings/sync"
                className="block p-3 hover:bg-darker rounded-lg transition text-sm text-gray-300 hover:text-primary"
              >
                ? Sync Settings
              </Link>
            </div>
          </div>

          <div className="bg-dark rounded-lg p-6 border border-gray-800">
            <h3 className="text-lg font-semibold mb-4">Help & Support</h3>
            <div className="space-y-3">
              <Link
                href="/admin/docs"
                className="block p-3 hover:bg-darker rounded-lg transition text-sm text-gray-300 hover:text-primary"
              >
                ? Documentation
              </Link>
              <Link
                href="/admin/logs"
                className="block p-3 hover:bg-darker rounded-lg transition text-sm text-gray-300 hover:text-primary"
              >
                ? System Logs
              </Link>
              <Link
                href="/admin/status"
                className="block p-3 hover:bg-darker rounded-lg transition text-sm text-gray-300 hover:text-primary"
              >
                ? System Status
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
