const express = require('express');
const { pool } = require('../db');

const router = express.Router();

// Listar historial de aplicaciones
router.get('/', async (req, res, next) => {
  try {
    const { candidato_id } = req.query;
    
    let query = `
      SELECT 
        ha.id,
        ha.candidato_id,
        ha.cargo_id,
        ha.estado,
        ha.fecha,
        c.nombre as cargo_nombre,
        c.descripcion as cargo_descripcion,
        c.modalidad as cargo_modalidad,
        c.salario_min,
        c.salario_max,
        e.nombre as empresa_nombre
      FROM historial_aplicaciones ha
      LEFT JOIN cargos c ON ha.cargo_id = c.id
      LEFT JOIN empresas e ON c.empresa_id = e.id
    `;
    
    const values = [];
    if (candidato_id) {
      query += ' WHERE ha.candidato_id = $1';
      values.push(candidato_id);
    }
    
    query += ' ORDER BY COALESCE(ha.fecha, NOW()) DESC';
    
    const { rows } = await pool.query(query, values);
    res.json(rows);
  } catch (err) {
    console.error('Error en GET /api/historial:', err);
    console.error('Error message:', err.message);
    console.error('Error code:', err.code);
    console.error('Query params:', req.query);
    // Si falla con JOIN, intentamos sin JOIN
    try {
      let simpleQuery = 'SELECT * FROM historial_aplicaciones';
      const values = [];
      if (req.query.candidato_id) {
        simpleQuery += ' WHERE candidato_id = $1';
        values.push(req.query.candidato_id);
      }
      simpleQuery += ' ORDER BY fecha DESC NULLS LAST';
      const { rows } = await pool.query(simpleQuery, values);
      res.json(rows);
    } catch (err2) {
      console.error('Error en query simple:', err2);
      next(err2);
    }
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


