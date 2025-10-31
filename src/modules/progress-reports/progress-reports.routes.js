// src/modules/progress-reports/progress-reports.routes.js
import express from 'express';
import {
  createReportController,
  getReportsByPlanController
} from './progress-reports.controller.js';
import { authMiddleware } from '../../core/middleware/authMiddleware.js';

const router = express.Router();

/**
 * @openapi
 * /progress-reports:
 *   post:
 *     summary: (Asesor) Crea un nuevo reporte de progreso
 *     tags: [ProgressReports]
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
 *                 description: El ID del plan general al que se asocia.
 *               session_id:
 *                 type: string
 *                 format: uuid
 *                 description: (Opcional) El ID de la sesión específica.
 *               report_content:
 *                 type: string
 *                 example: 'Hoy trabajamos en derivadas. El estudiante mostró gran avance.'
 *     responses:
 *       201:
 *         description: Reporte creado.
 *       403:
 *         description: No eres el asesor de este plan.
 *       400:
 *         description: Faltan campos obligatorios.
 */
router.post('/', authMiddleware, createReportController);

/**
 * @openapi
 * /progress-reports/plan/{planId}:
 *   get:
 *     summary: (Cliente/Asesor) Obtiene todos los reportes de un plan
 *     tags: [ProgressReports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: planId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *           description: El ID del plan de enseñanza.
 *     responses:
 *       200:
 *         description: Una lista de reportes de progreso.
 *       403:
 *         description: No autorizado para ver este plan.
 *       404:
 *         description: Plan no encontrado.
 */
router.get('/plan/:planId', authMiddleware, getReportsByPlanController);

export default router;