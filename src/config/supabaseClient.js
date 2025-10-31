import { createClient } from '@supabase/supabase-js';
import config from './index.js'; // Importamos nuestra configuración centralizada

// Creamos y exportamos el cliente singleton de Supabase
// Este es el único lugar en toda la app que sabe cómo conectarse a Supabase.
export const supabase = createClient(config.supabaseUrl, config.supabaseAnonKey);