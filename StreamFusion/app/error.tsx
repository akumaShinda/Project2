'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Error caught:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-darker flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="text-6xl font-bold text-red-500 mb-4">??</div>
        <h1 className="text-3xl font-bold mb-2">Something went wrong</h1>
        <p className="text-gray-400 mb-6">{error.message}</p>
        <button
          onClick={reset}
          className="px-6 py-2 bg-primary hover:bg-opacity-90 rounded-lg transition font-medium"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
