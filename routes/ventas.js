var express = require('express');
var router = express.Router();

const ventas = [];

// Middlewares
const medirTiempo = (req, res, next) => {
  const inicio = Date.now();
  res.on("finish", () => {
    console.log(`${req.method} ${req.url} - ${Date.now() - inicio}ms`);
  });
  next();
};

function datosPeticion(req, res, next) {
  console.log(`${req.originalUrl} , ${JSON.stringify(req.body)}, ${req.method}`);
  next();
}

const validarVenta = (req, res, next) => {
  const { clienteId, productoId, cantidad, total } = req.body;
  if (!clienteId || !productoId || !cantidad || !total) {
    return res.status(400).json({ mensaje: "Faltan datos requeridos (clienteId, productoId, cantidad, total)" });
  }
  next();
};

// Rutas
router.get('/', medirTiempo, (req, res) => {
  res.json(ventas);
});

router.get('/:id', medirTiempo, (req, res) => {
  const venta = ventas.find(v => v.id === parseInt(req.params.id));
  if (!venta) return res.status(404).json({ mensaje: "Venta no encontrada" });
  res.json(venta);
});

router.post('/', medirTiempo, datosPeticion, validarVenta, (req, res) => {
  const nuevaVenta = {
    id: ventas.length + 1,
    clienteId: parseInt(req.body.clienteId),
    productoId: parseInt(req.body.productoId),
    cantidad: parseInt(req.body.cantidad),
    total: parseFloat(req.body.total),
    fecha: new Date().toISOString().split('T')[0]
  };

  ventas.push(nuevaVenta);
  res.status(201).json({ mensaje: "Venta registrada con éxito", venta: nuevaVenta });
});

module.exports = router;