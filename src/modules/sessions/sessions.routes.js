// src/modules/sessions/sessions.routes.js
import express from 'express';
import {
  createSessionController,
  getSessionsByPlanController,
  updateSessionStatusController
} from './sessions.controller.js';
import { authMiddleware } from '../../core/middleware/authMiddleware.js';

const router = express.Router();

/**
 * @openapi
 * /sessions:
 *   post:
 *     summary: (Cliente/Asesor) Agenda una nueva sesión para un plan pagado
 *     tags: [Sessions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               plan_id:
 *                 type: string
 *                 format: uuid
 *               assessor_id:
 *                 type: string
 *                 format: uuid
 *               student_id:
 *                 type: string
 *                 format: uuid
 *               scheduled_start:
 *                 type: string
 *                 format: date-time
 *                 example: '2025-12-10T14:00:00Z'
 *               scheduled_end:
 *                 type: string
 *                 format: date-time
 *                 example: '2025-12-10T15:00:00Z'
 *     responses:
 *       201:
 *         description: Sesión agendada.
 *       403:
 *         description: El plan no ha sido pagado o no tienes permisos.
 *       404:
 *         description: Plan no encontrado.
 */
router.post('/', authMiddleware, createSessionController);

/**
 * @openapi
 * /sessions/plan/{planId}:
 *   get:
 *     summary: (Cliente/Asesor) Obtiene todas las sesiones de un plan
 *     tags: [Sessions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: planId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: El ID del plan de enseñanza.
 *     responses:
 *       200:
 *         description: Una lista de sesiones agendadas.
 *       403:
 *         description: No autorizado para ver este plan.
 *       404:
 *         description: Plan no encontrado.
 */
router.get('/plan/:planId', authMiddleware, getSessionsByPlanController);

/**
 * @openapi
 * /sessions/{id}:
 *   patch:
 *     summary: (Asesor) Actualiza el estado de una sesión (ej. completada)
 *     tags: [Sessions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: El ID de la sesión.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [scheduled, completed, cancelled]
 *                 example: 'completed'
 *     responses:
 *       200:
 *         description: Sesión actualizada.
 *       403:
 *         description: No eres el asesor de esta sesión.
 *       404:
 *         description: Sesión no encontrada.
 */
router.patch('/:id', authMiddleware, updateSessionStatusController);

export default router;