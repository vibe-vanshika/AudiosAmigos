import { ChunkTiming, TTSConfig } from "../types";

const DB_NAME = 'lumina_tts_db';
const STORE_NAME = 'audio_cache';

interface CacheEntry {
    key: string;
    blob: Blob;
    chunks: string[];
    timings: ChunkTiming[];
    timestamp: number;
}

const openDB = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, 1);
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);
        request.onupgradeneeded = (e) => {
            const db = (e.target as IDBOpenDBRequest).result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: 'key' });
            }
        };
    });
};

/**
 * Generates a SHA-256 hash based on the text and configuration.
 * This ensures that if any parameter changes, we get a new key.
 */
export const generateCacheKey = async (text: string, config: TTSConfig): Promise<string> => {
    // Include all relevant parameters in the hash
    const data = JSON.stringify({ 
        t: text.trim(), 
        v: config.voice, 
        s: config.speed, 
        l: config.language 
    });
    
    const msgBuffer = new TextEncoder().encode(data);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

export const getCachedAudio = async (key: string): Promise<Omit<CacheEntry, 'key' | 'timestamp'> | null> => {
    try {
        const db = await openDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(STORE_NAME, 'readonly');
            const store = tx.objectStore(STORE_NAME);
            const request = store.get(key);
            request.onsuccess = () => {
                if (request.result) {
                    const { key, timestamp, ...data } = request.result;
                    resolve(data);
                } else {
                    resolve(null);
                }
            };
            request.onerror = () => reject(request.error);
        });
    } catch (e) {
        console.warn("IndexedDB read error", e);
        return null;
    }
};

export const cacheAudio = async (key: string, data: { blob: Blob, chunks: string[], timings: ChunkTiming[] }) => {
    try {
        const db = await openDB();
        return new Promise<void>((resolve, reject) => {
            const tx = db.transaction(STORE_NAME, 'readwrite');
            const store = tx.objectStore(STORE_NAME);
            const entry: CacheEntry = {
                key,
                timestamp: Date.now(),
                ...data
            };
            const request = store.put(entry);
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    } catch (e) {
        console.warn("IndexedDB write error", e);
    }
};

export const clearCache = async (): Promise<void> => {
    try {
        const db = await openDB();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(STORE_NAME, 'readwrite');
            const store = tx.objectStore(STORE_NAME);
            const request = store.clear();
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    } catch (e) {
        console.warn("IndexedDB clear error", e);
        throw e;
    }
};