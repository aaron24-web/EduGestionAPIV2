// src/modules/users/users.service.js
import { supabase } from '../../config/supabaseClient.js';

export const getUserMeService = async (userId) => {
  const { data, error } = await supabase
    .from('users')
    .select('id, email, full_name, role, avatar_url, created_at') // ¡NUNCA seleccionar password_hash!
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data;
};

export const updateUserMeService = async (userId, fullName, avatarUrl) => {
  const updates = {};
  if (fullName) updates.full_name = fullName;
  if (avatarUrl) updates.avatar_url = avatarUrl;

  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', userId)
    .select('id, email, full_name, role, avatar_url, created_at')
    .single();
  
  if (error) throw error;
  return data;
};