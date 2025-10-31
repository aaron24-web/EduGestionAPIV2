import {
  createReviewService,
  getMyReviewsService // <-- CAMBIO AQUÍ
} from './reviews.service.js';

// (El createReviewController se queda exactamente igual)
export const createReviewController = async (req, res) => {
  try {
    // Solo un 'client' puede crear reseñas
    if (req.user.role !== 'client') {
      return res.status(403).json({ error: 'Acceso denegado. Solo los clientes pueden dejar reseñas.' });
    }
    const clientId = req.user.id;
    const { plan_id, rating, comment } = req.body;

    if (!plan_id || !rating) {
      return res.status(400).json({ error: 'plan_id y rating son obligatorios.' });
    }
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'El rating debe estar entre 1 y 5.' });
    }

    const newReview = await createReviewService(clientId, plan_id, rating, comment);
    return res.status(201).json(newReview);
  } catch (error) {
    if (error.message.startsWith('403:')) return res.status(403).json({ error: error.message.substring(5) });
    if (error.message.startsWith('404:')) return res.status(404).json({ error: error.message.substring(5) });
    if (error.message.startsWith('409:')) return res.status(409).json({ error: error.message.substring(5) });
    return res.status(500).json({ error: error.message });
  }
};

// --- CONTROLADOR NUEVO Y CORREGIDO ---
export const getMyReviewsController = async (req, res) => {
  try {
    // Solo asesores o admins (que son asesores de sus propios planes)
    if (req.user.role !== 'assessor' && req.user.role !== 'admin_academy') {
      return res.status(403).json({ error: 'Acceso denegado. Solo para asesores o administradores.' });
    }
    const assessorId = req.user.id;

    const reviews = await getMyReviewsService(assessorId);
    return res.status(200).json(reviews);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};