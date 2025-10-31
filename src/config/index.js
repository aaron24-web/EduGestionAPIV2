// src/config/index.js

import 'dotenv/config'; // Carga las variables del .env inmediatamente

const config = {
  supabaseUrl: process.env.SUPABASE_URL,
  supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET, // Nuestro secreto para firmar tokens
};

// --- Validación de Variables ---
// Si alguna variable esencial no está definida, detenemos la app.
if (!config.supabaseUrl || !config.supabaseAnonKey || !config.jwtSecret) {
  console.error("Error fatal: SUPABASE_URL, SUPABASE_ANON_KEY y JWT_SECRET deben estar definidos en el archivo .env");
  process.exit(1); // Detiene la aplicación con un código de error
}

// Exportamos una versión "congelada" del objeto para que no se pueda modificar
// por accidente en otras partes de la aplicación.
export default Object.freeze(config);