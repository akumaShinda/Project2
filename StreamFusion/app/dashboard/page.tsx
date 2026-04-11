'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useHistoryStore } from '@/lib/store';

interface ContentItem {
  id: string;
  title: string;
  poster?: string;
  progress: number;
  duration: number;
  type: 'movie' | 'tv' | 'anime';
}

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<ContentItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const router = useRouter();
  const { history, favorites } = useHistoryStore();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (!storedUser || !token) {
      router.push('/login');
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);
    setIsLoading(false);
  }, [router]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
      if (!response.ok) throw new Error('Search failed');

      const data = await response.json();
      setSearchResults([
        {
          id: data.id,
          title: data.title,
          progress: 0,
          duration: 100,
          type: 'movie',
        },
      ]);
    } catch (error) {
      toast.error('Search failed');
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
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
          <Link href="/dashboard" className="flex items-center gap-2">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              StreamFusion
            </h1>
          </Link>

          <div className="flex items-center gap-4">
            <Link
              href="/admin"
              className="text-sm text-gray-400 hover:text-primary transition"
            >
              Admin Panel
            </Link>
            <span className="text-sm text-gray-400">
              {user?.username}
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
        {/* Search Section */}
        <div className="mb-8">
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for movies, TV shows, anime..."
              className="flex-1 px-4 py-3 bg-dark border border-gray-700 rounded-lg focus:outline-none focus:border-primary transition"
            />
            <button
              type="submit"
              disabled={isSearching}
              className="px-6 py-3 bg-primary hover:bg-opacity-90 rounded-lg transition font-medium disabled:opacity-50"
            >
              {isSearching ? 'Searching...' : 'Search'}
            </button>
          </form>
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Search Results</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {searchResults.map((item) => (
                <Link
                  key={item.id}
                  href={`/watch/${item.id}`}
                  className="group bg-dark rounded-lg overflow-hidden border border-gray-800 hover:border-primary transition cursor-pointer"
                >
                  <div className="aspect-video bg-gray-800 flex items-center justify-center text-gray-400">
                    {item.title}
                  </div>
                  <div className="p-3">
                    <h3 className="font-semibold text-sm truncate">{item.title}</h3>
                    <p className="text-xs text-gray-400 mt-1">
                      {item.progress > 0 ? `${item.progress}% watched` : 'Not started'}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Continue Watching */}
        {history.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Continue Watching</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {history.slice(0, 8).map((item) => (
                <Link
                  key={item.contentId}
                  href={`/watch/${item.contentId}`}
                  className="group bg-dark rounded-lg overflow-hidden border border-gray-800 hover:border-primary transition"
                >
                  <div className="aspect-video bg-gray-800 flex items-center justify-center text-gray-400 relative">
                    {item.title}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700">
                      <div
                        className="h-full bg-primary transition-all"
                        style={{ width: `${item.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="p-3">
                    <h3 className="font-semibold text-sm truncate">{item.title}</h3>
                    <p className="text-xs text-gray-400 mt-1">{item.progress}% watched</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Favorites */}
        {favorites.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">My Favorites</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {favorites.map((id) => (
                <Link
                  key={id}
                  href={`/watch/${id}`}
                  className="group bg-dark rounded-lg overflow-hidden border border-gray-800 hover:border-secondary transition"
                >
                  <div className="aspect-video bg-gray-800 flex items-center justify-center text-gray-400">
                    {id}
                  </div>
                  <div className="p-3">
                    <h3 className="font-semibold text-sm truncate">{id}</h3>
                    <p className="text-xs text-secondary mt-1">? Favorite</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
