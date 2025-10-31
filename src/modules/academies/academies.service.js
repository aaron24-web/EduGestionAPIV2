import { supabase } from '../../config/supabaseClient.js';

// Servicio para OBTENER datos públicos (Landing Page)
export const getAcademyLandingService = async (academyId) => {
  const { data, error } = await supabase
    .from('academies')
    .select('name, landing_page_config') // Solo datos públicos
    .eq('id', academyId)
    .single();

  if (error) throw new Error('Academia no encontrada.');
  return data;
};

// Servicio para OBTENER la academia del admin logueado
export const getMyAcademyService = async (adminId) => {
  // 1. Obtenemos la academia del admin
  const { data: academy, error } = await supabase
    .from('academies')
    .select('*')
    .eq('owner_id', adminId)
    .single();

  if (error) throw new Error('Academia no encontrada o no eres el propietario.');

  // 2. Obtenemos los miembros de esa academia
  const { data: members } = await supabase
    .from('academy_members')
    .select('role, user_details:users(id, full_name, email)') // Hacemos un JOIN con la tabla users
    .eq('academy_id', academy.id);

  // 3. Combinamos los resultados
  return { ...academy, members };
};

// Servicio para ACTUALIZAR la academia del admin
export const updateMyAcademyService = async (adminId, updates) => {
  // 1. Encontrar la academia del admin
  const { data: academy, error: findError } = await supabase
    .from('academies')
    .select('id')
    .eq('owner_id', adminId)
    .single();

  if (findError) throw new Error('No se encontró una academia para este propietario.');

  // 2. Actualizarla usando su ID
  const { data, error } = await supabase
    .from('academies')
    .update(updates)
    .eq('id', academy.id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Servicio para AÑADIR un miembro a la academia
export const addAcademyMemberService = async (adminId, emailToAdd, roleToAdd) => {
  // 1. Encontrar la academia del admin
  const { data: academy, error: findError } = await supabase
    .from('academies')
    .select('id')
    .eq('owner_id', adminId)
    .single();
  if (findError) throw new Error('Academia no encontrada o no eres el propietario.');

  // 2. Encontrar al usuario que se quiere añadir por su email
  const { data: user, error: userError } = await supabase
    .from('users')
    .select('id')
    .eq('email', emailToAdd)
    .single();
  if (userError) throw new Error(`Usuario con email '${emailToAdd}' no encontrado.`);

  // 3. Insertar en la tabla 'academy_members'
  const { data, error } = await supabase
    .from('academy_members')
    .insert({
      academy_id: academy.id,
      profile_id: user.id, // 'profile_id' es el nombre de la columna en la BD
      role: roleToAdd,
    })
    .select();
  
  if (error) {
    if (error.code === '23505') throw new Error('Este usuario ya es miembro de la academia.');
    throw error;
  }
  return data;
};