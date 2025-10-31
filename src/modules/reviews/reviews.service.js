import { supabase } from '../../config/supabaseClient.js';

/**
 * (Cliente) Crea una nueva reseña para un plan.
 */
export const createReviewService = async (clientId, planId, rating, comment) => {
  // 1. (Seguridad) Verificar que el cliente sea el dueño de este plan
  const { data: plan, error: planError } = await supabase
    .from('teaching_plans')
    .select('id, request:requests(client_id)')
    .eq('id', planId)
    .single();

  if (planError || !plan) throw new Error('404: Plan no encontrado.');
  if (plan.request.client_id !== clientId) {
    throw new Error('403: No autorizado. No eres el cliente de este plan.');
  }

  // 2. (Regla de Negocio) Verificar que el cliente haya tomado al menos una clase
  const { data: sessions, error: sessionError } = await supabase
    .from('sessions')
    .select('id')
    .eq('plan_id', planId)
    .eq('status', 'completed')
    .limit(1);

  if (sessionError || sessions.length === 0) {
    throw new Error('403: Debes haber completado al menos una sesión para dejar una reseña.');
  }
  
  // 3. Insertar la reseña
  const { data, error } = await supabase
    .from('reviews')
    .insert({
      plan_id: planId,
      client_id: clientId,
      rating: rating,
      comment: comment,
    })
    .select()
    .single();
  
  if (error) {
    if (error.code === '23505') { // Error de unique constraint
      throw new Error('409: Ya has dejado una reseña para este plan.');
    }
    throw error;
  }
  return data;
};

// --- ESTA ES LA FUNCIÓN CORREGIDA ---
/**
 * (Público) Obtiene todas las reseñas de una academia.
 */
export const getReviewsByAcademyService = async (academyId) => {
  
  // 1. Encontrar todos los IDs de planes (teaching_plans)
  // que pertenecen a solicitudes (requests) de la academia correcta.
  
  // LA CORRECCIÓN ESTÁ AQUÍ:
  // Usamos 'requests!inner(academy_id)' (el nombre de la TABLA)
  // y filtramos con 'requests.academy_id'
  const { data: plans, error: planError } = await supabase
    .from('teaching_plans')
    .select('id, request:requests!inner(academy_id)') // ¡JOIN con la tabla 'requests'!
    .eq('requests.academy_id', academyId); // ¡Filtra por 'requests.academy_id'!

  if (planError) {
    console.error('Error al buscar planes:', planError);
    throw planError;
  }

  const planIds = plans.map(p => p.id);
  if (planIds.length === 0) {
    return []; // Correcto: La academia no tiene reseñas
  }

  // 2. Encontrar todas las reseñas (reviews) de esos planes
  const { data, error } = await supabase
    .from('reviews')
    .select(`
      id,
      rating,
      comment,
      created_at,
      client:client_id(full_name, avatar_url)
    `)
    .in('plan_id', planIds)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error al buscar reseñas:', error);
    throw error;
  }
  return data;
};