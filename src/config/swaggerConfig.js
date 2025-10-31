import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'EduGestión API',
      version: '1.0.0',
      description: 'API RESTful para la plataforma EduGestión, conectada a Supabase.',
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3000}/api/v1`,
        description: 'Servidor de Desarrollo (v1)',
      },
    ],
   // --- AÑADE ESTO ---
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Introduce tu token JWT (obtenido en /auth/login) con el prefijo "Bearer ". Ej: "Bearer tu_token_largo_aqui"'
        }
      }
    }
  },
  // La clave: le decimos que busque comentarios de OpenAPI en TODAS las rutas de nuestros módulos
  apis: ['./src/modules/**/*.routes.js'], 
};

export const swaggerSpecs = swaggerJsdoc(options);
export const swaggerOptions = {
  customCss: '.swagger-ui .topbar { display: none }', // Opcional: Oculta la barra superior de Swagger
};