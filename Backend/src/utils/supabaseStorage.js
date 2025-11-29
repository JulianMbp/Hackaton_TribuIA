const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL || 'https://ctvbtlmxdmryckxnhjug.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseServiceKey) {
  console.warn('⚠️ SUPABASE_SERVICE_KEY o SUPABASE_ANON_KEY no está configurado');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

/**
 * Sube un archivo a Supabase Storage
 * @param {Buffer} fileBuffer - Buffer del archivo
 * @param {string} fileName - Nombre del archivo
 * @param {string} folder - Carpeta en storage (default: 'cvs')
 * @returns {Promise<{url: string, path: string}>}
 */
async function uploadFileToStorage(fileBuffer, fileName, folder = 'cvs') {
  try {
    // Generar nombre único para el archivo
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 15);
    const fileExtension = fileName.split('.').pop();
    const uniqueFileName = `${timestamp}_${randomStr}.${fileExtension}`;
    const filePath = `${folder}/${uniqueFileName}`;

    // Subir archivo
    const { data, error } = await supabase.storage
      .from('cvs')
      .upload(filePath, fileBuffer, {
        contentType: 'application/pdf',
        upsert: false,
      });

    if (error) {
      throw new Error(`Error al subir archivo a Supabase Storage: ${error.message}`);
    }

    // Obtener URL pública
    const { data: urlData } = supabase.storage.from('cvs').getPublicUrl(filePath);

    return {
      url: urlData.publicUrl,
      path: filePath,
    };
  } catch (error) {
    console.error('Error en uploadFileToStorage:', error);
    throw error;
  }
}

module.exports = {
  uploadFileToStorage,
  supabase,
};

