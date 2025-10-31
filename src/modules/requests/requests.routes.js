// src/modules/requests/requests.routes.js
import express from 'express';
import {
  createRequestController,
  assignAssessorController,
  getRequestsController
} from './requests.controller.js';
import { authMiddleware } from '../../core/middleware/authMiddleware.js';

const router = express.Router();

/**
 * @openapi
 * /requests:
 *   get:
 *     summary: Obtiene las solicitudes del usuario logueado
 *     description: |
 *       - Si eres 'client', ves tus solicitudes.
 *       - Si eres 'assessor', ves las solicitudes asignadas.
 *       - Si eres 'admin_academy', (actualmente) ves las que creaste como cliente (WIP).
 *     tags: [Requests]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Una lista de solicitudes.
 *       401:
 *         description: No autorizado.
 *   post:
 *     summary: (Cliente) Crea una nueva solicitud de asesoría
 *     tags: [Requests]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               student_id:
 *                 type: string
 *                 format: uuid
 *                 description: El ID del estudiante (perfil) que tomará la asesoría.
 *               academy_id:
 *                 type: string
 *                 format: uuid
 *                 description: El ID de la academia a la que se solicita.
 *               problem_description:
 *                 type: string
 *                 example: 'Mi hijo necesita ayuda con cálculo diferencial.'
 *               subjects_of_interest:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ['Cálculo', 'Integrales']
 *     responses:
 *       201:
 *         description: Solicitud creada exitosamente.
 *       400:
 *         description: Faltan campos obligatorios.
 *       403:
 *         description: Acceso denegado (no eres 'client').
 */
router.route('/')
  .get(authMiddleware, getRequestsController)
  .post(authMiddleware, createRequestController);

/**
 * @openapi
 * /requests/{id}/assign:
 *   patch:
 *     summary: (Admin) Asigna un asesor a una solicitud
 *     tags: [Requests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: El ID de la solicitud a asignar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               assessor_id:
 *                 type: string
 *                 format: uuid
 *                 description: El ID del usuario (asesor) a asignar.
 *     responses:
 *       200:
 *         description: Asesor asignado y estado de la solicitud actualizado.
 *       400:
 *         description: Falta 'assessor_id'.
 *       403:
 *         description: Acceso denegado (no eres 'admin_academy' o no eres dueño).
 *       404:
 *         description: Solicitud no encontrada.
 */
router.patch('/:id/assign', authMiddleware, assignAssessorController);

export default router;