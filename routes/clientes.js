const express = require('express');
const router = express.Router();
const db = require('../db'); // <-- Cambia '../app' por '../db'

router.get('/', (req, res) => {
  db.query('SELECT * FROM clientes', (err, results) => {
    if (err) {
      console.error('Error al obtener clientes:', err.message);
      return res.status(500).json({ error: 'Error en la consulta SQL' });
    }
    res.json(results);
  });
});

module.exports = router;