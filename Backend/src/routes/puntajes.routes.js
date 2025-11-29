const express = require('express');
const { pool } = require('../db');

const router = express.Router();

// Listar puntajes
router.get('/', async (req, res, next) => {
  try {
    const { entrevista_id } = req.query;
    let query = 'SELECT * FROM puntajes';
    const values = [];

    if (entrevista_id) {
      query += ' WHERE entrevista_id = $1';
      values.push(entrevista_id);
    }

    const { rows } = await pool.query(query, values);
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

// Crear puntaje
router.post('/', async (req, res, next) => {
  try {
    const { entrevista_id, criterio, valor } = req.body;

    const query = `
      INSERT INTO puntajes (entrevista_id, criterio, valor)
      VALUES ($1,$2,$3)
      RETURNING *;
    `;
    const values = [entrevista_id, criterio, valor];

    const { rows } = await pool.query(query, values);
    res.status(201).json(rows[0]);
  } catch (err) {
    next(err);
  }
});

// Actualizar puntaje
router.patch('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { entrevista_id, criterio, valor } = req.body;

    const query = `
      UPDATE puntajes
      SET
        entrevista_id = COALESCE($1, entrevista_id),
        criterio = COALESCE($2, criterio),
        valor = COALESCE($3, valor)
      WHERE id = $4
      RETURNING *;
    `;

    const { rows } = await pool.query(query, [entrevista_id, criterio, valor, id]);
    if (!rows.length) return res.status(404).json({ error: 'Puntaje no encontrado' });

    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

// Eliminar puntaje
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rowCount } = await pool.query('DELETE FROM puntajes WHERE id = $1', [id]);
    if (!rowCount) return res.status(404).json({ error: 'Puntaje no encontrado' });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

module.exports = router;


