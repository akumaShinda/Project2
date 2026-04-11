import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'StreamFusion',
  description: 'Advanced streaming platform with multi-provider support',
  keywords: ['streaming', 'movies', 'tv', 'anime', 'live-tv'],
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>{children}</body>
    </html>
  );
}
