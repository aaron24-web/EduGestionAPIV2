// src/modules/availability/availability.routes.js
import express from 'express';
import {
  createAvailabilityController,
  getAvailabilityByAssessorController,
  deleteAvailabilityController
} from './availability.controller.js';
import { authMiddleware } from '../../core/middleware/authMiddleware.js';

const router = express.Router();

/**
 * @openapi
 * /availability:
 *   post:
 *     summary: (Asesor) Crea un nuevo bloque de disponibilidad
 *     tags: [Availability]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               start_time:
 *                 type: string
 *                 format: date-time
 *                 example: '2025-12-01T10:00:00Z'
 *               end_time:
 *                 type: string
 *                 format: date-time
 *                 example: '2025-12-01T12:00:00Z'
 *     responses:
 *       201:
 *         description: Bloque de disponibilidad creado.
 *       403:
 *         description: Acceso denegado (no eres asesor).
 */
router.post('/', authMiddleware, createAvailabilityController);

/**
 * @openapi
 * /availability/assessor/{assessorId}:
 *   get:
 *     summary: (Cliente/Público) Obtiene los bloques de un asesor
 *     tags: [Availability]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: assessorId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: El ID del asesor a consultar.
 *     responses:
 *       200:
 *         description: Una lista de bloques de disponibilidad.
 */
router.get('/assessor/:assessorId', authMiddleware, getAvailabilityByAssessorController);

/**
 * @openapi
 * /availability/{id}:
 *   delete:
 *     summary: (Asesor) Elimina un bloque de disponibilidad
 *     tags: [Availability]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           description: El ID del bloque de disponibilidad a eliminar.
 *     responses:
 *       204:
 *         description: Bloque eliminado exitosamente.
 *       403:
 *         description: Acceso denegado (no eres asesor).
 *       404:
 *         description: Bloque no encontrado o no te pertenece.
 */
router.delete('/:id', authMiddleware, deleteAvailabilityController);

export default router;