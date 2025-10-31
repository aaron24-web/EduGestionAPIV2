import { supabase } from '../../config/supabaseClient.js';

/**
 * (Asesor) Crea un nuevo plan de enseñanza.
 */
export const createPlanService = async (assessorId, requestId, diagnosis, goals, curriculum) => {
  // 1. Verificar que el asesor esté asignado a esta solicitud
  const { data: request, error: requestError } = await supabase
    .from('requests')
    .select('id, status')
    .eq('id', requestId)
    .eq('assigned_assessor_id', assessorId)
    .single();

  if (requestError || !request) {
    throw new Error('No autorizado: No estás asignado a esta solicitud.');
  }

  // 2. (Opcional) Verificar que el plan no exista ya
  // ...

  // 3. Crear el Plan de Enseñanza
  const { data: newPlan, error: planError } = await supabase
    .from('teaching_plans')
    .insert({
      request_id: requestId,
      assessor_id: assessorId,
      diagnosis,
      goals,
      curriculum, // Esto debe ser un JSON, ej: { "temas": [...] }
      status: 'pending_approval', // El plan se somete a revisión de inmediato
    })
    .select()
    .single();

  if (planError) throw planError;

  // 4. Actualizar el estado de la solicitud original
  await supabase
    .from('requests')
    .update({ status: 'plan_review' }) // El plan está listo para revisión
    .eq('id', requestId);

  return newPlan;
};

/**
 * (Cliente) Aprueba o rechaza un plan de enseñanza.
 */
export const reviewPlanService = async (clientId, planId, status) => {
  if (status !== 'approved' && status !== 'rejected') {
    throw new Error('El estado solo puede ser "approved" o "rejected".');
  }

  // 1. Verificar que el cliente sea el dueño de la solicitud de este plan
  const { data: plan, error: planError } = await supabase
    .from('teaching_plans')
    .select('id, request_id, request:requests(client_id)')
    .eq('id', planId)
    .single();

  if (planError || !plan) throw new Error('Plan no encontrado.');
  if (plan.request.client_id !== clientId) {
    throw new Error('No autorizado: Este plan no pertenece a una de tus solicitudes.');
  }

  // 2. Actualizar el Plan de Enseñanza
  const { data: updatedPlan, error: updateError } = await supabase
    .from('teaching_plans')
    .update({ status }) // 'approved' o 'rejected'
    .eq('id', planId)
    .select()
    .single();

  if (updateError) throw updateError;

  // 3. Actualizar la solicitud principal
  let requestStatus;
  if (status === 'approved') {
    requestStatus = 'active'; // ¡Aprobado! Listo para agendar/pagar.
  } else {
    requestStatus = 'pending_plan'; // Rechazado. El asesor debe crear uno nuevo (o editar).
  }
  
  await supabase
    .from('requests')
    .update({ status: requestStatus })
    .eq('id', plan.request_id);

  return updatedPlan;
};

/**
 * Obtiene los detalles de un plan (si eres el Asesor o el Cliente)
 */
export const getPlanService = async (userId, userRole, planId) => {
  const { data: plan, error } = await supabase
    .from('teaching_plans')
    .select('*, request:requests(client_id)')
    .eq('id', planId)
    .single();

  if (error) throw new Error('Plan no encontrado.');

  // Seguridad: Solo el asesor del plan o el cliente de la solicitud pueden verlo
  const isAssessor = userRole === 'assessor' && plan.assessor_id === userId;
  const isClient = userRole === 'client' && plan.request.client_id === userId;

  if (!isAssessor && !isClient) {
    throw new Error('Acceso denegado a este plan.');
  }

  return plan;
};

/**
 * (Cliente) Simula el pago de un plan de enseñanza.
 */
export const payPlanService = async (clientId, planId) => {
  // 1. Verificar que el plan exista, pertenezca al cliente y esté aprobado
  const { data: plan, error: planError } = await supabase
    .from('teaching_plans')
    .select('id, status, payment_status, request:requests(client_id)')
    .eq('id', planId)
    .single();

  if (planError) throw new Error('Plan no encontrado.');
  if (plan.request.client_id !== clientId) {
    throw new Error('No autorizado: Este plan no pertenece a tus solicitudes.');
  }
  if (plan.status !== 'approved') {
    throw new Error('Este plan no puede ser pagado hasta que sea aprobado.');
  }
  if (plan.payment_status === 'paid') {
    throw new Error('Este plan ya ha sido pagado.');
  }

  // 2. Actualizar el estado de pago
  const { data: updatedPlan, error: updateError } = await supabase
    .from('teaching_plans')
    .update({ payment_status: 'paid' }) // ¡Pagado!
    .eq('id', planId)
    .select()
    .single();

  if (updateError) throw updateError;
  return updatedPlan;
};