require('dotenv').config();

// Validar que JWT_SECRET esté definido
if (!process.env.JWT_SECRET) {
  console.error('❌ ERROR: JWT_SECRET no está definido en las variables de entorno');
  console.error('💡 Por favor, agrega JWT_SECRET a tu archivo .env');
  console.error('⚠️  El servidor puede no funcionar correctamente sin esta variable');
  // No hacer exit para permitir que el servidor inicie, pero mostrar advertencia
}

const JWT_CONFIG = {
  secret: process.env.JWT_SECRET || 'default_secret_cambiar_en_produccion_' + Date.now(),
  expiresIn: process.env.JWT_EXPIRES_IN || '7d',
};

module.exports = JWT_CONFIG;
