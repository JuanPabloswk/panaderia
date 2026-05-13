import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import swaggerUi from 'swagger-ui-express';
import connectDB from './db.js';
import config from './config.js';
import { swaggerSpec } from './swagger.js';
import { errorHandler } from './middlewares/error.middleware.js';
import categoriaRoutes from './routes/categoria.routes.js';
import productoRoutes from './routes/producto.routes.js';
import authRoutes from './routes/auth.routes.js';
import clienteRoutes from './routes/cliente.routes.js';
import empleadoRoutes from './routes/empleado.routes.js';
import pedidoRoutes from './routes/pedido.routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

connectDB();

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, { explorer: true }));

app.get('/', (req, res) => {
  res.json({ ok: true, message: 'Servidor funcionando', docs: '/api-docs' });
});

app.get('/api/health', (req, res) => {
  res.json({ ok: true, uptime: process.uptime() });
});

app.use('/api/auth', authRoutes);
app.use('/api/categorias', categoriaRoutes);
app.use('/api/productos', productoRoutes);
app.use('/api/clientes', clienteRoutes);
app.use('/api/empleados', empleadoRoutes);
app.use('/api/pedidos', pedidoRoutes);

app.use((req, res) => {
  res.status(404).json({ ok: false, error: 'No encontrado' });
});

app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`Servidor en http://localhost:${config.port}`);
  console.log(`Documentación: http://localhost:${config.port}/api-docs`);
});
