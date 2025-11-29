const express = require('express');
const {
  loginEmpresa,
  loginCandidato,
  getMe,
} = require('../controllers/auth.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

const router = express.Router();

// Rutas públicas de autenticación
router.post('/login/empresa', loginEmpresa);
router.post('/login/candidato', loginCandidato);

// Rutas protegidas (requieren autenticación)
router.get('/me', authenticateToken, getMe);

module.exports = router;
