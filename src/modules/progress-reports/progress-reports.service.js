import { supabase } from '../../config/supabaseClient.js';

/**
 * (Asesor) Crea un nuevo reporte de progreso.
 */
export const createReportService = async (assessorId, planId, sessionId, reportContent) => {
  // 1. (Seguridad) Verificar que el asesor esté asignado a este plan
  const { data: plan, error: planError } = await supabase
    .from('teaching_plans')
    .select('id')
    .eq('id', planId)
    .eq('assessor_id', assessorId)
    .single();

  if (planError || !plan) {
    throw new Error('403: No autorizado. Plan no encontrado o no te pertenece.');
  }

  // 2. (Opcional) Verificar que la sesión pertenezca al plan
  // ...

  // 3. Crear el reporte de progreso
  const { data, error } = await supabase
    .from('progress_reports')
    .insert({
      plan_id: planId,
      session_id: sessionId, // Puede ser nulo si es un reporte general
      assessor_id: assessorId,
      report_content: reportContent,
    })
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

/**
 * (Cliente/Asesor) Obtiene todos los reportes de un plan
 */
export const getReportsByPlanService = async (userId, userRole, planId) => {
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
    throw new Error('403: No autorizado para ver los reportes de este plan.');
  }

  // 2. Obtener los reportes
  const { data, error } = await supabase
    .from('progress_reports')
    .select(`
      id,
      report_content,
      created_at,
      session:sessions(id, scheduled_start)
    `)
    .eq('plan_id', planId)
    .order('created_at', { ascending: false }); // El más reciente primero

  if (error) throw error;
  return data;
};