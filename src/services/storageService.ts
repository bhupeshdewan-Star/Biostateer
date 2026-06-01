export interface StorageProvider {
  save(key: string, data: any): Promise<void>;
  load<T>(key: string, defaultValue: T): Promise<T>;
  clear(key: string): Promise<void>;
  getMetrics(key: string): Promise<{ count: number; sizeBytes: number }>;
}

// 1. Memory Provider (Fallback / Unit Testing)
export class MemoryProvider implements StorageProvider {
  private store = new Map<string, string>();

  async save(key: string, data: any): Promise<void> {
    this.store.set(key, JSON.stringify(data));
  }

  async load<T>(key: string, defaultValue: T): Promise<T> {
    const val = this.store.get(key);
    if (!val) return defaultValue;
    try {
      return JSON.parse(val) as T;
    } catch {
      return defaultValue;
    }
  }

  async clear(key: string): Promise<void> {
    this.store.delete(key);
  }

  async getMetrics(key: string): Promise<{ count: number; sizeBytes: number }> {
    const val = this.store.get(key);
    if (!val) return { count: 0, sizeBytes: 0 };
    const bytes = new Blob([val]).size;
    try {
      const parsed = JSON.parse(val);
      const count = Array.isArray(parsed) ? parsed.length : 1;
      return { count, sizeBytes: bytes };
    } catch {
      return { count: 1, sizeBytes: bytes };
    }
  }
}

// 2. Local Storage Provider
export class LocalStorageProvider implements StorageProvider {
  async save(key: string, data: any): Promise<void> {
    localStorage.setItem(key, JSON.stringify(data));
  }

  async load<T>(key: string, defaultValue: T): Promise<T> {
    const val = localStorage.getItem(key);
    if (!val) return defaultValue;
    try {
      return JSON.parse(val) as T;
    } catch {
      return defaultValue;
    }
  }

  async clear(key: string): Promise<void> {
    localStorage.removeItem(key);
  }

  async getMetrics(key: string): Promise<{ count: number; sizeBytes: number }> {
    const val = localStorage.getItem(key);
    if (!val) return { count: 0, sizeBytes: 0 };
    const bytes = new Blob([val]).size;
    try {
      const parsed = JSON.parse(val);
      const count = Array.isArray(parsed) ? parsed.length : 1;
      return { count, sizeBytes: bytes };
    } catch {
      return { count: 1, sizeBytes: bytes };
    }
  }
}

// 3. IndexedDB Provider (High-Capacity, FDA CFR 11 Preferred Local Storage)
export class IndexedDBProvider implements StorageProvider {
  private dbName = "BiostateerWorkspaceDB";
  private storeName = "workspaceStore";

  private getDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName);
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async save(key: string, data: any): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(this.storeName, "readwrite");
      const store = tx.objectStore(this.storeName);
      const request = store.put(JSON.stringify(data), key);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async load<T>(key: string, defaultValue: T): Promise<T> {
    try {
      const db = await this.getDB();
      return new Promise((resolve) => {
        const tx = db.transaction(this.storeName, "readonly");
        const store = tx.objectStore(this.storeName);
        const request = store.get(key);
        request.onsuccess = () => {
          const val = request.result;
          if (!val) {
            resolve(defaultValue);
            return;
          }
          try {
            resolve(JSON.parse(val) as T);
          } catch {
            resolve(defaultValue);
          }
        };
        request.onerror = () => resolve(defaultValue);
      });
    } catch {
      // Fallback
      return defaultValue;
    }
  }

  async clear(key: string): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(this.storeName, "readwrite");
      const store = tx.objectStore(this.storeName);
      const request = store.delete(key);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getMetrics(key: string): Promise<{ count: number; sizeBytes: number }> {
    try {
      const val = await this.load<any>(key, null);
      if (!val) return { count: 0, sizeBytes: 0 };
      const serialized = JSON.stringify(val);
      const bytes = new Blob([serialized]).size;
      const count = Array.isArray(val) ? val.length : 1;
      return { count, sizeBytes: bytes };
    } catch {
      return { count: 0, sizeBytes: 0 };
    }
  }
}

// 4. Cloud Memory Provider (Future-ready generic abstraction)
export class SupabaseProvider implements StorageProvider {
  private localFallback = new LocalStorageProvider();
  async save(key: string, data: any): Promise<void> { await this.localFallback.save(key, data); }
  async load<T>(key: string, defaultValue: T): Promise<T> { return this.localFallback.load(key, defaultValue); }
  async clear(key: string): Promise<void> { await this.localFallback.clear(key); }
  async getMetrics(key: string): Promise<{ count: number; sizeBytes: number }> { return this.localFallback.getMetrics(key); }
}

export class FirebaseProvider implements StorageProvider {
  private localFallback = new LocalStorageProvider();
  async save(key: string, data: any): Promise<void> { await this.localFallback.save(key, data); }
  async load<T>(key: string, defaultValue: T): Promise<T> { return this.localFallback.load(key, defaultValue); }
  async clear(key: string): Promise<void> { await this.localFallback.clear(key); }
  async getMetrics(key: string): Promise<{ count: number; sizeBytes: number }> { return this.localFallback.getMetrics(key); }
}

// Dependency Injection Orchestrator
class StorageService {
  private provider: StorageProvider;

  constructor() {
    // Determine the optimal provider (IndexedDB is preferred, fallback to LocalStorage)
    if (typeof indexedDB !== "undefined") {
      this.provider = new IndexedDBProvider();
    } else if (typeof localStorage !== "undefined") {
      this.provider = new LocalStorageProvider();
    } else {
      this.provider = new MemoryProvider();
    }
  }

  setProvider(provider: StorageProvider) {
    this.provider = provider;
  }

  async saveWorkspace(key: string, data: any): Promise<void> {
    await this.provider.save(key, data);
  }

  async loadWorkspace<T>(key: string, defaultValue: T): Promise<T> {
    return this.provider.load<T>(key, defaultValue);
  }

  async clearWorkspace(key: string): Promise<void> {
    await this.provider.clear(key);
  }

  async getMetrics(key: string): Promise<{ count: number; sizeBytes: number }> {
    return this.provider.getMetrics(key);
  }
}

export const storageService = new StorageService();
