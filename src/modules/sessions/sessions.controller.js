import {
  createSessionService,
  getSessionsByPlanService,
  updateSessionStatusService
} from './sessions.service.js';

// Controlador para CREAR una sesión
export const createSessionController = async (req, res) => {
  try {
    const { id: userId, role: userRole } = req.user;
    const { plan_id, student_id, assessor_id, scheduled_start, scheduled_end } = req.body;

    if (!plan_id || !student_id || !assessor_id || !scheduled_start || !scheduled_end) {
      return res.status(400).json({ error: 'plan_id, student_id, assessor_id, scheduled_start y scheduled_end son obligatorios.' });
    }

    const newSession = await createSessionService(userId, userRole, plan_id, student_id, assessor_id, scheduled_start, scheduled_end);
    return res.status(201).json(newSession);
  } catch (error) {
    if (error.message.startsWith('403:')) return res.status(403).json({ error: error.message.substring(5) });
    if (error.message.startsWith('404:')) return res.status(404).json({ error: error.message.substring(5) });
    return res.status(500).json({ error: error.message });
  }
};

// Controlador para OBTENER las sesiones de un plan
export const getSessionsByPlanController = async (req, res) => {
  try {
    const { id: userId, role: userRole } = req.user;
    const { planId } = req.params; // ID del plan desde la URL

    const sessions = await getSessionsByPlanService(userId, userRole, planId);
    return res.status(200).json(sessions);
  } catch (error) {
    if (error.message.startsWith('403:')) return res.status(403).json({ error: error.message.substring(5) });
    if (error.message.startsWith('404:')) return res.status(404).json({ error: error.message.substring(5) });
    return res.status(500).json({ error: error.message });
  }
};

// Controlador para ACTUALIZAR el estado de una sesión
export const updateSessionStatusController = async (req, res) => {
  try {
    // Solo asesores o admins pueden marcar sesiones
    if (req.user.role !== 'assessor' && req.user.role !== 'admin_academy') {
      return res.status(403).json({ error: 'Acceso denegado. Solo los asesores pueden actualizar sesiones.' });
    }
    const assessorId = req.user.id;
    const { id: sessionId } = req.params;
    const { status } = req.body; // ej: 'completed', 'cancelled'

    if (!status) {
      return res.status(400).json({ error: 'El campo "status" es obligatorio.' });
    }

    const updatedSession = await updateSessionStatusService(assessorId, sessionId, status);
    return res.status(200).json(updatedSession);
  } catch (error) {
    if (error.message.startsWith('404:')) return res.status(404).json({ error: error.message.substring(5) });
    return res.status(500).json({ error: error.message });
  }
};