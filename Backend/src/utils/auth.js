const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const JWT_CONFIG = require('../config/jwt');

/**
 * Genera un token JWT para el usuario autenticado
 * @param {Object} user - Objeto con datos del usuario (id, email, nombre)
 * @param {String} role - Rol del usuario ('empresa' | 'candidato')
 * @returns {String} Token JWT
 */
const generateToken = (user, role) => {
  if (!JWT_CONFIG.secret) {
    throw new Error('JWT_SECRET no está configurado. Por favor, configura JWT_SECRET en tu archivo .env');
  }

  const payload = {
    id: user.id,
    email: user.email,
    nombre: user.nombre,
    role: role,
  };

  try {
    return jwt.sign(payload, JWT_CONFIG.secret, {
      expiresIn: JWT_CONFIG.expiresIn,
    });
  } catch (error) {
    console.error('Error al generar token JWT:', error);
    throw new Error('Error al generar token de autenticación');
  }
};

/**
 * Verifica y decodifica un token JWT
 * @param {String} token - Token JWT a verificar
 * @returns {Object} Payload decodificado del token
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_CONFIG.secret);
  } catch (error) {
    throw new Error('Token inválido o expirado');
  }
};

/**
 * Hashea una contraseña usando bcrypt
 * @param {String} password - Contraseña en texto plano
 * @returns {String} Hash de la contraseña
 */
const hashPassword = async (password) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

/**
 * Compara una contraseña en texto plano con un hash
 * @param {String} password - Contraseña en texto plano
 * @param {String} hash - Hash almacenado
 * @returns {Boolean} true si coinciden, false en caso contrario
 */
const comparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

module.exports = {
  generateToken,
  verifyToken,
  hashPassword,
  comparePassword,
};
