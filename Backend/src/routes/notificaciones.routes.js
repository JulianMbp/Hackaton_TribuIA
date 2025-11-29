const express = require('express');
const { pool } = require('../db');

const router = express.Router();

// Listar notificaciones (opcionalmente filtradas por usuario_id)
router.get('/', async (req, res, next) => {
  try {
    const { usuario_id } = req.query;
    let query = 'SELECT * FROM notificaciones';
    const values = [];

    if (usuario_id) {
      query += ' WHERE usuario_id = $1';
      values.push(usuario_id);
    }

    query += ' ORDER BY created_at DESC';

    const { rows } = await pool.query(query, values);
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

// Crear notificación
router.post('/', async (req, res, next) => {
  try {
    const { usuario_id, tipo_usuario, mensaje, leido } = req.body;

    const query = `
      INSERT INTO notificaciones (usuario_id, tipo_usuario, mensaje, leido)
      VALUES ($1,$2,$3,$4)
      RETURNING *;
    `;
    const values = [usuario_id, tipo_usuario, mensaje, leido ?? false];

    const { rows } = await pool.query(query, values);
    res.status(201).json(rows[0]);
  } catch (err) {
    next(err);
  }
});

// Marcar notificación como leída
router.patch('/:id/leido', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { leido } = req.body;

    const query = `
      UPDATE notificaciones
      SET leido = $1
      WHERE id = $2
      RETURNING *;
    `;

    const { rows } = await pool.query(query, [leido ?? true, id]);
    if (!rows.length) return res.status(404).json({ error: 'Notificación no encontrada' });

    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

// Eliminar notificación
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rowCount } = await pool.query('DELETE FROM notificaciones WHERE id = $1', [id]);
    if (!rowCount) return res.status(404).json({ error: 'Notificación no encontrada' });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

module.exports = router;


