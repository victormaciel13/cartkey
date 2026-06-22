// app/service/supabase.ts
import 'react-native-url-polyfill/auto';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('[CartKey] Variaveis EXPO_PUBLIC_SUPABASE_* ausentes. Confira o .env.');
}

const isWeb = Platform.OS === 'web';

// Storage seguro: se o modulo nativo do AsyncStorage falhar, nao derruba o app.
// A sessao so deixa de persistir entre reinicios, mas o app continua funcionando.
const safeStorage = {
  getItem: async (key: string) => {
    try {
      return await AsyncStorage.getItem(key);
    } catch {
      return null;
    }
  },
  setItem: async (key: string, value: string) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch {
      /* ignora */
    }
  },
  removeItem: async (key: string) => {
    try {
      await AsyncStorage.removeItem(key);
    } catch {
      /* ignora */
    }
  },
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Web: deixa o Supabase usar o localStorage do navegador.
    // Nativo: usa o AsyncStorage com protecao contra falha do modulo.
    storage: isWeb ? undefined : safeStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});