// Watch history and user preferences management
import { create } from 'zustand';
import { SyncService, SyncData } from './sync';

export interface WatchHistoryItem {
  contentId: string;
  title: string;
  poster?: string;
  progress: number;
  duration: number;
  timestamp: number;
  provider: string;
}

export interface UserPreferences {
  quality: '720p' | '1080p' | '4k';
  autoPlay: boolean;
  subtitles: boolean;
  theme: 'dark' | 'light';
  language: string;
}

interface HistoryStore {
  history: WatchHistoryItem[];
  favorites: string[];
  watchlist: string[];
  preferences: UserPreferences;
  userId: string | null;
  
  setUserId: (userId: string) => void;
  addToHistory: (item: WatchHistoryItem) => Promise<void>;
  getHistory: () => WatchHistoryItem[];
  clearHistory: () => void;
  addToFavorites: (contentId: string) => Promise<void>;
  removeFromFavorites: (contentId: string) => void;
  addToWatchlist: (contentId: string) => Promise<void>;
  removeFromWatchlist: (contentId: string) => void;
  updatePreferences: (prefs: Partial<UserPreferences>) => void;
  loadFromSync: (data: SyncData) => void;
}

export const useHistoryStore = create<HistoryStore>((set, get) => ({
  history: [],
  favorites: [],
  watchlist: [],
  preferences: {
    quality: '1080p',
    autoPlay: true,
    subtitles: true,
    theme: 'dark',
    language: 'en',
  },
  userId: null,

  setUserId: (userId: string) => set({ userId }),

  addToHistory: async (item: WatchHistoryItem) => {
    const state = get();
    const existing = state.history.findIndex((h) => h.contentId === item.contentId);

    let newHistory: WatchHistoryItem[];
    if (existing >= 0) {
      newHistory = [...state.history];
      newHistory[existing] = item;
    } else {
      newHistory = [...state.history, item];
    }

    set({ history: newHistory });

    // Sync to server and Firebase
    if (state.userId) {
      await SyncService.syncWatchHistory(state.userId, item.contentId, item.progress);
    }

    // Save to localStorage
    localStorage.setItem('watchHistory', JSON.stringify(newHistory));
  },

  getHistory: () => get().history,

  clearHistory: () => {
    set({ history: [] });
    localStorage.removeItem('watchHistory');
  },

  addToFavorites: async (contentId: string) => {
    const state = get();
    const newFavorites = [...new Set([...state.favorites, contentId])];
    set({ favorites: newFavorites });

    localStorage.setItem('favorites', JSON.stringify(newFavorites));

    // Sync to server
    if (state.userId) {
      await fetch('/api/sync/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: state.userId, favorites: newFavorites }),
      });
    }
  },

  removeFromFavorites: (contentId: string) => {
    const state = get();
    const newFavorites = state.favorites.filter((id) => id !== contentId);
    set({ favorites: newFavorites });

    localStorage.setItem('favorites', JSON.stringify(newFavorites));
  },

  addToWatchlist: async (contentId: string) => {
    const state = get();
    const newWatchlist = [...new Set([...state.watchlist, contentId])];
    set({ watchlist: newWatchlist });

    localStorage.setItem('watchlist', JSON.stringify(newWatchlist));

    // Sync to server
    if (state.userId) {
      await fetch('/api/sync/watchlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: state.userId, watchlist: newWatchlist }),
      });
    }
  },

  removeFromWatchlist: (contentId: string) => {
    const state = get();
    const newWatchlist = state.watchlist.filter((id) => id !== contentId);
    set({ watchlist: newWatchlist });

    localStorage.setItem('watchlist', JSON.stringify(newWatchlist));
  },

  updatePreferences: (prefs: Partial<UserPreferences>) => {
    const state = get();
    const newPrefs = { ...state.preferences, ...prefs };
    set({ preferences: newPrefs });

    localStorage.setItem('preferences', JSON.stringify(newPrefs));
  },

  loadFromSync: (data: SyncData) => {
    const history: WatchHistoryItem[] = data.watchHistory.map((h: any) => ({
      contentId: h.contentId,
      title: h.contentId,
      progress: h.progress,
      duration: 0,
      timestamp: h.timestamp,
      provider: 'Unknown',
    }));

    set({
      history,
      favorites: data.favorites,
      watchlist: data.watchlist,
      preferences: data.settings as UserPreferences,
    });
  },
}));
