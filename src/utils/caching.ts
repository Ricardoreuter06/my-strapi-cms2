// Datei: utils/caching.ts

import Redis from 'ioredis';

// Redis-Client konfigurieren
const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379,
  password: process.env.REDIS_PASSWORD || '',
});

// Cache holen
export const getCache = async (key: string) => {
  const data = await redis.get(key);
  return data ? JSON.parse(data) : null; // Gibt null zurück, wenn keine Daten vorhanden sind
};

// Cache setzen
export const setCache = async (key: string, value: any, expirationTimeInSeconds: number) => {
  await redis.setex(key, expirationTimeInSeconds, JSON.stringify(value)); // Speichert Daten für die angegebene Zeit
};

// Cache löschen (Invaliderung) - Hier fügen wir die Funktion hinzu
export const invalidateCache = async (key: string) => {
  await redis.del(key); // Löscht den angegebenen Cache-Schlüssel
};
