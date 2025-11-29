const { verifyToken } = require('../utils/auth');

/**
 * Middleware para autenticar requests usando JWT
 * Extrae el token del header Authorization: Bearer <token>
 * Agrega el usuario decodificado a req.user
 */
const authenticateToken = (req, res, next) => {
  try {
    // Obtener token del header Authorization
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // "Bearer TOKEN"

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token de autenticación requerido',
        error: 'No se proporcionó token en el header Authorization',
      });
    }

    // Verificar y decodificar token
    const decoded = verifyToken(token);

    // Agregar información del usuario al request
    req.user = {
      id: decoded.id,
      email: decoded.email,
      nombre: decoded.nombre,
      role: decoded.role,
    };

    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: 'Token inválido o expirado',
      error: error.message,
    });
  }
};

/**
 * Middleware para validar que el usuario tenga un rol específico
 * @param {String|Array} allowedRoles - Rol(es) permitido(s)
 * @returns {Function} Middleware function
 */
const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    // Este middleware debe usarse después de authenticateToken
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Autenticación requerida',
        error: 'Usuario no autenticado',
      });
    }

    const userRole = req.user.role;
    const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

    if (!roles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: 'Acceso denegado',
        error: `Este endpoint requiere uno de los siguientes roles: ${roles.join(', ')}`,
      });
    }

    next();
  };
};

module.exports = {
  authenticateToken,
  requireRole,
};
