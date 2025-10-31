import { supabase } from '../../config/supabaseClient.js';

// Servicio para OBTENER todos los estudiantes de un cliente
export const getStudentsByClientIdService = async (clientId) => {
  const { data, error } = await supabase
    .from('students')
    .select('*')
    .eq('client_id', clientId); // Filtra por el ID del cliente logueado

  if (error) throw error;
  return data;
};

// Servicio para CREAR un nuevo estudiante
export const createStudentService = async (clientId, name, educationLevel, details) => {
  const { data, error } = await supabase
    .from('students')
    .insert({
      client_id: clientId, // Asigna el estudiante al cliente logueado
      name,
      education_level: educationLevel,
      details,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Servicio para ACTUALIZAR un estudiante
export const updateStudentService = async (studentId, clientId, updates) => {
  const { data, error } = await supabase
    .from('students')
    .update(updates)
    .eq('id', studentId)       // Donde el ID del estudiante coincida
    .eq('client_id', clientId) // Y TAMBIÉN el ID del cliente coincida
    .select()
    .single();

  if (error) {
    if (error.code === 'PGRST116') { // Error de Supabase "0 rows returned"
      throw new Error('Estudiante no encontrado o no pertenece a este usuario.');
    }
    throw error;
  }
  return data;
};

// Servicio para ELIMINAR un estudiante
export const deleteStudentService = async (studentId, clientId) => {
  const { data, error } = await supabase
    .from('students')
    .delete()
    .eq('id', studentId)       // Donde el ID del estudiante coincida
    .eq('client_id', clientId) // Y TAMBIÉN el ID del cliente coincida
    .select()
    .single();
  
  if (error) {
    if (error.code === 'PGRST116') {
      throw new Error('Estudiante no encontrado o no pertenece a este usuario.');
    }
    throw error;
  }
  return data;
};