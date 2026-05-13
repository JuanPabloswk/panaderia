require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./db');
const morgan = require('morgan');
const productosRoutes = require('./routes/productos.routes');
const pedidosRoutes = require('./routes/pedidos.routes');
const authRoutes = require('./routes/auth.routes');
const { verificarToken } = require('./middleware/authMiddleware');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

const app = express();

const PORT = Number(process.env.PORT) || 4000;

const corsOptions = {
  origin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173',
  credentials: true,
};

app.use(morgan('dev'));
app.use(cors(corsOptions));
app.use(express.json());

app.use('/api/productos', productosRoutes);
app.use('/api/pedidos', pedidosRoutes);
app.use('/api/auth', authRoutes);

app.get('/api/me', verificarToken, (req, res) => {
  const u = req.user || {};
  res.json({
    ok: true,
    user: {
      id: u.id,
      tipo: u.tipo,
      rol: u.rol ?? u.role,
      role: u.role ?? u.rol,
      email: u.email,
      username: u.username,
      primerNombre: u.primerNombre,
      apellido: u.apellido,
      permisos: u.permisos,
    },
  });
});

app.get('/', (req, res) => {
  res.json({ ok: true, message: 'Servidor funcionando' });
});

app.get('/api/health', (req, res) => {
  res.json({ ok: true, uptime: process.uptime() });
});

app.use(notFound);
app.use(errorHandler);

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Servidor en http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
