import {
  getMessagesByConversationService,
  createMessageService
} from './messages.service.js';

// Controlador para OBTENER mensajes
export const getMessagesController = async (req, res) => {
  try {
    const { id: userId, role: userRole } = req.user;
    const { conversationId } = req.params;

    const messages = await getMessagesByConversationService(userId, userRole, conversationId);
    return res.status(200).json(messages);
  } catch (error) {
    if (error.message.startsWith('403:')) return res.status(403).json({ error: error.message.substring(5) });
    if (error.message.startsWith('404:')) return res.status(404).json({ error: error.message.substring(5) });
    return res.status(500).json({ error: error.message });
  }
};

// Controlador para CREAR un mensaje
export const createMessageController = async (req, res) => {
  try {
    const { id: senderId, role: userRole } = req.user;
    const { conversation_id, content } = req.body;

    if (!conversation_id || !content) {
      return res.status(400).json({ error: 'conversation_id y content son obligatorios.' });
    }

    const newMessage = await createMessageService(senderId, userRole, conversation_id, content);
    return res.status(201).json(newMessage);
  } catch (error) {
    if (error.message.startsWith('403:')) return res.status(403).json({ error: error.message.substring(5) });
    if (error.message.startsWith('404:')) return res.status(404).json({ error: error.message.substring(5) });
    return res.status(500).json({ error: error.message });
  }
};