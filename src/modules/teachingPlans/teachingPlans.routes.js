// src/modules/teachingPlans/teachingPlans.routes.js
import express from 'express';
import {
  createPlanController,
  reviewPlanController,
  getPlanController,
  payPlanController
} from './teachingPlans.controller.js';
import { authMiddleware } from '../../core/middleware/authMiddleware.js';

const router = express.Router();

/**
 * @openapi
 * /teaching-plans:
 *   post:
 *     summary: (Asesor) Crea un nuevo plan de enseñanza
 *     tags: [TeachingPlans]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               request_id:
 *                 type: string
 *                 format: uuid
 *                 description: El ID de la solicitud (request) a la que este plan responde.
 *               diagnosis:
 *                 type: string
 *                 example: 'El estudiante necesita reforzar bases de álgebra.'
 *               goals:
 *                 type: string
 *                 example: 'Dominar ecuaciones de primer y segundo grado.'
 *               curriculum:
 *                 type: object
 *                 example: { "modulos": [{ "tema": "Ecuaciones", "horas": 4 }] }
 *     responses:
 *       201:
 *         description: Plan creado y enviado a revisión.
 *       400:
 *         description: Faltan campos obligatorios.
 *       403:
 *         description: Acceso denegado (no eres el asesor asignado).
 */
router.post('/', authMiddleware, createPlanController);

/**
 * @openapi
 * /teaching-plans/{id}:
 *   get:
 *     summary: (Cliente/Asesor) Obtiene los detalles de un plan
 *     tags: [TeachingPlans]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: El ID del plan de enseñanza.
 *     responses:
 *       200:
 *         description: Detalles del plan.
 *       403:
 *         description: Acceso denegado (no eres parte de este plan).
 *       404:
 *         description: Plan no encontrado.
 */
router.get('/:id', authMiddleware, getPlanController);

/**
 * @openapi
 * /teaching-plans/{id}/review:
 *   patch:
 *     summary: (Cliente) Aprueba o rechaza un plan de enseñanza
 *     tags: [TeachingPlans]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: El ID del plan a revisar.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [approved, rejected]
 *                 example: 'approved'
 *     responses:
 *       200:
 *         description: Plan actualizado (aprobado o rechazado).
 *       400:
 *         description: El 'status' es inválido.
 *       403:
 *         description: Acceso denegado (no eres el cliente de esta solicitud).
 *       404:
 *         description: Plan no encontrado.
 */
router.patch('/:id/review', authMiddleware, reviewPlanController);

/**
 * @openapi
 * /teaching-plans/{id}/pay:
 *   patch:
 *     summary: (Cliente) Simula un pago exitoso para un plan aprobado
 *     tags: [TeachingPlans]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: El ID del plan a pagar.
 *     responses:
 *       200:
 *         description: Pago registrado. El plan ahora tiene payment_status 'paid'.
 *       403:
 *         description: Acceso denegado (no eres el cliente).
 *       404:
 *         description: Plan no encontrado.
 *       409:
 *         description: El plan ya estaba pagado.
 */
router.patch('/:id/pay', authMiddleware, payPlanController);

export default router;