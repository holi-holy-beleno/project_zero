const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

var usersRouter = require('./routes/users');
var clientesRouter = require('./routes/clientes');
var productosRouter = require('./routes/productos');
var ventasRouter = require('./routes/ventas');

const app = express();

// Middlewares
app.use(cors({
  origin: 'http://localhost:5173',
  allowedHeaders: ['Content-Type', 'usuario']
}));

app.use(express.json());

// Rutas
app.use('/users', usersRouter);
app.use('/clientes', clientesRouter);
app.use('/productos', productosRouter);
app.use('/ventas', ventasRouter);

// Conexión mediante Pool
const db = mysql.createPool({
  host: process.env.MYSQLHOST || 'monorail.proxy.rlwy.net', // Reemplaza con tu Host Público de Railway
  user: process.env.MYSQLUSER || 'root',
  password: process.env.MYSQLPASSWORD || process.env.MYSQL_ROOT_PASSWORD || 'qVDWRfeVFVKTObnuMnDTBGeAZoLxtLbm',
  database: process.env.MYSQLDATABASE || process.env.MYSQL_DATABASE || 'railway',
  port: process.env.MYSQLPORT || 54321, // Reemplaza con tu Puerto Público (5 dígitos) de Railway
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: {
    rejectUnauthorized: false // Permite la conexión segura enviada desde Railway
  }
});

// Comprobar estado del Pool
db.getConnection((err, connection) => {
  if (err) {
    console.error('Error al conectar a MySQL en Railway:', err.message);
  } else {
    console.log('Conectado exitosamente a MySQL en Railway (Pool activo)');
    connection.release(); // Libera la conexión para que vuelva al pool
  }
});

// Servidor
app.listen(3000, () => {
  console.log('Servidor escuchando en http://localhost:3000');
});