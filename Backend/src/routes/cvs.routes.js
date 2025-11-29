const express = require('express');
const { pool } = require('../db');

const router = express.Router();

// Listar CVs
router.get('/', async (req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT * FROM cvs ORDER BY uploaded_at DESC');
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

// Obtener CV por id
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query('SELECT * FROM cvs WHERE id = $1', [id]);
    if (!rows.length) return res.status(404).json({ error: 'CV no encontrado' });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

// Crear CV (solo metadatos, no archivo físico)
router.post('/', async (req, res, next) => {
  try {
    const { candidato_id, url_archivo, texto_extraido, formato, peso_archivo } = req.body;

    const query = `
      INSERT INTO cvs (candidato_id, url_archivo, texto_extraido, formato, peso_archivo)
      VALUES ($1,$2,$3,$4,$5)
      RETURNING *;
    `;
    const values = [candidato_id, url_archivo, texto_extraido, formato, peso_archivo];

    const { rows } = await pool.query(query, values);
    res.status(201).json(rows[0]);
  } catch (err) {
    next(err);
  }
});

// Actualizar CV por id
router.patch('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    const fields = ['candidato_id', 'url_archivo', 'texto_extraido', 'formato', 'peso_archivo'];

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
      UPDATE cvs
      SET ${updates.join(', ')}
      WHERE id = $${values.length}
      RETURNING *;
    `;

    const { rows } = await pool.query(query, values);
    if (!rows.length) return res.status(404).json({ error: 'CV no encontrado' });

    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

// Eliminar CV por id
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rowCount } = await pool.query('DELETE FROM cvs WHERE id = $1', [id]);
    if (!rowCount) return res.status(404).json({ error: 'CV no encontrado' });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

module.exports = router;


