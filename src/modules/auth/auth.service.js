import { supabase } from '../../config/supabaseClient.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../../config/index.js';

const SALT_ROUNDS = 10;

export const signUpService = async (email, password, fullName, role) => {
  // 1. Hashear la contraseña
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  // 2. Insertar en nuestra tabla 'users'
  const { data: newUser, error: userError } = await supabase
    .from('users')
    .insert({
      full_name: fullName,
      email: email,
      password_hash: passwordHash,
      role: role,
    })
    .select('id, email, full_name, role, created_at')
    .single();

  if (userError) {
    if (userError.code === '23505') {
      throw new Error('Un usuario con este email ya existe.');
    }
    throw userError;
  }

  // --- ¡AQUÍ ESTÁ EL ARREGLO! ---
  // 3. Si es un 'admin_academy', crear su academia automáticamente
  if (role === 'admin_academy') {
    const { error: academyError } = await supabase
      .from('academies')
      .insert({
        owner_id: newUser.id,
        name: `Academia de ${fullName}`, // Un nombre por defecto
        landing_page_config: { description: `Bienvenido a la academia de ${fullName}` } // Config por defecto
      });
    
    if (academyError) {
      // Si esto falla, idealmente deberíamos borrar el usuario (rollback)
      // Pero por ahora, solo lanzamos el error
      throw new Error(`Error creando la academia: ${academyError.message}`);
    }
  }
  // --- FIN DEL ARREGLO! ---

  return newUser;
};

// (El loginService se queda exactamente igual)
export const loginService = async (email, password) => {
  // 1. Encontrar al usuario por email
  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (error || !user) {
    throw new Error('Credenciales inválidas.');
  }

  // 2. Comparar la contraseña hasheada
  const isPasswordValid = await bcrypt.compare(password, user.password_hash);

  if (!isPasswordValid) {
    throw new Error('Credenciales inválidas.');
  }

  // 3. Crear NUESTRO propio JWT
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
  };

  const token = jwt.sign(payload, config.jwtSecret, {
    expiresIn: '7d',
  });

  // 4. Devolver el token y los datos del usuario (sin el hash)
  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      role: user.role,
      avatar_url: user.avatar_url,
    },
  };
};