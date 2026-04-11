'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function UserEditPage({ params }: { params: { id: string } }) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    role: 'user' as 'user' | 'admin',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();
  const userId = params.id;

  useEffect(() => {
    // Load user data
    setIsLoading(false);
    // In production, fetch user data from API
  }, [userId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        toast.error(error.error || 'Failed to update user');
        return;
      }

      toast.success('User updated successfully');
      router.push('/admin');
    } catch (error) {
      toast.error('An error occurred');
      console.error('Update user error:', error);
    } finally {
      setIsSaving(false);
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
      <header className="bg-dark border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link href="/admin" className="text-primary hover:text-secondary transition">
            ? Back to Admin
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-dark rounded-lg border border-gray-800 p-8">
          <h1 className="text-3xl font-bold mb-6">Edit User</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium mb-2">
                Username
              </label>
              <input
                id="username"
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                disabled
                className="w-full px-4 py-2 bg-darker border border-gray-700 rounded-lg opacity-50 cursor-not-allowed"
              />
              <p className="text-xs text-gray-400 mt-1">Username cannot be changed</p>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-darker border border-gray-700 rounded-lg focus:outline-none focus:border-primary transition"
              />
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium mb-2">
                Role
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-darker border border-gray-700 rounded-lg focus:outline-none focus:border-primary transition"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={isSaving}
                className="flex-1 bg-primary hover:bg-opacity-90 rounded-lg transition font-medium py-2 disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
              <Link
                href="/admin"
                className="flex-1 bg-gray-800 hover:bg-gray-700 rounded-lg transition font-medium py-2 text-center"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
