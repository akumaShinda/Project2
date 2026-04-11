export default function NotFound() {
  return (
    <div className="min-h-screen bg-darker flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="text-6xl font-bold text-primary mb-4">404</div>
        <h1 className="text-3xl font-bold mb-2">Page Not Found</h1>
        <p className="text-gray-400 mb-6">The page you're looking for doesn't exist.</p>
        <a
          href="/"
          className="inline-block px-6 py-2 bg-primary hover:bg-opacity-90 rounded-lg transition font-medium"
        >
          Go Home
        </a>
      </div>
    </div>
  );
}
