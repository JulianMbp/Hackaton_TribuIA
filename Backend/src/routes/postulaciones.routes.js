const express = require('express');
const multer = require('multer');
const { uploadFileToStorage } = require('../utils/supabaseStorage');
require('dotenv').config();

const router = express.Router();

// Configurar multer para almacenar en memoria
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB máximo
  },
  fileFilter: (req, file, cb) => {
    // Solo permitir PDFs
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten archivos PDF'), false);
    }
  },
});

/**
 * POST /api/postulaciones
 * Endpoint para que un candidato se postule a un cargo
 * Recibe: cargo_id, candidato_id (opcional si viene del token), y archivo CV
 */
router.post('/', upload.single('cv'), async (req, res, next) => {
  try {
    console.log('📥 Postulación recibida:', {
      body: req.body,
      file: req.file ? {
        originalname: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype
      } : null
    });

    const { cargo_id, candidato_id } = req.body;
    const file = req.file;

    // Validaciones
    if (!cargo_id) {
      console.error('❌ Error: cargo_id no proporcionado');
      return res.status(400).json({ error: 'Se requiere cargo_id' });
    }

    if (!file) {
      console.error('❌ Error: archivo CV no proporcionado');
      return res.status(400).json({ error: 'Se requiere un archivo CV' });
    }

    console.log('✅ Validaciones pasadas:', { cargo_id, candidato_id });

    // Subir CV a Supabase Storage
    let cvUrl;
    try {
      const uploadResult = await uploadFileToStorage(
        file.buffer,
        file.originalname,
        'cvs'
      );
      cvUrl = uploadResult.url;
      console.log('✅ CV subido exitosamente:', cvUrl);
    } catch (uploadError) {
      console.error('❌ Error al subir CV:', uploadError);
      return res.status(500).json({
        error: 'Error al subir el CV',
        details: uploadError.message,
      });
    }

    // El frontend ahora se encarga de llamar a n8n directamente
    // Este endpoint solo sube el CV y devuelve la URL
    // Validar que cargo_id esté presente
    if (!cargo_id) {
      console.error('❌ Error: cargo_id no proporcionado en la petición');
      return res.status(400).json({
        error: 'Se requiere cargo_id',
        details: 'El ID de la vacante es obligatorio',
      });
    }

    console.log('✅ CV subido exitosamente:', {
      cv_url: cvUrl,
      cargo_id: cargo_id,
      candidato_id: candidato_id || null,
    });

    res.status(200).json({
      success: true,
      message: 'CV subido correctamente',
      cv_url: cvUrl,
      cargo_id: cargo_id,
      candidato_id: candidato_id || null,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

