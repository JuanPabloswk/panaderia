require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const app = express();
const PORT = Number(process.env.PORT) || 4000;

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ ok: true, message: 'Servidor funcionando' });
});

app.get('/api/health', (req, res) => {
  res.json({ ok: true, uptime: process.uptime() });
});

app.use((req, res) => {
  res.status(404).json({ ok: false, error: 'No encontrado' });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ ok: false, error: 'Error interno del servidor' });
});

app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`);
});
