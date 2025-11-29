const { query } = require('../db');
const { generateToken, comparePassword } = require('../utils/auth');

/**
 * Login para empresas
 * Valida email y password contra la tabla empresas
 */
const loginEmpresa = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validar campos requeridos
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Campos requeridos faltantes',
        error: 'Email y contraseña son requeridos',
      });
    }

    // Buscar empresa por email
    const { rows } = await query(
      'SELECT id, nombre, email, password FROM empresas WHERE email = $1',
      [email]
    );

    if (!rows.length) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas',
        error: 'Email o contraseña incorrectos',
      });
    }

    const empresa = rows[0];

    // Verificar contraseña
    // Si la contraseña está hasheada (empieza con $2a$ o $2b$), usar bcrypt
    // Si no, comparar directamente (solo para desarrollo/migración)
    let passwordMatch = false;
    if (empresa.password && (empresa.password.startsWith('$2a$') || empresa.password.startsWith('$2b$'))) {
      // Contraseña hasheada con bcrypt
      passwordMatch = await comparePassword(password, empresa.password);
    } else {
      // Contraseña sin hashear (solo para desarrollo)
      passwordMatch = password === empresa.password;
    }

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas',
        error: 'Email o contraseña incorrectos',
      });
    }

    // Generar token JWT
    const token = generateToken(
      {
        id: empresa.id,
        email: empresa.email,
        nombre: empresa.nombre,
      },
      'empresa'
    );

    // Retornar respuesta exitosa
    res.json({
      success: true,
      message: 'Login exitoso',
      data: {
        token,
        user: {
          id: empresa.id,
          email: empresa.email,
          nombre: empresa.nombre,
          role: 'empresa',
        },
      },
    });
  } catch (error) {
    console.error('Error en loginEmpresa:', error);
    next(error);
  }
};

/**
 * Login para candidatos
 * Valida email y password contra la tabla candidatos
 */
const loginCandidato = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validar campos requeridos
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Campos requeridos faltantes',
        error: 'Email y contraseña son requeridos',
      });
    }

    // Buscar candidato por email
    const { rows } = await query(
      'SELECT id, nombre, email, password FROM candidatos WHERE email = $1',
      [email]
    );

    if (!rows.length) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas',
        error: 'Email o contraseña incorrectos',
      });
    }

    const candidato = rows[0];

    // Verificar contraseña
    // Si la contraseña está hasheada (empieza con $2a$ o $2b$), usar bcrypt
    // Si no, comparar directamente (solo para desarrollo/migración)
    let passwordMatch = false;
    if (candidato.password && (candidato.password.startsWith('$2a$') || candidato.password.startsWith('$2b$'))) {
      // Contraseña hasheada con bcrypt
      passwordMatch = await comparePassword(password, candidato.password);
    } else {
      // Contraseña sin hashear (solo para desarrollo)
      passwordMatch = password === candidato.password;
    }

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas',
        error: 'Email o contraseña incorrectos',
      });
    }

    // Generar token JWT
    const token = generateToken(
      {
        id: candidato.id,
        email: candidato.email,
        nombre: candidato.nombre,
      },
      'candidato'
    );

    // Retornar respuesta exitosa
    res.json({
      success: true,
      message: 'Login exitoso',
      data: {
        token,
        user: {
          id: candidato.id,
          email: candidato.email,
          nombre: candidato.nombre,
          role: 'candidato',
        },
      },
    });
  } catch (error) {
    console.error('Error en loginCandidato:', error);
    next(error);
  }
};

/**
 * Obtener información del usuario autenticado
 * Requiere token JWT válido
 */
const getMe = async (req, res, next) => {
  try {
    // El middleware authenticateToken ya agregó req.user
    const { id, role } = req.user;

    // Obtener datos completos según el rol
    let userData;
    const table = role === 'empresa' ? 'empresas' : 'candidatos';
    const selectColumns = role === 'empresa' 
      ? 'id, nombre, email, sector, descripcion, telefono, pais, ciudad, direccion, sitio_web, logo_url, linkedin_url, created_at'
      : 'id, nombre, email, telefono, pais, ciudad, experiencia_anios, educacion, skills, cargo_aplicado, portafolio_url, github_url, descripcion, created_at';

    const { rows } = await query(
      `SELECT ${selectColumns} FROM ${table} WHERE id = $1`,
      [id]
    );

    if (!rows.length) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado',
        error: 'El usuario autenticado no existe en la base de datos',
      });
    }

    userData = {
      ...rows[0],
      role: role,
    };

    res.json({
      success: true,
      data: userData,
    });
  } catch (error) {
    console.error('Error en getMe:', error);
    next(error);
  }
};

module.exports = {
  loginEmpresa,
  loginCandidato,
  getMe,
};
