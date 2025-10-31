// src/modules/messages/messages.routes.js
import express from 'express';
import {
  getMessagesController,
  createMessageController
} from './messages.controller.js';
import { authMiddleware } from '../../core/middleware/authMiddleware.js';

const router = express.Router();

/**
 * @openapi
 * /messages:
 *   post:
 *     summary: (Cliente/Asesor) Envía un nuevo mensaje a una conversación
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               conversation_id:
 *                 type: string
 *                 format: uuid
 *                 description: El ID de la sala de chat.
 *               content:
 *                 type: string
 *                 example: 'Hola, tengo una duda sobre el plan.'
 *     responses:
 *       201:
 *         description: Mensaje enviado.
 *       403:
 *         description: No autorizado para esta conversación.
 *       404:
 *         description: Conversación no encontrada.
 */
router.post('/', authMiddleware, createMessageController);

/**
 * @openapi
 * /messages/{conversationId}:
 *   get:
 *     summary: (Cliente/Asesor) Obtiene el historial de mensajes de una conversación
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: conversationId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *           description: El ID de la sala de chat.
 *     responses:
 *       200:
 *         description: Una lista de mensajes.
 *       403:
 *         description: No autorizado para esta conversación.
 *       404:
 *         description: Conversación no encontrada.
 */
router.get('/:conversationId', authMiddleware, getMessagesController);

export default router;