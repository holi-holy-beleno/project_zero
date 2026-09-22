const express = require('express');
const router = express.Router();
const db = require('../app'); // O requiere tu modulo de conexion

router.get('/', (req, res) => {
  db.query('SELECT * FROM clientes', (err, results) => {
    if (err) {
      console.error('Error en la consulta:', err.message);
      return res.status(500).json({ error: 'Error al consultar clientes' });
    }
    res.json(results);
  });
});

module.exports = router;