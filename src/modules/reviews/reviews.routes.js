// src/modules/reviews/reviews.routes.js
import express from 'express';
import {
  createReviewController,
  getReviewsByAcademyController
} from './reviews.controller.js';
import { authMiddleware } from '../../core/middleware/authMiddleware.js';

const router = express.Router();

/**
 * @openapi
 * /reviews:
 *   post:
 *     summary: (Cliente) Crea una nueva reseña para un plan
 *     tags: [Reviews]
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
 *                 description: El ID del plan que se está reseñando.
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 5
 *               comment:
 *                 type: string
 *                 example: '¡Excelente servicio! El asesor fue muy profesional.'
 *     responses:
 *       201:
 *         description: Reseña creada.
 *       403:
 *         description: No eres el cliente de este plan o no has completado una sesión.
 *       404:
 *         description: Plan no encontrado.
 *       409:
 *         description: Ya has dejado una reseña para este plan.
 */
router.post('/', authMiddleware, createReviewController);

/**
 * @openapi
 * /reviews/academy/{academyId}:
 *   get:
 *     summary: (Público) Obtiene todas las reseñas de una academia
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: academyId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *           description: El ID de la academia.
 *     responses:
 *       200:
 *         description: Una lista de reseñas (incluye datos del cliente).
 */
router.get('/academy/:academyId', getReviewsByAcademyController);

export default router;