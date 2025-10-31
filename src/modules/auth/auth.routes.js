import express from 'express';
import { signUpController, loginController } from './auth.controller.js';

const router = express.Router();

/**
 * @openapi
 * /auth/signup:
 *   post:
 *     summary: Registra un nuevo usuario
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: 'cliente.falso@example.com'
 *               password:
 *                 type: string
 *                 example: 'password123'
 *               full_name:
 *                 type: string
 *                 example: 'Cliente Falso'
 *               role:
 *                 type: string
 *                 enum: [client, assessor, admin_academy]
 *                 example: 'client'
 *     responses:
 *       201:
 *         description: Usuario creado con éxito
 *       400:
 *         description: Error en la solicitud (ej. campos faltantes o usuario ya existe)
 */
router.post('/signup', signUpController);

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Inicia sesión de un usuario
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: 'cliente.falso@example.com'
 *               password:
 *                 type: string
 *                 example: 'password123'
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso, devuelve la sesión (incluye JWT)
 *       401:
 *         description: Credenciales inválidas
 */
router.post('/login', loginController);

export default router;