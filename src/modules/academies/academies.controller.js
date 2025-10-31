import {
  getAcademyLandingService,
  getMyAcademyService,
  updateMyAcademyService,
  addAcademyMemberService
} from './academies.service.js';

// Controlador para OBTENER datos públicos (Landing Page)
export const getAcademyLandingController = async (req, res) => {
  try {
    const { id } = req.params;
    const landingData = await getAcademyLandingService(id);
    return res.status(200).json(landingData);
  } catch (error) {
    return res.status(404).json({ error: error.message });
  }
};

// Controlador para OBTENER la academia del admin
export const getMyAcademyController = async (req, res) => {
  try {
    // Verificación de Rol
    if (req.user.role !== 'admin_academy') {
      return res.status(403).json({ error: 'Acceso denegado. Solo para administradores de academia.' });
    }
    const adminId = req.user.id;
    const academyData = await getMyAcademyService(adminId);
    return res.status(200).json(academyData);
  } catch (error) {
    return res.status(404).json({ error: error.message });
  }
};

// Controlador para ACTUALIZAR la academia del admin
export const updateMyAcademyController = async (req, res) => {
  try {
    if (req.user.role !== 'admin_academy') {
      return res.status(403).json({ error: 'Acceso denegado.' });
    }
    const adminId = req.user.id;
    const updates = req.body; // Ej: { name: "Nueva Academia", landing_page_config: {...} }

    const updatedAcademy = await updateMyAcademyService(adminId, updates);
    return res.status(200).json(updatedAcademy);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

// Controlador para AÑADIR un miembro
export const addAcademyMemberController = async (req, res) => {
  try {
    if (req.user.role !== 'admin_academy') {
      return res.status(403).json({ error: 'Acceso denegado.' });
    }
    const adminId = req.user.id;
    const { email, role } = req.body; // Ej: "asesor-email@example.com", "assessor"

    if (!email || !role) {
      return res.status(400).json({ error: 'Email y role son obligatorios.' });
    }

    const newMember = await addAcademyMemberService(adminId, email, role);
    return res.status(201).json(newMember);
  } catch (error) {
    if (error.message.includes('no encontrado')) return res.status(404).json({ error: error.message });
    if (error.message.includes('ya es miembro')) return res.status(409).json({ error: error.message }); // 409 Conflict
    return res.status(500).json({ error: error.message });
  }
};