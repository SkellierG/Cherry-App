import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import env from './env';

const createStorage = () => {
  try {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem("__test__", "test");
      localStorage.removeItem("__test__");
      return {
        async getItem(key: string) {
          return localStorage.getItem(key);
        },
        async setItem(key: string, value: string) {
          localStorage.setItem(key, value);
        },
        async removeItem(key: string) {
          localStorage.removeItem(key);
        },
      };
    }
  } catch (error) {
    console.warn("localStorage no está disponible. Usando almacenamiento en memoria.");
  }

  let memoryStorage: Record<string, string> = {};
  return {
    async getItem(key: string) {
      return memoryStorage[key] || null;
    },
    async setItem(key: string, value: string) {
      memoryStorage[key] = value;
    },
    async removeItem(key: string) {
      delete memoryStorage[key];
    },
  };
};

const supabaseUrl = env.EXPO_PUBLIC_SUPABASE_URL
const supabaseAnonKey =  env.EXPO_PUBLIC_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: createStorage(),
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
