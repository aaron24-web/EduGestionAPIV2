import {
  createReportService,
  getReportsByPlanService
} from './progress-reports.service.js';

// Controlador para CREAR un reporte
export const createReportController = async (req, res) => {
  try {
    // Solo asesores o admins (que son asesores) pueden crear reportes
    if (req.user.role !== 'assessor' && req.user.role !== 'admin_academy') {
      return res.status(403).json({ error: 'Acceso denegado. Solo los asesores pueden crear reportes.' });
    }
    const assessorId = req.user.id;
    const { plan_id, session_id, report_content } = req.body;

    if (!plan_id || !report_content) {
      return res.status(400).json({ error: 'plan_id y report_content son obligatorios.' });
    }

    const newReport = await createReportService(assessorId, plan_id, session_id, report_content);
    return res.status(201).json(newReport);
  } catch (error) {
    if (error.message.startsWith('403:')) return res.status(403).json({ error: error.message.substring(5) });
    return res.status(500).json({ error: error.message });
  }
};

// Controlador para OBTENER los reportes de un plan
export const getReportsByPlanController = async (req, res) => {
  try {
    const { id: userId, role: userRole } = req.user;
    const { planId } = req.params; // ID del plan desde la URL

    const reports = await getReportsByPlanService(userId, userRole, planId);
    return res.status(200).json(reports);
  } catch (error) {
    if (error.message.startsWith('403:')) return res.status(403).json({ error: error.message.substring(5) });
    if (error.message.startsWith('404:')) return res.status(404).json({ error: error.message.substring(5) });
    return res.status(500).json({ error: error.message });
  }
};