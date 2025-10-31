// src/modules/index.js

import express from 'express';
import authRoutes from './auth/auth.routes.js';
import userRoutes from './users/users.routes.js';
import studentRoutes from './students/students.routes.js';
import academyRoutes from './academies/academies.routes.js';
import requestRoutes from './requests/requests.routes.js';
// (Aquí importaremos los otros módulos a medida que los construyamos)
// import studentRoutes from './students/students.routes.js';
// import requestRoutes from './requests/requests.routes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/students', studentRoutes);
router.use('/academies', academyRoutes);
router.use('/requests', requestRoutes);

// Exportamos el enrutador principal
export default router;