import {
  createAvailabilityService,
  getAvailabilityByAssessorService,
  deleteAvailabilityService
} from './availability.service.js';

// Controlador para CREAR un bloque
export const createAvailabilityController = async (req, res) => {
  try {
    // Solo asesores o admins (que también son asesores) pueden añadir disponibilidad
    if (req.user.role !== 'assessor' && req.user.role !== 'admin_academy') {
      return res.status(403).json({ error: 'Acceso denegado. Solo los asesores pueden gestionar su disponibilidad.' });
    }
    const assessorId = req.user.id;
    const { start_time, end_time } = req.body;

    if (!start_time || !end_time) {
      return res.status(400).json({ error: 'start_time y end_time son obligatorios.' });
    }

    const newBlock = await createAvailabilityService(assessorId, start_time, end_time);
    return res.status(201).json(newBlock);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Controlador para OBTENER los bloques de un asesor
export const getAvailabilityByAssessorController = async (req, res) => {
  try {
    const { assessorId } = req.params; // ID del asesor desde la URL
    const blocks = await getAvailabilityByAssessorService(assessorId);
    return res.status(200).json(blocks);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Controlador para ELIMINAR un bloque
export const deleteAvailabilityController = async (req, res) => {
  try {
    if (req.user.role !== 'assessor' && req.user.role !== 'admin_academy') {
      return res.status(403).json({ error: 'Acceso denegado.' });
    }
    const assessorId = req.user.id;
    const { id: availabilityId } = req.params; // ID del bloque desde la URL

    await deleteAvailabilityService(availabilityId, assessorId);
    return res.status(204).send(); // 204 No Content
  } catch (error) {
    if (error.message.includes('Bloque de disponibilidad no encontrado')) {
      return res.status(404).json({ error: error.message });
    }
    return res.status(500).json({ error: error.message });
  }
};