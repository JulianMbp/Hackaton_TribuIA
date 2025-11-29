const express = require('express');
const { pool } = require('../db');

const router = express.Router();

// Listar cargos
router.get('/', async (req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT * FROM cargos ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

// Obtener cargo por id
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query('SELECT * FROM cargos WHERE id = $1', [id]);
    if (!rows.length) return res.status(404).json({ error: 'Cargo no encontrado' });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

// Crear cargo
router.post('/', async (req, res, next) => {
  try {
    const {
      empresa_id,
      nombre,
      descripcion,
      salario_min,
      salario_max,
      modalidad,
      skills_requeridos,
      nivel_experiencia,
      estado,
    } = req.body;

    const query = `
      INSERT INTO cargos (
        empresa_id, nombre, descripcion, salario_min, salario_max,
        modalidad, skills_requeridos, nivel_experiencia, estado
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
      RETURNING *;
    `;

    const values = [
      empresa_id,
      nombre,
      descripcion,
      salario_min,
      salario_max,
      modalidad,
      skills_requeridos,
      nivel_experiencia,
      estado || 'activo',
    ];

    const { rows } = await pool.query(query, values);
    res.status(201).json(rows[0]);
  } catch (err) {
    next(err);
  }
});

// Actualizar cargo por id
router.patch('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    const fields = [
      'empresa_id',
      'nombre',
      'descripcion',
      'salario_min',
      'salario_max',
      'modalidad',
      'skills_requeridos',
      'nivel_experiencia',
      'estado',
    ];

    const updates = [];
    const values = [];

    fields.forEach((field, index) => {
      if (req.body[field] !== undefined) {
        updates.push(`${field} = $${index + 1}`);
        values.push(req.body[field]);
      }
    });

    if (!updates.length) {
      return res.status(400).json({ error: 'No se enviaron campos para actualizar' });
    }

    values.push(id);

    const query = `
      UPDATE cargos
      SET ${updates.join(', ')}
      WHERE id = $${values.length}
      RETURNING *;
    `;

    const { rows } = await pool.query(query, values);
    if (!rows.length) return res.status(404).json({ error: 'Cargo no encontrado' });

    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

// Eliminar cargo por id
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rowCount } = await pool.query('DELETE FROM cargos WHERE id = $1', [id]);
    if (!rowCount) return res.status(404).json({ error: 'Cargo no encontrado' });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

module.exports = router;


