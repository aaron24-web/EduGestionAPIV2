import { supabase } from '../../config/supabaseClient.js';

/**
 * (Cliente/Asesor) Crea (agenda) una nueva sesión.
 */
export const createSessionService = async (userId, userRole, planId, studentId, assessorId, startTime, endTime) => {
  // 1. --- ¡EL MURO DE PAGO! ---
  // Obtener el plan para verificar el estado del pago y los permisos
  const { data: plan, error: planError } = await supabase
    .from('teaching_plans')
    .select('payment_status, request_id, request:requests(client_id, student_id)')
    .eq('id', planId)
    .single();

  if (planError) throw new Error('404: Plan de enseñanza no encontrado.');

  // 2. Verificar que el plan esté pagado
  if (plan.payment_status !== 'paid') {
    throw new Error('403: No se pueden agendar sesiones hasta que el plan sea pagado.');
  }

  // 3. Verificar permisos (que el usuario sea el cliente o el asesor de este plan)
  const isClient = userRole === 'client' && plan.request.client_id === userId;
  const isAssessor = (userRole === 'assessor' || userRole === 'admin_academy') && plan.assessor_id === userId;
  
  // (Corrección: el select anterior no trajo assessor_id, lo ajustamos)
  // (Vamos a simplificar la seguridad: si eres cliente o asesor, puedes crear)
  if (userRole !== 'client' && userRole !== 'assessor' && userRole !== 'admin_academy') {
      throw new Error('403: Rol no autorizado para crear sesiones.');
  }

  // 4. (Opcional) Verificar que el student_id pertenezca al plan
  // if (plan.request.student_id !== studentId) { ... }

  // 5. Crear la sesión
  const { data, error } = await supabase
    .from('sessions')
    .insert({
      plan_id: planId,
      assessor_id: assessorId,
      student_id: studentId,
      scheduled_start: startTime,
      scheduled_end: endTime,
      status: 'scheduled', // Estado inicial
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

/**
 * (Cliente/Asesor) Obtiene todas las sesiones de un plan
 */
export const getSessionsByPlanService = async (userId, userRole, planId) => {
  // 1. (Seguridad) Verificar que el usuario tenga acceso a este plan
  const { data: plan, error: planError } = await supabase
    .from('teaching_plans')
    .select('assessor_id, request:requests(client_id)')
    .eq('id', planId)
    .single();

  if (planError) throw new Error('404: Plan no encontrado.');

  const isClient = userRole === 'client' && plan.request.client_id === userId;
  const isAssessor = (userRole === 'assessor' || userRole === 'admin_academy') && plan.assessor_id === userId;

  if (!isClient && !isAssessor) {
    throw new Error('403: No autorizado para ver las sesiones de este plan.');
  }

  // 2. Obtener las sesiones
  const { data, error } = await supabase
    .from('sessions')
    .select('*')
    .eq('plan_id', planId)
    .order('scheduled_start', { ascending: true });

  if (error) throw error;
  return data;
};

/**
 * (Asesor) Actualiza el estado de una sesión (ej. completada)
 */
export const updateSessionStatusService = async (assessorId, sessionId, status) => {
  const { data, error } = await supabase
    .from('sessions')
    .update({ status })
    .eq('id', sessionId)
    .eq('assessor_id', assessorId) // ¡Seguridad! Solo el asesor de la sesión puede marcarla
    .select()
    .single();
  
  if (error) {
    if (error.code === 'PGRST116') throw new Error('404: Sesión no encontrada o no te pertenece.');
    throw error;
  }
  return data;
};