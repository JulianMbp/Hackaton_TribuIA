const express = require('express');
const { pool } = require('../db');

const router = express.Router();

// Listar empresas
router.get('/', async (req, res, next) => {
  try {
    const { rows } = await pool.query(`
      SELECT 
        id, nombre, sector, descripcion, email, telefono, pais, ciudad, direccion,
        vision, mision, valores, sitio_web, logo_url, linkedin_url, 
        anios_operacion, numero_empleados, created_at, updated_at
      FROM empresas 
      ORDER BY created_at DESC
    `);
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

// Obtener empresa por id
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query(`
      SELECT 
        id, nombre, sector, descripcion, email, telefono, pais, ciudad, direccion,
        vision, mision, valores, sitio_web, logo_url, linkedin_url, 
        anios_operacion, numero_empleados, created_at, updated_at
      FROM empresas 
      WHERE id = $1
    `, [id]);
    if (!rows.length) return res.status(404).json({ error: 'Empresa no encontrada' });
    res.json(rows[0]);
  } catch (err) {
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

    const query = `
      INSERT INTO empresas (
        nombre, sector, descripcion, email, password, telefono, pais, ciudad, direccion,
        vision, mision, valores, sitio_web, logo_url, linkedin_url, anios_operacion, numero_empleados
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
      RETURNING 
        id, nombre, sector, descripcion, email, telefono, pais, ciudad, direccion,
        vision, mision, valores, sitio_web, logo_url, linkedin_url, 
        anios_operacion, numero_empleados, created_at, updated_at;
    `;
    const values = [
      nombre, sector, descripcion, email, password, telefono, pais, ciudad, direccion,
      vision, mision, valores, sitio_web, logo_url, linkedin_url, anios_operacion, numero_empleados
    ];
    const { rows } = await pool.query(query, values);

    res.status(201).json(rows[0]);
  } catch (err) {
    next(err);
  }
});

// Actualizar empresa por id
router.patch('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const fields = [
      'nombre',
      'sector',
      'descripcion',
      'email',
      'password',
      'telefono',
      'pais',
      'ciudad',
      'direccion',
      'vision',
      'mision',
      'valores',
      'sitio_web',
      'logo_url',
      'linkedin_url',
      'anios_operacion',
      'numero_empleados',
    ];

    const updates = [];
    const values = [];

    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates.push(`${field} = $${values.length + 1}`);
        values.push(req.body[field]);
      }
    });

    if (!updates.length) {
      return res.status(400).json({ error: 'No se enviaron campos para actualizar' });
    }

    // Agregar updated_at automáticamente
    updates.push(`updated_at = now()`);
    values.push(id);

    const query = `
      UPDATE empresas
      SET ${updates.join(', ')}
      WHERE id = $${values.length}
      RETURNING 
        id, nombre, sector, descripcion, email, telefono, pais, ciudad, direccion,
        vision, mision, valores, sitio_web, logo_url, linkedin_url, 
        anios_operacion, numero_empleados, created_at, updated_at;
    `;

    const { rows } = await pool.query(query, values);
    if (!rows.length) return res.status(404).json({ error: 'Empresa no encontrada' });

    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

// Eliminar empresa por id
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rowCount } = await pool.query('DELETE FROM empresas WHERE id = $1', [id]);
    if (!rowCount) return res.status(404).json({ error: 'Empresa no encontrada' });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

module.exports = router;


