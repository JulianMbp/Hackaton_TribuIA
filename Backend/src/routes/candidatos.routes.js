const express = require('express');
const { pool } = require('../db');

const router = express.Router();

// Listar candidatos
router.get('/', async (req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT * FROM candidatos ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

// Obtener candidato por id
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query('SELECT * FROM candidatos WHERE id = $1', [id]);
    if (!rows.length) return res.status(404).json({ error: 'Candidato no encontrado' });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

// Crear candidato
router.post('/', async (req, res, next) => {
  try {
    const {
      nombre,
      email,
      password,
      telefono,
      pais,
      ciudad,
      experiencia_anios,
      educacion,
      skills,
      cargo_aplicado,
      portafolio_url,
      github_url,
      descripcion,
    } = req.body;

    const query = `
      INSERT INTO candidatos (
        nombre, email, password, telefono, pais, ciudad,
        experiencia_anios, educacion, skills, cargo_aplicado,
        portafolio_url, github_url, descripcion
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
      RETURNING *;
    `;

    const values = [
      nombre,
      email,
      password,
      telefono,
      pais,
      ciudad,
      experiencia_anios,
      educacion,
      skills,
      cargo_aplicado,
      portafolio_url,
      github_url,
      descripcion,
    ];

    const { rows } = await pool.query(query, values);
    res.status(201).json(rows[0]);
  } catch (err) {
    next(err);
  }
});

// Actualizar candidato por id
router.patch('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    const fields = [
      'nombre',
      'email',
      'password',
      'telefono',
      'pais',
      'ciudad',
      'experiencia_anios',
      'educacion',
      'skills',
      'cargo_aplicado',
      'portafolio_url',
      'github_url',
      'descripcion',
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
      UPDATE candidatos
      SET ${updates.join(', ')}
      WHERE id = $${values.length}
      RETURNING *;
    `;

    const { rows } = await pool.query(query, values);
    if (!rows.length) return res.status(404).json({ error: 'Candidato no encontrado' });

    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

// Eliminar candidato por id
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rowCount } = await pool.query('DELETE FROM candidatos WHERE id = $1', [id]);
    if (!rowCount) return res.status(404).json({ error: 'Candidato no encontrado' });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

module.exports = router;


