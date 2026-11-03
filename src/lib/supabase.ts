import { createClient } from '@supabase/supabase-js';

// Surcharge possible par variables d'environnement (Vercel, .env.local) ; la clé
// « anon » est publique par nature, la sécurité repose sur RLS (supabase/security.sql).
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://vaufybtidzejfoqgbpvo.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZhdWZ5YnRpZHplamZvcWdicHZvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEyMjY5NjksImV4cCI6MjA5NjgwMjk2OX0._MH2kQal2xRB1CYcW1Hnym105-vxilOY_hA6D00Qaac';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export type Database = {
  public: {
    Tables: {
      collection: {
        Row: {
          id: string;
          user_id: string;
          edition_id: string;
          sticker_number: number;
          owned: boolean;
          duplicates: number;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['collection']['Row'], 'id' | 'updated_at'>;
      };
      trades: {
        Row: {
          id: string;
          user_id: string;
          share_token: string;
          have_stickers: Array<{ editionId: string; number: number }>;
          want_stickers: Array<{ editionId: string; number: number }>;
          created_at: string;
        };
      };
      profiles: {
        Row: {
          id: string;
          username: string | null;
          avatar_url: string | null;
          created_at: string;
        };
      };
    };
  };
};
