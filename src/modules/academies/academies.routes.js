// src/modules/academies/academies.routes.js
import express from 'express';
import {
  getAcademyLandingController,
  getMyAcademyController,
  updateMyAcademyController,
  addAcademyMemberController
} from './academies.controller.js';
import { authMiddleware } from '../../core/middleware/authMiddleware.js';

const router = express.Router();

/**
 * @openapi
 * /academies/my-academy:
 *   get:
 *     summary: Obtiene los detalles de la academia del admin logueado
 *     tags: [Academies]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Detalles de la academia, incluyendo lista de miembros.
 *       403:
 *         description: Acceso denegado (no es admin_academy).
 *       404:
 *         description: Academia no encontrada.
 *   patch:
 *     summary: Actualiza los detalles de la academia del admin logueado
 *     tags: [Academies]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: 'Mi Academia (Actualizada)'
 *               landing_page_config:
 *                 type: object
 *                 example: { "description": "La mejor academia." }
 *     responses:
 *       200:
 *         description: Academia actualizada exitosamente.
 *       400:
 *         description: Error en la actualización.
 *       403:
 *         description: Acceso denegado.
 */
router.route('/my-academy')
  .get(authMiddleware, getMyAcademyController)
  .patch(authMiddleware, updateMyAcademyController);

/**
 * @openapi
 * /academies/my-academy/members:
 *   post:
 *     summary: Añade un nuevo miembro (asesor/admin) a la academia
 *     tags: [Academies]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: 'asesor.nuevo @example.com'
 *               role:
 *                 type: string
 *                 enum: [admin, assessor]
 *                 example: 'assessor'
 *     responses:
 *       201:
 *         description: Miembro añadido exitosamente.
 *       403:
 *         description: Acceso denegado.
 *       404:
 *         description: Usuario a añadir no encontrado.
 *       409:
 *         description: El usuario ya es miembro.
 */
router.post('/my-academy/members', authMiddleware, addAcademyMemberController);


/**
 * @openapi
 * /academies/{id}/landing:
 *   get:
 *     summary: Obtiene los datos públicos (landing page) de una academia
 *     tags: [Academies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: El ID de la academia
 *     responses:
 *       200:
 *         description: Datos de la landing page (nombre y config).
 *       404:
 *         description: Academia no encontrada.
 */
// Esta ruta es PÚBLICA y no usa authMiddleware. Debe ir al final.
router.get('/:id/landing', getAcademyLandingController);


export default router;