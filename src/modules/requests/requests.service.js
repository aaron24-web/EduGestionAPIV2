import { supabase } from '../../config/supabaseClient.js';

// (La función createRequestService se queda igual)
export const createRequestService = async (clientId, studentId, academyId, problemDescription, subjects) => {
  const { data, error } = await supabase
    .from('requests')
    .insert({
      client_id: clientId,
      student_id: studentId,
      academy_id: academyId,
      problem_description: problemDescription,
      subjects_of_interest: subjects,
      status: 'pending_assignment', // El estado inicial
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

// (La función assignAssessorService se queda igual)
export const assignAssessorService = async (requestId, adminId, assessorId) => {
  // 1. Verificar que el adminId sea el dueño de la academia de esta solicitud
  const { data: requestData, error: requestError } = await supabase
    .from('requests')
    .select('academy_id')
    .eq('id', requestId)
    .single();

  if (requestError) throw new Error('Solicitud no encontrada.');

  const { data: academyData, error: academyError } = await supabase
    .from('academies')
    .select('id')
    .eq('id', requestData.academy_id)
    .eq('owner_id', adminId) // ¡Seguridad! Verifica que el admin sea el dueño
    .single();
  
  if (academyError || !academyData) {
    throw new Error('No autorizado: No eres el admin de la academia de esta solicitud.');
  }

  // 3. Actualizar la solicitud
  const { data, error } = await supabase
    .from('requests')
    .update({
      assigned_assessor_id: assessorId,
      status: 'pending_plan', // Siguiente estado: el asesor debe crear el plan
    })
    .eq('id', requestId)
    .select()
    .single();
  
  if (error) throw error;
  
  return data;
};

// --- FUNCIÓN CORREGIDA ---
export const getRequestsService = async (userId, userRole) => {
  
  // CORRECCIÓN: Usamos el nombre de la columna FK (client_id y assigned_assessor_id)
  // en lugar del nombre de la tabla (users) para ser explícitos.
  let query = supabase.from('requests').select(`
    id,
    status,
    problem_description,
    subjects_of_interest,
    student:students(id, name),
    academy:academies(id, name),
    client:client_id(id, full_name, email), 
    assessor:assigned_assessor_id(id, full_name, email)
  `);

  // Filtramos según el rol
  if (userRole === 'client') {
    query = query.eq('client_id', userId);
  } else if (userRole === 'assessor') {
    query = query.eq('assigned_assessor_id', userId);
  } else if (userRole === 'admin_academy') {
    // TODO: Mejorar este query para que el admin vea las de su 'academy_id'
    query = query.eq('client_id', userId); // Simplificación temporal
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
};

/**
 * Obtiene los detalles de UNA solicitud, incluyendo el ID de la conversación.
 */
export const getRequestByIdService = async (userId, userRole, requestId) => {
  // 1. Obtener la solicitud y sus relaciones
  const { data: request, error } = await supabase
    .from('requests')
    .select(`
      *,
      student:students(id, name),
      academy:academies(id, name, owner_id),
      client:client_id(id, full_name, email),
      assessor:assigned_assessor_id(id, full_name, email),
      conversation:conversations(id)
    `)
    .eq('id', requestId)
    .single();

  if (error) throw new Error('404: Solicitud no encontrada.');

  // 2. --- ¡Seguridad! ---
  // Verificar que el usuario logueado tenga permiso para ver esto
  const isClient = userRole === 'client' && request.client.id === userId;
  const isAssessor = (userRole === 'assessor' || userRole === 'admin_academy') && request.assessor?.id === userId;
  const isAdmin = userRole === 'admin_academy' && request.academy.owner_id === userId;

  if (!isClient && !isAssessor && !isAdmin) {
    throw new Error('403: Acceso denegado a esta solicitud.');
  }

  // 3. Limpiar la respuesta
  // El 'select' de Supabase devuelve 'conversation' como un array.
  // Lo aplanamos para que sea más fácil de usar en el frontend.
  const conversationId = request.conversation.length > 0 ? request.conversation[0].id : null;
  delete request.conversation; // Quitamos el array
  request.conversation_id = conversationId; // Añadimos el ID directamente

  return request;
};