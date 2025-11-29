const { Pool } = require('pg');
require('dotenv').config();

// Configuración del pool de conexiones a PostgreSQL (Supabase)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Opciones adicionales para producción
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 20, // máximo de conexiones en el pool
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000, // Aumentado a 5 segundos
  // Configuración para mejor manejo de reconexiones
  allowExitOnIdle: false,
});

// Manejo robusto de errores del pool (sin hacer caer el servidor)
pool.on('error', (err, client) => {
  console.error('⚠️ Error en el pool de PostgreSQL:', err.message);
  // NO hacemos process.exit() para mantener el servidor corriendo
  // El pool se encargará de reconectar automáticamente
  if (err.code === 'ENOTFOUND' || err.code === 'ECONNREFUSED') {
    console.error('💡 Error de conexión: Verifica que la base de datos esté disponible y DATABASE_URL sea correcta');
  } else if (err.code === 'ETIMEDOUT') {
    console.error('💡 Timeout de conexión: La base de datos no respondió a tiempo');
  }
});

// Función para probar la conexión con reintentos
let connectionAttempts = 0;
const MAX_ATTEMPTS = 3;

const testConnection = async () => {
  try {
    const result = await pool.query('SELECT NOW()');
    console.log('✅ Conexión a PostgreSQL exitosa:', result.rows[0].now);
    connectionAttempts = 0; // Reset contador en caso de éxito
  } catch (err) {
    connectionAttempts++;
    console.error(`❌ Error al conectar con la base de datos (intento ${connectionAttempts}/${MAX_ATTEMPTS}):`, err.message);
    
    if (connectionAttempts < MAX_ATTEMPTS) {
      console.log(`🔄 Reintentando conexión en 3 segundos...`);
      setTimeout(testConnection, 3000);
    } else {
      console.error('💡 Asegúrate de tener configurada la variable DATABASE_URL en tu archivo .env');
      console.error('⚠️ El servidor continuará ejecutándose, pero las consultas a la BD pueden fallar');
    }
  }
};

// Función auxiliar para ejecutar queries con manejo robusto de errores
const query = async (text, params) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    if (process.env.NODE_ENV === 'development') {
      console.log('📊 Query ejecutada', { text, duration, rows: res.rowCount });
    }
    return res;
  } catch (error) {
    const duration = Date.now() - start;
    console.error('❌ Error en query', { text, duration, error: error.message });
    
    // Clasificación de errores
    if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
      throw new Error('Error de conexión a la base de datos. Verifica que el servidor esté disponible.');
    } else if (error.code === 'ETIMEDOUT') {
      throw new Error('Timeout al conectar con la base de datos.');
    } else if (error.code === '42P01') {
      throw new Error(`Tabla no existe: ${error.message}`);
    } else if (error.code === '42703') {
      throw new Error(`Columna no existe: ${error.message}`);
    } else {
      throw error;
    }
  }
};

// Probar la conexión al iniciar
testConnection();

module.exports = { pool, query };

