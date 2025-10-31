import {
  getStudentsByClientIdService,
  createStudentService,
  updateStudentService,
  deleteStudentService,
} from './students.service.js';

// Controlador para OBTENER todos los estudiantes
export const getAllStudentsController = async (req, res) => {
  try {
    const clientId = req.user.id; // Obtenido del token JWT (authMiddleware)
    const students = await getStudentsByClientIdService(clientId);
    return res.status(200).json(students);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Controlador para CREAR un estudiante
export const createStudentController = async (req, res) => {
  try {
    const clientId = req.user.id;
    const { name, education_level, details } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'El campo "name" es obligatorio.' });
    }

    const newStudent = await createStudentService(clientId, name, education_level, details);
    return res.status(201).json(newStudent);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Controlador para ACTUALIZAR un estudiante
export const updateStudentController = async (req, res) => {
  try {
    const clientId = req.user.id;
    const { id: studentId } = req.params; // ID del estudiante desde la URL
    const updates = req.body; // { name, education_level, details }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: 'No se proporcionaron datos para actualizar.' });
    }

    const updatedStudent = await updateStudentService(studentId, clientId, updates);
    return res.status(200).json(updatedStudent);
  } catch (error) {
    if (error.message.includes('Estudiante no encontrado')) {
      return res.status(404).json({ error: error.message });
    }
    return res.status(500).json({ error: error.message });
  }
};

// Controlador para ELIMINAR un estudiante
export const deleteStudentController = async (req, res) => {
  try {
    const clientId = req.user.id;
    const { id: studentId } = req.params; // ID del estudiante desde la URL

    await deleteStudentService(studentId, clientId);
    return res.status(204).send(); // 204 No Content (éxito, sin cuerpo de respuesta)
  } catch (error) {
    if (error.message.includes('Estudiante no encontrado')) {
      return res.status(404).json({ error: error.message });
    }
    return res.status(500).json({ error: error.message });
  }
};