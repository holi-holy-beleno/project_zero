const express = require('express');
const cors = require('cors');
const db = require('./db'); // Importa la conexión desde db.js

var usersRouter = require('./routes/users');
var clientesRouter = require('./routes/clientes');
var productosRouter = require('./routes/productos');
var ventasRouter = require('./routes/ventas');

const app = express();

app.use(cors());
app.use(express.json());

// Rutas
app.use('/users', usersRouter);
app.use('/clientes', clientesRouter);
app.use('/productos', productosRouter);
app.use('/ventas', ventasRouter);

// Comprobar estado del Pool
db.getConnection((err, connection) => {
  if (err) {
    console.error('Error al conectar a MySQL en Railway:', err.message);
  } else {
    console.log('Conectado exitosamente a MySQL en Railway (Pool activo)');
    connection.release();
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});