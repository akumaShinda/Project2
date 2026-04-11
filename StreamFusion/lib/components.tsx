'use client';

import React, { useEffect, useState } from 'react';

/**
 * Protected route component that ensures user is authenticated before rendering
 * Redirects to login if not authenticated
 */
export function ProtectedRoute({
  children,
  requiredRole,
}: {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'user';
}) {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');

        if (!token || !user) {
          window.location.href = '/login';
          return;
        }

        const parsedUser = JSON.parse(user);

        if (requiredRole && parsedUser.role !== requiredRole) {
          window.location.href = '/dashboard';
          return;
        }

        // Verify token with server
        const response = await fetch('/api/auth/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });

        if (response.ok) {
          setIsAuthorized(true);
        } else {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
      } catch (error) {
        console.error('Auth check error:', error);
        window.location.href = '/login';
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [requiredRole]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-darker flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
}

/**
 * Loading skeleton component for content placeholders
 */
export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`skeleton rounded ${className}`}></div>;
}

/**
 * Error boundary for graceful error handling
 */
export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-darker flex items-center justify-center">
          <div className="text-center">
            <p className="text-2xl font-bold text-red-500 mb-4">Something went wrong</p>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="px-4 py-2 bg-primary rounded-lg hover:bg-opacity-90"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Responsive grid component that adapts to screen size
 */
export function ResponsiveGrid({
  children,
  columns = 3,
}: {
  children: React.ReactNode;
  columns?: number;
}) {
  const colsClass = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  }[columns] || 'grid-cols-1 md:grid-cols-3';

  return <div className={`grid ${colsClass} gap-6`}>{children}</div>;
}

/**
 * Modal dialog component
 */
export function Modal({
  isOpen,
  title,
  children,
  onClose,
  actions,
}: {
  isOpen: boolean;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  actions?: React.ReactNode;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-dark rounded-lg max-w-md w-full mx-4 border border-gray-800">
        <div className="flex justify-between items-center p-6 border-b border-gray-800">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition"
          >
            ?
          </button>
        </div>
        <div className="p-6">{children}</div>
        {actions && (
          <div className="p-6 border-t border-gray-800 flex gap-3 justify-end">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Badge component for labels and tags
 */
export function Badge({
  variant = 'primary',
  children,
}: {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  children: React.ReactNode;
}) {
  const variantClass = {
    primary: 'bg-primary/20 text-primary',
    secondary: 'bg-secondary/20 text-secondary',
    success: 'bg-green-500/20 text-green-400',
    warning: 'bg-yellow-500/20 text-yellow-400',
    error: 'bg-red-500/20 text-red-400',
  }[variant];

  return (
    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${variantClass}`}>
      {children}
    </span>
  );
}

/**
 * Toast notification (use react-hot-toast instead for better UX)
 */
export function Toast({
  message,
  type = 'info',
}: {
  message: string;
  type?: 'success' | 'error' | 'info' | 'warning';
}) {
  const bgClass = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-primary',
    warning: 'bg-yellow-500',
  }[type];

  return (
    <div className={`${bgClass} text-white px-4 py-3 rounded-lg shadow-lg`}>
      {message}
    </div>
  );
}
