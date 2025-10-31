// src/modules/auth/auth.controller.js
import { signUpService, loginService } from './auth.service.js';

export const signUpController = async (req, res) => {
  try {
    const { email, password, full_name, role } = req.body;
    
    // (Tu validación mejorada de la respuesta anterior sigue siendo válida aquí)
    if (!email || !password || !full_name || !role) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
    }
    const validRoles = ['client', 'assessor', 'admin_academy'];
    if (!validRoles.includes(role)) {
       return res.status(400).json({ error: 'Rol no válido.' });
    }

    const newUser = await signUpService(email, password, full_name, role);
    return res.status(201).json(newUser);

  } catch (error) {
    if (error.message.includes('email ya existe')) {
      return res.status(409).json({ error: error.message }); // 409 Conflict
    }
    return res.status(500).json({ error: error.message });
  }
};

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email y password son obligatorios.' });
    }

    const data = await loginService(email, password);
    return res.status(200).json(data);

  } catch (error) {
    if (error.message.includes('Credenciales inválidas')) {
      return res.status(401).json({ error: error.message }); // 401 Unauthorized
    }
    return res.status(500).json({ error: error.message });
  }
};