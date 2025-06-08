import { createClient } from '@supabase/supabase-js';

// Usa variables de entorno definidas en Vercel o .env local
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Inicializa la conexión con Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
