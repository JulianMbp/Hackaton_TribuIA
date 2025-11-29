const express = require('express');
const { pool } = require('../db');

const router = express.Router();

// Listar respuestas
router.get('/', async (req, res, next) => {
  try {
    const { pregunta_id } = req.query;
    let query = 'SELECT * FROM respuestas';
    const values = [];

    if (pregunta_id) {
      query += ' WHERE pregunta_id = $1';
      values.push(pregunta_id);
    }

    query += ' ORDER BY created_at ASC';

    const { rows } = await pool.query(query, values);
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

// Crear respuesta
router.post('/', async (req, res, next) => {
  try {
    const { pregunta_id, contenido, tipo } = req.body;

    const query = `
      INSERT INTO respuestas (pregunta_id, contenido, tipo)
      VALUES ($1,$2,$3)
      RETURNING *;
    `;
    const values = [pregunta_id, contenido, tipo || 'texto'];

    const { rows } = await pool.query(query, values);
    res.status(201).json(rows[0]);
  } catch (err) {
    next(err);
  }
});

// Actualizar respuesta por id
router.patch('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    const fields = ['pregunta_id', 'contenido', 'tipo'];
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
      UPDATE respuestas
      SET ${updates.join(', ')}
      WHERE id = $${values.length}
      RETURNING *;
    `;

    const { rows } = await pool.query(query, values);
    if (!rows.length) return res.status(404).json({ error: 'Respuesta no encontrada' });

    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

// Eliminar respuesta
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    const { rowCount } = await pool.query('DELETE FROM respuestas WHERE id = $1', [id]);
    if (!rowCount) return res.status(404).json({ error: 'Respuesta no encontrada' });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

module.exports = router;


