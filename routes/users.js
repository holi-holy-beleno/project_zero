var express = require('express');
var router = express.Router();

// Arreglo en memoria para usuarios
const usuarios = [
  { id: 1, nombre: "admin", pass: "123456" },
  { id: 2, nombre: "Juan", pass: "abcdef" }
];

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

const VdatosUsuarios = (req, res, next) => {
  if (!req.body.nombre) {
    return res.status(400).send("Falta el nombre de Usuario!!");
  }
  if (!req.body.pass) {
    return res.status(400).send("Falta la Contraseña!!");
  }
  next();
};

const verificarUsuario = (req, res, next) => {
  const usuario = req.headers.usuario;
  if (usuario === "admin") {
    next();
  } else {
    res.status(401).send("Usuario no autorizado!!");
  }
};

// 1. Obtener listado de usuarios (Protegido por cabecera)
router.get('/', medirTiempo, verificarUsuario, (req, res) => {
  res.json(usuarios);
});

// 2. Autenticación / Login de usuario
router.post('/login', medirTiempo, datosPeticion, VdatosUsuarios, (req, res) => {
  const { nombre, pass } = req.body;

  const usuarioEncontrado = usuarios.find(
    u => u.nombre.toLowerCase() === nombre.toLowerCase() && u.pass === pass
  );

  if (usuarioEncontrado) {
    return res.status(200).json({
      exito: true,
      mensaje: `¡Bienvenido, ${usuarioEncontrado.nombre}! Acceso concedido.`,
      usuario: { id: usuarioEncontrado.id, nombre: usuarioEncontrado.nombre }
    });
  }

  return res.status(401).json({
    exito: false,
    mensaje: "Usuario o contraseña incorrectos."
  });
});

// 3. Registrar un nuevo usuario
router.post('/', medirTiempo, datosPeticion, VdatosUsuarios, (req, res) => {
  const { nombre, pass } = req.body;

  const nuevoUsuario = {
    id: usuarios.length + 1,
    nombre,
    pass
  };

  usuarios.push(nuevoUsuario);

  res.status(201).json({
    mensaje: "Usuario registrado con éxito",
    usuario: { id: nuevoUsuario.id, nombre: nuevoUsuario.nombre }
  });
});

module.exports = router;