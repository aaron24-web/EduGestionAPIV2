import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpecs, swaggerOptions } from './config/swaggerConfig.js'; // Lo crearemos en el sig. paso
import mainRouter from './modules/index.js'; // El enrutador que unirá todos los módulos
// import { errorHandler } from './core/middleware/errorHandler.js'; // (Lo añadiremos después)

const app = express();

// Middlewares principales
app.use(cors()); // Habilita CORS para todas las rutas
app.use(express.json()); // Parsea bodies de requests como JSON

// --- Documentación Swagger ---
// Servimos la UI de Swagger en /api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs, swaggerOptions));

// --- Rutas de la API ---
// Todas nuestras rutas de módulos vivirán bajo /api/v1
app.use('/api/v1', mainRouter);

// Ruta de "salud" básica
app.get('/', (req, res) => {
  res.send('API de EduGestión v1 funcionando. Visita /api-docs para la documentación.');
});

// --- Manejo de Errores ---
// (Descomentaremos esto cuando creemos el errorHandler)
// app.use(errorHandler);

export default app;