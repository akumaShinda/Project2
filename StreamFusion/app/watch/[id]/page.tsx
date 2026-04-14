'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useHistoryStore } from '@/lib/store';
import { SyncService } from '@/lib/sync';
import { sanitizeStreamLinks } from '@/lib/stream-safety';

interface StreamLink {
  url: string;
  quality: string;
  type: 'direct' | 'stream' | 'embed';
}

interface ContentData {
  id: string;
  title: string;
  description: string;
  links: StreamLink[];
  provider: string;
}

export default function WatchPage() {
  const params = useParams();
  const contentId = params.id as string;
  const router = useRouter();

  const [content, setContent] = useState<ContentData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLink, setSelectedLink] = useState<StreamLink | null>(null);
  const [progress, setProgress] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [user, setUser] = useState<any>(null);

  const { addToHistory, addToFavorites, favorites } = useHistoryStore();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      router.push('/login');
      return;
    }
    setUser(JSON.parse(storedUser));
  }, [router]);

  useEffect(() => {
    const loadContent = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/extract?contentId=${encodeURIComponent(contentId)}`);

        if (!response.ok) {
          toast.error('Content not found');
          router.push('/dashboard');
          return;
        }

        const data = await response.json();
        const safeLinks = sanitizeStreamLinks(data.primary.links || []);
        if (safeLinks.length === 0) {
          toast.error('No safe streams available');
          router.push('/dashboard');
          return;
        }

        setContent({
          ...data.primary,
          links: safeLinks,
        });
        setSelectedLink(safeLinks[0]);
        setIsFavorite(favorites.includes(contentId));
      } catch (error) {
        toast.error('Failed to load content');
        console.error('Load error:', error);
        router.push('/dashboard');
      } finally {
        setIsLoading(false);
      }
    };

    if (contentId) {
      loadContent();
    }
  }, [contentId, router, favorites]);

  const handleProgressUpdate = async (newProgress: number) => {
    setProgress(newProgress);

    if (user) {
      await addToHistory({
        contentId,
        title: content?.title || contentId,
        progress: newProgress,
        duration: 100,
        timestamp: Date.now(),
        provider: content?.provider || 'Unknown',
      });

      // Sync with server
      const token = localStorage.getItem('token');
      if (token) {
        await SyncService.syncWatchHistory(user.userId, contentId, newProgress);
      }
    }
  };

  const handleToggleFavorite = async () => {
    if (!isFavorite) {
      await addToFavorites(contentId);
      setIsFavorite(true);
      toast.success('Added to favorites');
    } else {
      setIsFavorite(false);
      toast.success('Removed from favorites');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-darker flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="min-h-screen bg-darker flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 mb-4">Content not found</p>
          <Link href="/dashboard" className="text-primary hover:text-secondary transition">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-darker">
      {/* Header */}
      <header className="bg-dark border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/dashboard" className="text-primary hover:text-secondary transition">
            ? Back
          </Link>
          <h1 className="text-xl font-bold">{content.title}</h1>
          <button
            onClick={handleToggleFavorite}
            className={`px-4 py-2 rounded-lg transition ${
              isFavorite
                ? 'bg-secondary text-white'
                : 'bg-gray-800 hover:bg-secondary/20 text-gray-400'
            }`}
          >
            {isFavorite ? '? Favorited' : '? Add to Favorites'}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Player */}
          <div className="lg:col-span-2">
            <div className="bg-black rounded-lg overflow-hidden mb-6 aspect-video flex items-center justify-center">
              {selectedLink ? (
                <iframe
                  src={selectedLink.url}
                  className="w-full h-full"
                  allowFullScreen
                  sandbox="allow-same-origin allow-scripts allow-presentation allow-downloads"
                  referrerPolicy="no-referrer"
                  allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                  title={content.title}
                ></iframe>
              ) : (
                <p className="text-gray-400">Select a link to watch</p>
              )}
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <input
                type="range"
                min="0"
                max="100"
                value={progress}
                onChange={(e) => handleProgressUpdate(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer"
              />
              <p className="text-sm text-gray-400 mt-2">{progress}% watched</p>
            </div>

            {/* Description */}
            <div className="bg-dark rounded-lg p-6 border border-gray-800">
              <h2 className="text-2xl font-bold mb-4">{content.title}</h2>
              <p className="text-gray-300 mb-4">{content.description}</p>
              <p className="text-sm text-gray-400">Provider: {content.provider}</p>
            </div>
          </div>

          {/* Sidebar - Links */}
          <div>
            <div className="bg-dark rounded-lg p-6 border border-gray-800 sticky top-4">
              <h3 className="text-lg font-semibold mb-4">Available Streams</h3>

              <div className="space-y-2 max-h-96 overflow-y-auto">
                {content.links.map((link, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedLink(link)}
                    className={`w-full text-left px-4 py-2 rounded-lg transition ${
                      selectedLink?.url === link.url
                        ? 'bg-primary text-white'
                        : 'bg-darker hover:bg-gray-800 text-gray-300'
                    }`}
                  >
                    <div className="font-medium">{link.quality}</div>
                    <div className="text-xs text-gray-400">{link.type}</div>
                  </button>
                ))}
              </div>

              {/* Download Option */}
              {content.links.some((l) => l.type === 'direct') && (
                <div className="mt-6 pt-6 border-t border-gray-700">
                  <a
                    href={content.links.find((l) => l.type === 'direct')?.url}
                    download
                    className="w-full block text-center px-4 py-2 bg-secondary hover:bg-opacity-90 rounded-lg transition font-medium"
                  >
                    ? Download
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
