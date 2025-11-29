const express = require('express');
const { pool } = require('../db');

const router = express.Router();

// Listar entrevistas
router.get('/', async (req, res, next) => {
  try {
    // La tabla entrevistas (ver tablas-supabase.sql) no tiene columna created_at,
    // por lo que ordenamos por started_at (si existe) y luego por id como fallback estable.
    const { rows } = await pool.query(
      'SELECT * FROM entrevistas ORDER BY started_at DESC NULLS LAST, id DESC'
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

// Obtener entrevista por id
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query('SELECT * FROM entrevistas WHERE id = $1', [id]);
    if (!rows.length) return res.status(404).json({ error: 'Entrevista no encontrada' });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

// Crear entrevista
router.post('/', async (req, res, next) => {
  try {
    const { candidato_id, cargo_id, estado, metodo, puntaje_final, started_at, finished_at } = req.body;

    const query = `
      INSERT INTO entrevistas (candidato_id, cargo_id, estado, metodo, puntaje_final, started_at, finished_at)
      VALUES ($1,$2,$3,$4,$5,$6,$7)
      RETURNING *;
    `;
    const values = [
      candidato_id,
      cargo_id,
      estado || 'pendiente',
      metodo || 'IA',
      puntaje_final || null,
      started_at || null,
      finished_at || null,
    ];

    const { rows } = await pool.query(query, values);
    res.status(201).json(rows[0]);
  } catch (err) {
    next(err);
  }
});

// Actualizar entrevista por id
router.patch('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    const fields = ['candidato_id', 'cargo_id', 'estado', 'metodo', 'puntaje_final', 'started_at', 'finished_at'];

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
      UPDATE entrevistas
      SET ${updates.join(', ')}
      WHERE id = $${values.length}
      RETURNING *;
    `;

    const { rows } = await pool.query(query, values);
    if (!rows.length) return res.status(404).json({ error: 'Entrevista no encontrada' });

    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

// Eliminar entrevista por id
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rowCount } = await pool.query('DELETE FROM entrevistas WHERE id = $1', [id]);
    if (!rowCount) return res.status(404).json({ error: 'Entrevista no encontrada' });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

module.exports = router;


