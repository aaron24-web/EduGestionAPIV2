import {
  createRequestService,
  assignAssessorService,
  getRequestsService
} from './requests.service.js';

// Controlador para CREAR una solicitud
export const createRequestController = async (req, res) => {
  try {
    // Solo un 'client' puede crear solicitudes
    if (req.user.role !== 'client') {
      return res.status(403).json({ error: 'Acceso denegado. Solo los clientes pueden crear solicitudes.' });
    }
    const clientId = req.user.id;
    const { student_id, academy_id, problem_description, subjects_of_interest } = req.body;

    if (!student_id || !academy_id || !problem_description) {
      return res.status(400).json({ error: 'student_id, academy_id y problem_description son obligatorios.' });
    }

    const newRequest = await createRequestService(clientId, student_id, academy_id, problem_description, subjects_of_interest);
    return res.status(201).json(newRequest);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Controlador para ASIGNAR un asesor
export const assignAssessorController = async (req, res) => {
  try {
    // Solo un 'admin_academy' puede asignar
    if (req.user.role !== 'admin_academy') {
      return res.status(403).json({ error: 'Acceso denegado. Solo los administradores pueden asignar solicitudes.' });
    }
    const adminId = req.user.id;
    const { id: requestId } = req.params; // ID de la solicitud desde la URL
    const { assessor_id } = req.body; // ID del asesor a asignar

    if (!assessor_id) {
      return res.status(400).json({ error: 'El campo "assessor_id" es obligatorio.' });
    }

    const updatedRequest = await assignAssessorService(requestId, adminId, assessor_id);
    return res.status(200).json(updatedRequest);
  } catch (error) {
    if (error.message.includes('No autorizado')) return res.status(403).json({ error: error.message });
    if (error.message.includes('no encontrada')) return res.status(404).json({ error: error.message });
    return res.status(500).json({ error: error.message });
  }
};

// Controlador para OBTENER solicitudes
export const getRequestsController = async (req, res) => {
  try {
    const { id: userId, role: userRole } = req.user;
    const requests = await getRequestsService(userId, userRole);
    return res.status(200).json(requests);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};