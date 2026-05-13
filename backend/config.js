import dotenv from 'dotenv';
dotenv.config();

export default {
  port: Number(process.env.PORT) || 4000,
  mongodbUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET || 'panaderia_secret_key_dev_2024',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  uploadDir: 'uploads',
  maxFileSize: 5 * 1024 * 1024,
};
