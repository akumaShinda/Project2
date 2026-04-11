export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-darker via-dark to-darker">
      {/* Navigation */}
      <nav className="bg-dark/50 backdrop-blur-md border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            StreamFusion
          </h1>
          <div className="flex gap-4">
            <a
              href="/login"
              className="px-6 py-2 bg-primary hover:bg-opacity-90 rounded-lg transition font-medium text-sm"
            >
              Sign In
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-24 text-center">
        <h2 className="text-5xl md:text-6xl font-bold mb-6">
          Welcome to <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">StreamFusion</span>
        </h2>
        <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
          Advanced streaming platform with multi-provider support, live TV, anime, and seamless cross-device synchronization
        </p>
        <a
          href="/login"
          className="inline-block px-8 py-3 bg-gradient-to-r from-primary to-secondary hover:shadow-lg transition font-semibold rounded-lg"
        >
          Get Started
        </a>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h3 className="text-3xl font-bold text-center mb-12">Powerful Features</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div className="bg-dark rounded-lg p-6 border border-gray-800 hover:border-primary transition">
            <div className="text-3xl mb-3">??</div>
            <h4 className="text-xl font-semibold mb-2">12+ Provider Registry</h4>
            <p className="text-gray-400">Access content from multiple providers with automatic failover support</p>
          </div>

          {/* Feature 2 */}
          <div className="bg-dark rounded-lg p-6 border border-gray-800 hover:border-primary transition">
            <div className="text-3xl mb-3">??</div>
            <h4 className="text-xl font-semibold mb-2">Live TV & Anime</h4>
            <p className="text-gray-400">Stream live television and anime content from dedicated providers</p>
          </div>

          {/* Feature 3 */}
          <div className="bg-dark rounded-lg p-6 border border-gray-800 hover:border-primary transition">
            <div className="text-3xl mb-3">??</div>
            <h4 className="text-xl font-semibold mb-2">Cross-Device Sync</h4>
            <p className="text-gray-400">Seamlessly sync your watch history and preferences across devices</p>
          </div>

          {/* Feature 4 */}
          <div className="bg-dark rounded-lg p-6 border border-gray-800 hover:border-primary transition">
            <div className="text-3xl mb-3">??</div>
            <h4 className="text-xl font-semibold mb-2">Download Support</h4>
            <p className="text-gray-400">Download your favorite content for offline viewing</p>
          </div>

          {/* Feature 5 */}
          <div className="bg-dark rounded-lg p-6 border border-gray-800 hover:border-primary transition">
            <div className="text-3xl mb-3">??</div>
            <h4 className="text-xl font-semibold mb-2">Clean UI & PWA</h4>
            <p className="text-gray-400">Beautiful interface with Progressive Web App support</p>
          </div>

          {/* Feature 6 */}
          <div className="bg-dark rounded-lg p-6 border border-gray-800 hover:border-primary transition">
            <div className="text-3xl mb-3">??</div>
            <h4 className="text-xl font-semibold mb-2">Admin Controls</h4>
            <p className="text-gray-400">Full administrative panel for user management and settings</p>
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h3 className="text-3xl font-bold text-center mb-12">Built With Modern Technology</h3>
        
        <div className="bg-dark rounded-lg p-8 border border-gray-800">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="font-semibold text-primary mb-2">Next.js 16</p>
              <p className="text-sm text-gray-400">Full-stack framework</p>
            </div>
            <div>
              <p className="font-semibold text-secondary mb-2">TypeScript</p>
              <p className="text-sm text-gray-400">Type-safe development</p>
            </div>
            <div>
              <p className="font-semibold text-blue-500 mb-2">Firebase</p>
              <p className="text-sm text-gray-400">Real-time sync</p>
            </div>
            <div>
              <p className="font-semibold text-orange-500 mb-2">Cloudflare</p>
              <p className="text-sm text-gray-400">D1 & Workers</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-12 border border-gray-800">
          <h3 className="text-3xl font-bold mb-4">Ready to Start Streaming?</h3>
          <p className="text-gray-400 mb-6">Sign in with your account or create a new one</p>
          <a
            href="/login"
            className="inline-block px-8 py-3 bg-gradient-to-r from-primary to-secondary hover:shadow-lg transition font-semibold rounded-lg"
          >
            Sign In
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark border-t border-gray-800 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-400">
          <p>© 2024 StreamFusion. All rights reserved.</p>
          <p className="text-sm mt-2">
            For local admin access, use the admin panel with credentials provided during setup
          </p>
        </div>
      </footer>
    </div>
  );
}
