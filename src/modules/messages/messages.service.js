import { supabase } from '../../config/supabaseClient.js';

/**
 * (Servicio de Seguridad Interno)
 * Verifica si un usuario tiene permiso para estar en una conversación.
 */
const checkConversationAccess = async (userId, userRole, conversationId) => {
  const { data, error } = await supabase
    .from('conversations')
    .select('request:requests(client_id, assigned_assessor_id, academy:academies(owner_id))')
    .eq('id', conversationId)
    .single();
  
  if (error) throw new Error('404: Conversación no encontrada.');

  const request = data.request;
  const isClient = userRole === 'client' && request.client_id === userId;
  const isAssessor = (userRole === 'assessor' || userRole === 'admin_academy') && request.assigned_assessor_id === userId;
  const isAdmin = userRole === 'admin_academy' && request.academy.owner_id === userId;

  if (!isClient && !isAssessor && !isAdmin) {
    throw new Error('403: Acceso denegado a esta conversación.');
  }
  return true; // El usuario tiene acceso
};

/**
 * Obtiene todos los mensajes de una conversación.
 */
export const getMessagesByConversationService = async (userId, userRole, conversationId) => {
  // 1. Verificar seguridad
  await checkConversationAccess(userId, userRole, conversationId);

  // 2. Obtener mensajes
  const { data, error } = await supabase
    .from('messages')
    .select('id, content, created_at, sender:sender_id(id, full_name, role)')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data;
};

/**
 * (Cliente/Asesor) Envía un nuevo mensaje.
 */
export const createMessageService = async (senderId, userRole, conversationId, content) => {
  // 1. Verificar seguridad (el 'senderId' es el userId)
  await checkConversationAccess(senderId, userRole, conversationId);

  // 2. Insertar el mensaje
  const { data, error } = await supabase
    .from('messages')
    .insert({
      conversation_id: conversationId,
      sender_id: senderId,
      content: content,
    })
    .select('id, content, created_at, sender:sender_id(id, full_name, role)')
    .single();

  if (error) throw error;
  return data;
};