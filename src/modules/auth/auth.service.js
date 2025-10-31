// src/modules/auth/auth.service.js
import { supabase } from '../../config/supabaseClient.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../../config/index.js';

const SALT_ROUNDS = 10;

export const signUpService = async (email, password, fullName, role) => {
  // 1. Hashear la contraseña
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  // 2. Insertar en nuestra tabla 'users'
  const { data, error } = await supabase
    .from('users')
    .insert({
      full_name: fullName,
      email: email,
      password_hash: passwordHash,
      role: role,
    })
    .select('id, email, full_name, role, created_at') // Devolvemos el usuario (sin el hash)
    .single();

  if (error) {
    // Manejo de error de email duplicado
    if (error.code === '23505') { // Código de violación de 'unique'
      throw new Error('Un usuario con este email ya existe.');
    }
    throw error;
  }
  return data;
};

export const loginService = async (email, password) => {
  // 1. Encontrar al usuario por email
  const { data: user, error } = await supabase
    .from('users')
    .select('*') // Necesitamos el 'password_hash'
    .eq('email', email)
    .single();

  if (error || !user) {
    throw new Error('Credenciales inválidas.'); // Error genérico
  }

  // 2. Comparar la contraseña hasheada
  const isPasswordValid = await bcrypt.compare(password, user.password_hash);

  if (!isPasswordValid) {
    throw new Error('Credenciales inválidas.'); // Error genérico
  }

  // 3. Crear NUESTRO propio JWT
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
  };

  const token = jwt.sign(payload, config.jwtSecret, {
    expiresIn: '7d', // El token durará 7 días
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