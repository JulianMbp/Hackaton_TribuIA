const express = require('express');
const { query } = require('../db');

const router = express.Router();

// Cache de columnas disponibles
let availableColumnsCache = null;
let columnsCacheTime = 0;
const CACHE_TTL = 300000; // 5 minutos

// Todas las columnas posibles según el esquema
const ALL_POSSIBLE_COLUMNS = [
  'id', 'nombre', 'sector', 'descripcion', 'email', 'password', 'telefono',
  'pais', 'ciudad', 'direccion', 'vision', 'mision', 'valores', 'sitio_web',
  'logo_url', 'linkedin_url', 'anios_operacion', 'numero_empleados',
  'created_at', 'updated_at'
];

// Función para obtener las columnas que realmente existen en la base de datos
const getAvailableColumns = async () => {
  const now = Date.now();
  
  // Retornar cache si aún es válido
  if (availableColumnsCache && (now - columnsCacheTime) < CACHE_TTL) {
    return availableColumnsCache;
  }

  try {
    const { rows } = await query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'empresas' 
      AND table_schema = 'public'
      ORDER BY ordinal_position
    `);
    
    const columns = rows.map(row => row.column_name);
    availableColumnsCache = columns;
    columnsCacheTime = now;
    
    console.log('✅ Columnas detectadas en tabla empresas:', columns.join(', '));
    return columns;
  } catch (err) {
    console.error('⚠️ Error al obtener columnas disponibles:', err.message);
    // Si falla, retornar columnas básicas mínimas que probablemente existan
    return ['id', 'nombre', 'sector', 'descripcion', 'email', 'telefono', 
            'pais', 'ciudad', 'direccion', 'created_at'];
  }
};

// Construir SELECT solo con columnas que existen (sin password por seguridad)
const getSelectColumns = async () => {
  const availableColumns = await getAvailableColumns();
  // Filtrar solo columnas existentes y excluir password
  const selectColumns = ALL_POSSIBLE_COLUMNS.filter(
    col => availableColumns.includes(col) && col !== 'password'
  );
  return selectColumns.join(', ');
};

// Listar empresas
router.get('/', async (req, res, next) => {
  try {
    const selectColumns = await getSelectColumns();
    const availableColumns = await getAvailableColumns();
    
    // Usar created_at si existe, sino ordenar por id
    const orderBy = availableColumns.includes('created_at') ? 'created_at DESC' : 'id DESC';
    
    const { rows } = await query(`
      SELECT ${selectColumns}
      FROM empresas 
      ORDER BY ${orderBy}
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
    const selectColumns = await getSelectColumns();
    const { rows } = await query(`
      SELECT ${selectColumns}
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
    const availableColumns = await getAvailableColumns();
    
    // Validar campos requeridos
    if (!req.body.nombre || !req.body.email || !req.body.password) {
      return res.status(400).json({ 
        error: 'Los campos nombre, email y password son requeridos' 
      });
    }

    // Campos que podríamos insertar (sin id, created_at, updated_at que son automáticos)
    const possibleFields = [
      'nombre', 'sector', 'descripcion', 'email', 'password', 'telefono',
      'pais', 'ciudad', 'direccion', 'vision', 'mision', 'valores',
      'sitio_web', 'logo_url', 'linkedin_url', 'anios_operacion', 'numero_empleados'
    ];

    // Filtrar solo campos que existen en la BD
    const fieldsToInsert = possibleFields.filter(field => availableColumns.includes(field));

    const values = [];
    const placeholders = [];
    
    fieldsToInsert.forEach((field) => {
      placeholders.push(`$${values.length + 1}`);
      values.push(req.body[field] !== undefined ? req.body[field] : null);
    });
    
    const selectColumns = await getSelectColumns();
    const insertQuery = `
      INSERT INTO empresas (${fieldsToInsert.join(', ')})
      VALUES (${placeholders.join(', ')})
      RETURNING ${selectColumns}
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
    const availableColumns = await getAvailableColumns();
    
    // Campos que podrían actualizarse (sin id, created_at que no se actualizan)
    const possibleFields = [
      'nombre', 'sector', 'descripcion', 'email', 'password',
      'telefono', 'pais', 'ciudad', 'direccion',
      'vision', 'mision', 'valores', 'sitio_web', 'logo_url', 
      'linkedin_url', 'anios_operacion', 'numero_empleados'
    ];

    const updates = [];
    const values = [];

    // Solo agregar campos que existen en la BD y están presentes en el request
    possibleFields.forEach((field) => {
      if (availableColumns.includes(field) && req.body[field] !== undefined) {
        updates.push(`${field} = $${values.length + 1}`);
        values.push(req.body[field]);
      }
    });

    if (!updates.length) {
      return res.status(400).json({ error: 'No se enviaron campos válidos para actualizar' });
    }

    // Agregar updated_at automáticamente si existe la columna
    if (availableColumns.includes('updated_at')) {
      updates.push(`updated_at = now()`);
    }
    
    values.push(id);

    const selectColumns = await getSelectColumns();
    const updateQuery = `
      UPDATE empresas
      SET ${updates.join(', ')}
      WHERE id = $${values.length}
      RETURNING ${selectColumns}
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


