// Local storage management with type safety
export interface StorageItem<T> {
  key: string;
  value: T;
  expiresAt?: number;
}

class LocalStorageManager {
  private prefix = 'streamfusion_';

  private getFullKey(key: string): string {
    return `${this.prefix}${key}`;
  }

  set<T>(key: string, value: T, expirationDays?: number): void {
    try {
      const item: StorageItem<T> = {
        key,
        value,
      };

      if (expirationDays) {
        item.expiresAt = Date.now() + expirationDays * 24 * 60 * 60 * 1000;
      }

      localStorage.setItem(this.getFullKey(key), JSON.stringify(item));
    } catch (error) {
      console.error('LocalStorage set error:', error);
    }
  }

  get<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(this.getFullKey(key));
      if (!item) return null;

      const parsed: StorageItem<T> = JSON.parse(item);

      // Check expiration
      if (parsed.expiresAt && Date.now() > parsed.expiresAt) {
        this.remove(key);
        return null;
      }

      return parsed.value;
    } catch (error) {
      console.error('LocalStorage get error:', error);
      return null;
    }
  }

  remove(key: string): void {
    try {
      localStorage.removeItem(this.getFullKey(key));
    } catch (error) {
      console.error('LocalStorage remove error:', error);
    }
  }

  clear(): void {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach((key) => {
        if (key.startsWith(this.prefix)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error('LocalStorage clear error:', error);
    }
  }

  getAllKeys(): string[] {
    try {
      const keys: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith(this.prefix)) {
          keys.push(key.replace(this.prefix, ''));
        }
      }
      return keys;
    } catch (error) {
      console.error('LocalStorage getAllKeys error:', error);
      return [];
    }
  }
}

export const storageManager = new LocalStorageManager();
