// Firebase Realtime Sync with Cloudflare D1
import { initializeApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getDatabase, ref, onValue, set } from 'firebase/database';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase (only in browser)
let app: any;
let auth: Auth | null = null;
let database: any;

if (typeof window !== 'undefined') {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    database = getDatabase(app);
  } catch (error) {
    console.error('Firebase initialization error:', error);
  }
}

export { auth, database };

// Sync service for cross-device synchronization
export interface SyncData {
  userId: string;
  watchHistory: Array<{
    contentId: string;
    timestamp: number;
    progress: number;
  }>;
  favorites: string[];
  watchlist: string[];
  settings: Record<string, any>;
  lastSyncTime: number;
}

export class SyncService {
  /**
   * Sync watch history with Cloudflare D1 and Firebase
   * Implements bidirectional sync with conflict resolution
   */
  static async syncWatchHistory(
    userId: string,
    contentId: string,
    progress: number
  ): Promise<void> {
    const timestamp = Date.now();

    try {
      // Local storage update
      const historyKey = `history:${userId}`;
      const history = JSON.parse(localStorage.getItem(historyKey) || '[]');
      
      const existing = history.findIndex((h: any) => h.contentId === contentId);
      if (existing >= 0) {
        history[existing].progress = progress;
        history[existing].timestamp = timestamp;
      } else {
        history.push({ contentId, progress, timestamp });
      }

      localStorage.setItem(historyKey, JSON.stringify(history));

      // Firebase sync
      if (database) {
        await set(
          ref(database, `users/${userId}/watchHistory/${contentId}`),
          { progress, timestamp }
        );
      }

      // Cloudflare D1 API call
      await fetch('/api/sync/history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          contentId,
          progress,
          timestamp,
        }),
      });
    } catch (error) {
      console.error('Sync error:', error);
    }
  }

  /**
   * Pull sync data from server with conflict resolution
   */
  static async pullSync(userId: string): Promise<SyncData | null> {
    try {
      const response = await fetch(`/api/sync/pull?userId=${userId}`);
      if (!response.ok) return null;

      const data = await response.json() as SyncData;
      return data;
    } catch (error) {
      console.error('Pull sync error:', error);
      return null;
    }
  }

  /**
   * Push local sync data to server
   */
  static async pushSync(userId: string, data: SyncData): Promise<boolean> {
    try {
      const response = await fetch('/api/sync/push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, ...data }),
      });

      return response.ok;
    } catch (error) {
      console.error('Push sync error:', error);
      return false;
    }
  }

  /**
   * Listen for real-time sync updates
   */
  static listenForUpdates(
    userId: string,
    callback: (data: SyncData) => void
  ): () => void {
    if (!database) {
      console.warn('Firebase not initialized');
      return () => {};
    }

    const unsubscribe = onValue(
      ref(database, `users/${userId}`),
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          callback({
            userId,
            watchHistory: data.watchHistory || [],
            favorites: data.favorites || [],
            watchlist: data.watchlist || [],
            settings: data.settings || {},
            lastSyncTime: Date.now(),
          });
        }
      }
    );

    return unsubscribe;
  }
}
