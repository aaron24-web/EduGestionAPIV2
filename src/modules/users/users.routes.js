// src/modules/users/users.routes.js
import express from 'express';
import { getUserMeController, updateUserMeController } from './users.controller.js';
import { authMiddleware } from '../../core/middleware/authMiddleware.js'; // Nuestro middleware

const router = express.Router();

/**
 * @openapi
 * /users/me:
 *   get:
 *     summary: Obtiene el perfil del usuario logueado
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Devuelve el objeto del usuario
 *       401:
 *         description: No autorizado
 *   patch:
 *     summary: Actualiza el perfil del usuario logueado
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               full_name:
 *                 type: string
 *               avatar_url:
 *                 type: string
 *     responses:
 *       200:
 *         description: Devuelve el usuario actualizado
 *       401:
 *         description: No autorizado
 */
router.route('/me')
  .get(authMiddleware, getUserMeController)
  .patch(authMiddleware, updateUserMeController);

export default router;