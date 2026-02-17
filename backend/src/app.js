import dotenv from 'dotenv';
import cors from 'cors';
import express from 'express';

import pool from './config/db.js';
import sequelize from './config/sequelize.js';

import authRoutes from './routes/auth.routes.js';
import adminRoutes from './routes/admin.routes.js';
import managerRoutes from './routes/manager.routes.js';
import employeeRoutes from './routes/employee.routes.js';
import setupRoutes from './routes/setup.routes.js';
import './models/index.js';

dotenv.config();

const app = express();

app.use(express.json());

app.use(cors({
  origin: ['http://localhost:3000'],
  credentials: true
}));

app.use('/api/setup', setupRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/manager', managerRoutes);
app.use('/api/materials', employeeRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    console.log('🔌 Connecting to database...');

    await pool.query('SELECT 1');
    console.log('✅ MySQL pool connected');

    await sequelize.authenticate();
    console.log('✅ Sequelize connected');

    await sequelize.sync(); // DEV only
    console.log('✅ Models synchronized');

    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });

  } catch (err) {
    console.error('❌ Database connection failed:', err);
    process.exit(1);
  }
};

startServer();
