// src/modules/index.js

import express from 'express';
import authRoutes from './auth/auth.routes.js';
import userRoutes from './users/users.routes.js';
// (Aquí importaremos los otros módulos a medida que los construyamos)
// import studentRoutes from './students/students.routes.js';
// import requestRoutes from './requests/requests.routes.js';

const router = express.Router();

// --- Montaje de Rutas ---
// Le decimos a Express que todas las rutas en authRoutes 
// deben empezar con el prefijo /auth
router.use('/auth', authRoutes);

// Todas las rutas en userRoutes deben empezar con /users
router.use('/users', userRoutes);

// (Y así sucesivamente para los demás módulos...)
// router.use('/students', studentRoutes);
// router.use('/requests', requestRoutes);

// Exportamos el enrutador principal
export default router;