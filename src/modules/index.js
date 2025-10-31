// src/modules/index.js

import express from 'express';
import authRoutes from './auth/auth.routes.js';
import userRoutes from './users/users.routes.js';
import studentRoutes from './students/students.routes.js';
import academyRoutes from './academies/academies.routes.js';
import requestRoutes from './requests/requests.routes.js';
import teachingPlanRoutes from './teachingPlans/teachingPlans.routes.js';
import availabilityRoutes from './availability/availability.routes.js';
import sessionRoutes from './sessions/sessions.routes.js';
import messageRoutes from './messages/messages.routes.js';
import progressReportRoutes from './progress-reports/progress-reports.routes.js';
import reviewRoutes from './reviews/reviews.routes.js';


const router = express.Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/students', studentRoutes);
router.use('/academies', academyRoutes);
router.use('/requests', requestRoutes);
router.use('/teaching-plans', teachingPlanRoutes);
router.use('/availability', availabilityRoutes);
router.use('/sessions', sessionRoutes);
router.use('/messages', messageRoutes);
router.use('/progress-reports', progressReportRoutes);
router.use('/reviews', reviewRoutes);

// Exportamos el enrutador principal
export default router;