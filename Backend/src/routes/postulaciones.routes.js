const express = require('express');
const multer = require('multer');
const { uploadFileToStorage } = require('../utils/supabaseStorage');
const axios = require('axios');
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
    const { cargo_id, candidato_id } = req.body;
    const file = req.file;

    // Validaciones
    if (!cargo_id) {
      return res.status(400).json({ error: 'Se requiere cargo_id' });
    }

    if (!file) {
      return res.status(400).json({ error: 'Se requiere un archivo CV' });
    }

    // Subir CV a Supabase Storage
    let cvUrl;
    try {
      const uploadResult = await uploadFileToStorage(
        file.buffer,
        file.originalname,
        'cvs'
      );
      cvUrl = uploadResult.url;
    } catch (uploadError) {
      console.error('Error al subir CV:', uploadError);
      return res.status(500).json({
        error: 'Error al subir el CV',
        details: uploadError.message,
      });
    }

    // Llamar al webhook de n8n
    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL || 'http://localhost:5678/webhook/candidate_intake';
    
    try {
      const n8nResponse = await axios.post(
        n8nWebhookUrl,
        {
          cv_url: cvUrl,
          cargo_id: cargo_id,
          candidato_id: candidato_id || null,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 30000, // 30 segundos
        }
      );

      // El workflow de n8n se encarga de:
      // 1. Descargar el CV
      // 2. Extraer texto
      // 3. Extraer información con IA
      // 4. Guardar candidato (si no existe)
      // 5. Guardar CV
      // 6. Crear historial de aplicación

      res.status(200).json({
        success: true,
        message: 'Postulación enviada correctamente',
        cv_url: cvUrl,
        n8n_response: n8nResponse.data,
      });
    } catch (n8nError) {
      console.error('Error al llamar webhook de n8n:', n8nError);
      
      // Aunque falle n8n, el CV ya está subido, así que devolvemos éxito parcial
      res.status(202).json({
        success: true,
        message: 'CV subido correctamente, pero hubo un error al procesar la postulación',
        cv_url: cvUrl,
        warning: 'El workflow de n8n no pudo procesar la solicitud. Por favor, contacta al administrador.',
        error: n8nError.message,
      });
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;

