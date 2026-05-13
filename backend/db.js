const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.warn(
      'MONGODB_URI no definido; el servidor arranca sin base de datos.'
    );
    return;
  }

  mongoose.connection.on('connected', () => {
    console.log('Conectado a Mongo Atlas en DB:', mongoose.connection.name);
  });

  mongoose.connection.on('error', (err) => {
    console.error('Error de conexión:', err.message);
  });

  try {
    await mongoose.connect(uri);
    console.log('✅ DB connected');
  } catch (error) {
    console.error('Error al conectar a la base de datos:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
