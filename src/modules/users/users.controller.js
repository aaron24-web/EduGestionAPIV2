// src/modules/users/users.controller.js
import { getUserMeService, updateUserMeService } from './users.service.js';

export const getUserMeController = async (req, res) => {
  try {
    // req.user ahora viene de NUESTRO token JWT
    const userId = req.user.id; 
    const profile = await getUserMeService(userId);
    return res.status(200).json(profile);
  } catch (error) {
    return res.status(404).json({ error: 'Perfil no encontrado.' });
  }
};

export const updateUserMeController = async (req, res) => {
  try {
    const userId = req.user.id;
    const { full_name, avatar_url } = req.body;

    const updatedProfile = await updateUserMeService(userId, full_name, avatar_url);
    return res.status(200).json(updatedProfile);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};