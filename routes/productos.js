var express = require('express');
var router = express.Router();

const productos = [];

// Middlewares[cite: 1]
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

const VdatosProductos = (req, res, next) => {
  if (!req.body.nomPro) {
    return res.status(400).send("Falta el nombre del Producto!!");
  }
  if (!req.body.precio) {
    return res.status(400).send("Falta el Precio!!");
  }
  next();
};

// Rutas
router.get('/', medirTiempo, (req, res) => {
  res.json(productos);
});

router.get('/:id', medirTiempo, (req, res) => {
  const producto = productos.find(p => p.id === parseInt(req.params.id));
  if (!producto) return res.status(404).json({ mensaje: "Producto no encontrado" });
  res.json(producto);
});

router.post('/', medirTiempo, datosPeticion, VdatosProductos, (req, res) => {
  const nuevoProducto = {
    id: productos.length + 1,
    nomPro: req.body.nomPro,
    precio: parseFloat(req.body.precio)
  };
  productos.push(nuevoProducto);
  res.status(201).json({ mensaje: "Producto agregado exitosamente", producto: nuevoProducto });
});

router.put('/:id', medirTiempo, datosPeticion, VdatosProductos, (req, res) => {
  const producto = productos.find(p => p.id === parseInt(req.params.id));
  if (!producto) return res.status(404).json({ mensaje: "Producto no encontrado" });

  producto.nomPro = req.body.nomPro;
  producto.precio = parseFloat(req.body.precio);

  res.json({ mensaje: "Producto actualizado", producto });
});

router.delete('/:id', medirTiempo, (req, res) => {
  const indice = productos.findIndex(p => p.id === parseInt(req.params.id));
  if (indice === -1) return res.status(404).json({ mensaje: "Producto no encontrado" });

  const eliminado = productos.splice(indice, 1);
  res.json({ mensaje: "Producto eliminado", producto: eliminado[0] });
});

module.exports = router;