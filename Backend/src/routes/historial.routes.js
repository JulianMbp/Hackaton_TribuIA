const express = require('express');
const { pool } = require('../db');

const router = express.Router();

// Listar historial de aplicaciones
router.get('/', async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM historial_aplicaciones ORDER BY fecha DESC',
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

// Crear entrada de historial (cuando un candidato aplica a un cargo)
router.post('/', async (req, res, next) => {
  try {
    const { candidato_id, cargo_id, estado } = req.body;

    const query = `
      INSERT INTO historial_aplicaciones (candidato_id, cargo_id, estado)
      VALUES ($1,$2,$3)
      RETURNING *;
    `;
    const values = [candidato_id, cargo_id, estado || 'aplicado'];

    const { rows } = await pool.query(query, values);
    res.status(201).json(rows[0]);
  } catch (err) {
    next(err);
  }
});

// Actualizar estado en historial por id
router.patch('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    if (!estado) {
      return res.status(400).json({ error: 'Se requiere el campo estado' });
    }

    const query = `
      UPDATE historial_aplicaciones
      SET estado = $1
      WHERE id = $2
      RETURNING *;
    `;

    const { rows } = await pool.query(query, [estado, id]);
    if (!rows.length) return res.status(404).json({ error: 'Registro de historial no encontrado' });

    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

// Eliminar entrada de historial
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rowCount } = await pool.query('DELETE FROM historial_aplicaciones WHERE id = $1', [
      id,
    ]);
    if (!rowCount) {
      return res.status(404).json({ error: 'Registro de historial no encontrado' });
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

module.exports = router;


