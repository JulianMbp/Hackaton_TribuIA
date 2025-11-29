const express = require('express');
const cors = require('cors');
require('dotenv').config();
require('./db'); // Inicializa la conexión con Supabase (Pool de PG)

// Routers de recursos de negocio
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
  console.error(err.stack);
  res.status(500).json({
    error: 'Error interno del servidor',
    details: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📚 API base disponible en http://localhost:${PORT}/api`);
});
