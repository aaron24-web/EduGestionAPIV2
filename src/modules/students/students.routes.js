// src/modules/students/students.routes.js
import express from 'express';
import {
  getAllStudentsController,
  createStudentController,
  updateStudentController,
  deleteStudentController,
} from './students.controller.js';
import { authMiddleware } from '../../core/middleware/authMiddleware.js';

const router = express.Router();

/**
 * @openapi
 * /students:
 *   get:
 *     summary: Obtiene la lista de estudiantes del cliente logueado
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Una lista de perfiles de estudiantes.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     format: uuid
 *                   client_id:
 *                     type: string
 *                     format: uuid
 *                   name:
 *                     type: string
 *                   education_level:
 *                     type: string
 *       401:
 *         description: No autorizado
 *   post:
 *     summary: Crea un nuevo perfil de estudiante para el cliente logueado
 *     tags: [Students]
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
 *                 example: 'Pepito Pérez'
 *               education_level:
 *                 type: string
 *                 example: 'Secundaria'
 *               details:
 *                 type: string
 *                 example: 'Necesita ayuda con álgebra'
 *             required:
 *               - name
 *     responses:
 *       201:
 *         description: El estudiante fue creado exitosamente.
 *       400:
 *         description: Datos inválidos (ej. falta el nombre).
 *       401:
 *         description: No autorizado.
 */
router.route('/')
  .get(authMiddleware, getAllStudentsController)
  .post(authMiddleware, createStudentController);

/**
 * @openapi
 * /students/{id}:
 *   patch:
 *     summary: Actualiza un estudiante existente por su ID
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: El ID del estudiante a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: 'José Pérez (Actualizado)'
 *               education_level:
 *                 type: string
 *                 example: 'Preparatoria'
 *     responses:
 *       200:
 *         description: El estudiante fue actualizado exitosamente.
 *       401:
 *         description: No autorizado.
 *       404:
 *         description: Estudiante no encontrado o no pertenece al usuario.
 *   delete:
 *     summary: Elimina un estudiante por su ID
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: El ID del estudiante a eliminar
 *     responses:
 *       204:
 *         description: El estudiante fue eliminado exitosamente (Sin contenido).
 *       401:
 *         description: No autorizado.
 *       404:
 *         description: Estudiante no encontrado o no pertenece al usuario.
 */
router.route('/:id')
  .patch(authMiddleware, updateStudentController)
  .delete(authMiddleware, deleteStudentController);

export default router;