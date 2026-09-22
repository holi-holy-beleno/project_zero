const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

var usersRouter = require('./routes/users');
var clientesRouter = require('./routes/clientes');
var productosRouter = require('./routes/productos');
var ventasRouter = require('./routes/ventas');

const app = express();

// 1. CORS flexible para desarrollo local y producción
app.use(cors()); 
app.use(express.json());

// 2. Rutas
app.use('/users', usersRouter);
app.use('/clientes', clientesRouter);
app.use('/productos', productosRouter);
app.use('/ventas', ventasRouter);

// 3. Pool con Red Interna de Railway + KeepAlive
const db = mysql.createPool({
  host: process.env.MYSQLHOST || 'localhost',
  user: process.env.MYSQLUSER || 'root',
  password: process.env.MYSQLPASSWORD || process.env.MYSQL_ROOT_PASSWORD,
  database: process.env.MYSQLDATABASE || process.env.MYSQL_DATABASE || 'railway',
  port: process.env.MYSQLPORT || 3306, // Puerto interno por defecto de MySQL en Railway
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true, // Evita que Railway o MySQL cierren la conexión por inactividad
  keepAliveInitialDelay: 10000
});

// Exportar el pool para que los archivos de rutas puedan reutilizarlo
module.exports = db;

// Comprobar estado del Pool
db.getConnection((err, connection) => {
  if (err) {
    console.error('Error al conectar a MySQL en Railway:', err.message);
  } else {
    console.log('Conectado exitosamente a MySQL en la red interna de Railway (Pool activo)');
    connection.release();
  }
});

// 4. Puerto dinámico requerido por Railway
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});