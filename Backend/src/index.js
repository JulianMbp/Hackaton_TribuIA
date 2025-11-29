const express = require('express');
const cors = require('cors');
require('dotenv').config();
require('./db'); // Inicializa la conexión con Supabase (Pool de PG)

// Routers de recursos de negocio
const authRouter = require('./routes/auth.routes');
const empresasRouter = require('./routes/empresas.routes');
const candidatosRouter = require('./routes/candidatos.routes');
const cargosRouter = require('./routes/cargos.routes');
const cvsRouter = require('./routes/cvs.routes');
const entrevistasRouter = require('./routes/entrevistas.routes');
const preguntasRouter = require('./routes/preguntas.routes');
const respuestasRouter = require('./routes/respuestas.routes');
const puntajesRouter = require('./routes/puntajes.routes');
const historialRouter = require('./routes/historial.routes');
const notificacionesRouter = require('./routes/notificaciones.routes');
const postulacionesRouter = require('./routes/postulaciones.routes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Healthcheck / raíz
app.get('/', (req, res) => {
  res.json({
    message: 'API de orquestación de reclutamiento sobre Supabase',
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

// Namespace de API
app.use('/api/auth', authRouter);
app.use('/api/empresas', empresasRouter);
app.use('/api/candidatos', candidatosRouter);
app.use('/api/cargos', cargosRouter);
app.use('/api/cvs', cvsRouter);
app.use('/api/entrevistas', entrevistasRouter);
app.use('/api/preguntas', preguntasRouter);
app.use('/api/respuestas', respuestasRouter);
app.use('/api/puntajes', puntajesRouter);
app.use('/api/historial', historialRouter);
app.use('/api/notificaciones', notificacionesRouter);
app.use('/api/postulaciones', postulacionesRouter);

// Manejo de errores 404
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Ruta no encontrada',
    path: req.originalUrl,
  });
});

// Manejo de errores generales
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error('❌ Error capturado:', err.message);
  if (process.env.NODE_ENV === 'development') {
    console.error('Stack trace:', err.stack);
  }

  // Clasificar errores y dar respuestas apropiadas
  let statusCode = 500;
  let errorMessage = 'Error interno del servidor';

  // Errores de base de datos
  if (err.code === 'ECONNREFUSED' || err.code === 'ENOTFOUND') {
    statusCode = 503;
    errorMessage = 'Servicio de base de datos no disponible';
  } else if (err.code === 'ETIMEDOUT') {
    statusCode = 504;
    errorMessage = 'Timeout al conectar con la base de datos';
  } else if (err.code === '42P01') {
    statusCode = 500;
    errorMessage = 'Error de configuración: tabla no existe en la base de datos';
  } else if (err.code === '42703') {
    statusCode = 500;
    errorMessage = 'Error de configuración: columna no existe en la base de datos';
  } else if (err.code === '23505') {
    // Violación de constraint único (duplicado)
    statusCode = 409;
    errorMessage = 'El recurso ya existe (duplicado)';
  } else if (err.code === '23503') {
    // Violación de foreign key
    statusCode = 400;
    errorMessage = 'Referencia inválida en los datos enviados';
  } else if (err.message && err.message.includes('column')) {
    statusCode = 500;
    errorMessage = 'Error de configuración de base de datos';
  }

  res.status(statusCode).json({
    error: errorMessage,
    details: process.env.NODE_ENV === 'development' ? err.message : undefined,
    code: process.env.NODE_ENV === 'development' ? err.code : undefined,
  });
});

// Iniciar servidor
// Escuchar en 0.0.0.0 para aceptar conexiones desde fuera del contenedor Docker
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📚 API base disponible en http://localhost:${PORT}/api`);
});
