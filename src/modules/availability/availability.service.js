import { supabase } from '../../config/supabaseClient.js';

/**
 * (Asesor) Crea un nuevo bloque de disponibilidad
 */
export const createAvailabilityService = async (assessorId, startTime, endTime) => {
  const { data, error } = await supabase
    .from('assessor_availability')
    .insert({
      assessor_id: assessorId,
      start_time: startTime,
      end_time: endTime,
    })
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

/**
 * (Público) Obtiene todos los bloques de disponibilidad de un asesor
 */
export const getAvailabilityByAssessorService = async (assessorId) => {
  const { data, error } = await supabase
    .from('assessor_availability')
    .select('*')
    .eq('assessor_id', assessorId)
    .gt('start_time', new Date().toISOString()); // Opcional: solo mostrar disponibilidad futura

  if (error) throw error;
  return data;
};

/**
 * (Asesor) Elimina un bloque de disponibilidad
 */
export const deleteAvailabilityService = async (availabilityId, assessorId) => {
  const { data, error } = await supabase
    .from('assessor_availability')
    .delete()
    .eq('id', availabilityId)
    .eq('assessor_id', assessorId) // ¡Seguridad! Solo el dueño puede borrar
    .select()
    .single();

  if (error) {
    if (error.code === 'PGRST116') { // Error "0 rows returned"
      throw new Error('Bloque de disponibilidad no encontrado o no te pertenece.');
    }
    throw error;
  }
  return data;
};