const express = require('express');
const { query } = require('../db');

const router = express.Router();

// Columnas según el esquema en tablas-supabase.sql
const EMPRESAS_COLUMNS = {
  // Columnas básicas (requeridas o comunes)
  basic: [
    'id', 'nombre', 'sector', 'descripcion', 'email', 'telefono',
    'pais', 'ciudad', 'direccion'
  ],
  // Columnas adicionales de información de la empresa
  additional: [
    'vision', 'mision', 'valores', 'sitio_web', 'logo_url', 'linkedin_url',
    'anios_operacion', 'numero_empleados'
  ],
  // Columnas de auditoría
  audit: ['created_at', 'updated_at']
};

// Construir SELECT con todas las columnas del esquema (sin password por seguridad)
const getSelectColumns = () => {
  const allColumns = [...EMPRESAS_COLUMNS.basic, ...EMPRESAS_COLUMNS.additional, ...EMPRESAS_COLUMNS.audit];
  // Excluir password de las respuestas por seguridad
  return allColumns.filter(col => col !== 'password').join(', ');
};

// Listar empresas
router.get('/', async (req, res, next) => {
  try {
    const { rows } = await query(`
      SELECT ${getSelectColumns()}
      FROM empresas 
      ORDER BY created_at DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error('Error al listar empresas:', err.message);
    next(err);
  }
});

// Obtener empresa por id
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rows } = await query(`
      SELECT ${getSelectColumns()}
      FROM empresas 
      WHERE id = $1
    `, [id]);
    
    if (!rows.length) {
      return res.status(404).json({ error: 'Empresa no encontrada' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error('Error al obtener empresa:', err.message);
    next(err);
  }
});

// Crear empresa
router.post('/', async (req, res, next) => {
  try {
    const {
      nombre,
      sector,
      descripcion,
      email,
      password,
      telefono,
      pais,
      ciudad,
      direccion,
      vision,
      mision,
      valores,
      sitio_web,
      logo_url,
      linkedin_url,
      anios_operacion,
      numero_empleados,
    } = req.body;

    // Validar campos requeridos según el esquema
    if (!nombre || !email || !password) {
      return res.status(400).json({ 
        error: 'Los campos nombre, email y password son requeridos' 
      });
    }

    // Campos según el esquema (sin id, created_at, updated_at que son automáticos)
    const fields = [
      'nombre', 'sector', 'descripcion', 'email', 'password', 'telefono',
      'pais', 'ciudad', 'direccion', 'vision', 'mision', 'valores',
      'sitio_web', 'logo_url', 'linkedin_url', 'anios_operacion', 'numero_empleados'
    ];

    const values = [];
    const placeholders = [];
    
    fields.forEach((field, index) => {
      placeholders.push(`$${index + 1}`);
      values.push(req.body[field] !== undefined ? req.body[field] : null);
    });
    
    const insertQuery = `
      INSERT INTO empresas (${fields.join(', ')})
      VALUES (${placeholders.join(', ')})
      RETURNING ${getSelectColumns()}
    `;
    
    const { rows } = await query(insertQuery, values);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('Error al crear empresa:', err.message);
    next(err);
  }
});

// Actualizar empresa por id
router.patch('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Campos actualizables según el esquema (sin id, created_at que no se actualizan)
    const fields = [
      'nombre', 'sector', 'descripcion', 'email', 'password',
      'telefono', 'pais', 'ciudad', 'direccion',
      'vision', 'mision', 'valores', 'sitio_web', 'logo_url', 
      'linkedin_url', 'anios_operacion', 'numero_empleados'
    ];

    const updates = [];
    const values = [];

    // Solo agregar campos que están presentes en el request
    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates.push(`${field} = $${values.length + 1}`);
        values.push(req.body[field]);
      }
    });

    if (!updates.length) {
      return res.status(400).json({ error: 'No se enviaron campos para actualizar' });
    }

    // Agregar updated_at automáticamente (según el esquema siempre existe)
    updates.push(`updated_at = now()`);
    values.push(id);

    const updateQuery = `
      UPDATE empresas
      SET ${updates.join(', ')}
      WHERE id = $${values.length}
      RETURNING ${getSelectColumns()}
    `;

    const { rows } = await query(updateQuery, values);
    if (!rows.length) {
      return res.status(404).json({ error: 'Empresa no encontrada' });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error('Error al actualizar empresa:', err.message);
    next(err);
  }
});

// Eliminar empresa por id
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rowCount } = await query('DELETE FROM empresas WHERE id = $1', [id]);
    if (!rowCount) {
      return res.status(404).json({ error: 'Empresa no encontrada' });
    }
    res.status(204).send();
  } catch (err) {
    console.error('Error al eliminar empresa:', err.message);
    next(err);
  }
});

module.exports = router;


