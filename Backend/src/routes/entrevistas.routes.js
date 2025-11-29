const express = require('express');
const { pool } = require('../db');

const router = express.Router();

// Listar entrevistas
router.get('/', async (req, res, next) => {
  try {
    const { cargo_id, candidato_id } = req.query;
    let query = 'SELECT * FROM entrevistas';
    const values = [];
    const conditions = [];

    if (cargo_id) {
      conditions.push(`cargo_id = $${values.length + 1}`);
      values.push(cargo_id);
    }

    if (candidato_id) {
      conditions.push(`candidato_id = $${values.length + 1}`);
      values.push(candidato_id);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY started_at DESC NULLS LAST, id DESC';

    const { rows } = await pool.query(query, values);
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

// Obtener entrevistas con puntajes agrupados por cargo y candidato
router.get('/con-puntajes', async (req, res, next) => {
  try {
    const { cargo_id } = req.query;
    
    let query = `
      SELECT 
        e.id as entrevista_id,
        e.candidato_id,
        e.cargo_id,
        e.estado as entrevista_estado,
        e.metodo,
        e.puntaje_final,
        e.started_at,
        e.finished_at,
        c.nombre as candidato_nombre,
        c.email as candidato_email,
        c.skills as candidato_skills,
        c.experiencia_anios as candidato_experiencia,
        json_agg(
          json_build_object(
            'id', p.id,
            'criterio', p.criterio,
            'valor', p.valor
          ) ORDER BY p.valor DESC
        ) FILTER (WHERE p.id IS NOT NULL) as puntajes
      FROM entrevistas e
      LEFT JOIN candidatos c ON e.candidato_id = c.id
      LEFT JOIN puntajes p ON e.id = p.entrevista_id
    `;
    
    const values = [];
    
    if (cargo_id) {
      query += ' WHERE e.cargo_id = $1';
      values.push(cargo_id);
    }
    
    query += `
      GROUP BY 
        e.id, e.candidato_id, e.cargo_id, e.estado, e.metodo, 
        e.puntaje_final, e.started_at, e.finished_at,
        c.nombre, c.email, c.skills, c.experiencia_anios
      ORDER BY e.puntaje_final DESC NULLS LAST, e.started_at DESC NULLS LAST
    `;

    const { rows } = await pool.query(query, values);
    
    // Transformar los puntajes de JSON a array
    const result = rows.map(row => ({
      ...row,
      puntajes: row.puntajes || []
    }));
    
    res.json(result);
  } catch (err) {
    next(err);
  }
});

module.exports = router;


