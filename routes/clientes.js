var express = require('express');
var router = express.Router();

const clientes = [];

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

const verificarUsuario = (req, res, next) => {
  const usuario = req.headers.usuario;
  if (usuario === "admin") {
    next();
  } else {
    res.status(401).send("Usuario no autorizado!!");
  }
};

const validarCliente = (req, res, next) => {
  const { nombre, correo, edad, ciudad } = req.body;
  if (!nombre || !correo || !edad || !ciudad) {
    return res.status(400).json({ mensaje: "Todos los campos (nombre, correo, edad, ciudad) son obligatorios." });
  }
  next();
};

// Rutas
router.get('/', medirTiempo, verificarUsuario, (req, res) => {
  const ciudad = req.query.ciudad;
  if (ciudad) {
    return res.json(clientes.filter(c => c.ciudad === ciudad));
  }
  res.json(clientes);
});

router.get('/:id', medirTiempo, verificarUsuario, (req, res) => {
  const cliente = clientes.find(c => c.id === parseInt(req.params.id));
  if (!cliente) return res.status(404).json({ mensaje: "Cliente no encontrado" });
  res.json(cliente);
});

router.post('/', medirTiempo, datosPeticion, verificarUsuario, validarCliente, (req, res) => {
  const nuevoCliente = {
    id: clientes.length + 1,
    nombre: req.body.nombre,
    correo: req.body.correo,
    edad: parseInt(req.body.edad),
    ciudad: req.body.ciudad
  };
  clientes.push(nuevoCliente);
  res.status(201).json({ mensaje: "Cliente creado exitosamente", cliente: nuevoCliente });
});

router.put('/:id', medirTiempo, datosPeticion, verificarUsuario, validarCliente, (req, res) => {
  const cliente = clientes.find(c => c.id === parseInt(req.params.id));
  if (!cliente) return res.status(404).json({ mensaje: "Cliente no encontrado" });

  cliente.nombre = req.body.nombre;
  cliente.correo = req.body.correo;
  cliente.edad = parseInt(req.body.edad);
  cliente.ciudad = req.body.ciudad;

  res.json({ mensaje: "Cliente actualizado correctamente", cliente });
});

router.delete('/:id', medirTiempo, verificarUsuario, (req, res) => {
  const indice = clientes.findIndex(c => c.id === parseInt(req.params.id));
  if (indice === -1) return res.status(404).json({ mensaje: "Cliente no encontrado" });

  const eliminado = clientes.splice(indice, 1);
  res.json({ mensaje: "Cliente eliminado", cliente: eliminado[0] });
});

module.exports = router;