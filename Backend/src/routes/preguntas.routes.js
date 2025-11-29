const express = require('express');
const { pool } = require('../db');

const router = express.Router();

// Listar preguntas
router.get('/', async (req, res, next) => {
  try {
    const { entrevista_id } = req.query;
    let query = 'SELECT * FROM preguntas';
    const values = [];

    if (entrevista_id) {
      query += ' WHERE entrevista_id = $1';
      values.push(entrevista_id);
    }

    query += ' ORDER BY created_at ASC';

    const { rows } = await pool.query(query, values);
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

// Crear pregunta
router.post('/', async (req, res, next) => {
  try {
    const { entrevista_id, tipo, contenido, generada_por } = req.body;

    const query = `
      INSERT INTO preguntas (entrevista_id, tipo, contenido, generada_por)
      VALUES ($1,$2,$3,$4)
      RETURNING *;
    `;
    const values = [entrevista_id, tipo, contenido, generada_por || 'manual'];

    const { rows } = await pool.query(query, values);
    res.status(201).json(rows[0]);
  } catch (err) {
    next(err);
  }
});

// Actualizar pregunta por id
router.patch('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    const fields = ['entrevista_id', 'tipo', 'contenido', 'generada_por'];
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
      UPDATE preguntas
      SET ${updates.join(', ')}
      WHERE id = $${values.length}
      RETURNING *;
    `;

    const { rows } = await pool.query(query, values);
    if (!rows.length) return res.status(404).json({ error: 'Pregunta no encontrada' });

    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

// Eliminar pregunta
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rowCount } = await pool.query('DELETE FROM preguntas WHERE id = $1', [id]);
    if (!rowCount) return res.status(404).json({ error: 'Pregunta no encontrada' });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

module.exports = router;


