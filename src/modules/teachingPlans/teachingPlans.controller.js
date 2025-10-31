import {
  createPlanService,
  reviewPlanService,
  getPlanService
} from './teachingPlans.service.js';

// Controlador para CREAR un plan
export const createPlanController = async (req, res) => {
  try {
    if (req.user.role !== 'assessor') {
      return res.status(403).json({ error: 'Acceso denegado. Solo los asesores pueden crear planes.' });
    }
    const assessorId = req.user.id;
    const { request_id, diagnosis, goals, curriculum } = req.body;

    if (!request_id || !diagnosis || !goals) {
      return res.status(400).json({ error: 'request_id, diagnosis, y goals son obligatorios.' });
    }

    const newPlan = await createPlanService(assessorId, request_id, diagnosis, goals, curriculum);
    return res.status(201).json(newPlan);
  } catch (error) {
    if (error.message.includes('No autorizado')) return res.status(403).json({ error: error.message });
    return res.status(500).json({ error: error.message });
  }
};

// Controlador para REVISAR (aprobar/rechazar) un plan
export const reviewPlanController = async (req, res) => {
  try {
    if (req.user.role !== 'client') {
      return res.status(403).json({ error: 'Acceso denegado. Solo los clientes pueden revisar planes.' });
    }
    const clientId = req.user.id;
    const { id: planId } = req.params;
    const { status } = req.body; // 'approved' o 'rejected'

    if (!status) {
      return res.status(400).json({ error: 'El campo "status" (approved/rejected) es obligatorio.' });
    }

    const updatedPlan = await reviewPlanService(clientId, planId, status);
    return res.status(200).json(updatedPlan);
  } catch (error) {
    if (error.message.includes('No autorizado')) return res.status(403).json({ error: error.message });
    if (error.message.includes('Plan no encontrado')) return res.status(404).json({ error: error.message });
    return res.status(500).json({ error: error.message });
  }
};

// Controlador para OBTENER un plan
export const getPlanController = async (req, res) => {
  try {
    const { id: userId, role: userRole } = req.user;
    const { id: planId } = req.params;

    const plan = await getPlanService(userId, userRole, planId);
    return res.status(200).json(plan);
  } catch (error) {
    if (error.message.includes('Acceso denegado')) return res.status(403).json({ error: error.message });
    if (error.message.includes('no encontrado')) return res.status(404).json({ error: error.message });
    return res.status(500).json({ error: error.message });
  }
};