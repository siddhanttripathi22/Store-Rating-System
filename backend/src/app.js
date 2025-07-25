import express, { json, urlencoded } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import sequelize from './config/database.js';
import authRoutes from './routes/auth.js';
import adminRoutes from './routes/admin.js';
import userRoutes from './routes/user.js';
import storeOwnerRoutes from './routes/storeOwner.js';
import User from './models/user.js';

dotenv.config();
const app = express();

process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
});


// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(json());
app.use(urlencoded({ extended: true }));

// Routes
try {
  app.use('/api/auth', authRoutes);
  console.log('✅ authRoutes mounted');

  app.use('/api/admin', adminRoutes);
  console.log('✅ adminRoutes mounted');

  app.use('/api/user', userRoutes);
  console.log('✅ userRoutes mounted');

  app.use('/api/store-owner', storeOwnerRoutes);
  console.log('✅ storeOwnerRoutes mounted');
} catch (error) {
  console.error('❌ Route mounting error:', error.message);
  throw error;
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running!' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

// Database connection and server start
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully.');

    await sequelize.sync({ force: false });
    console.log('Database synchronized.');

    // Create default admin user
    const adminExists = await User.findOne({ where: { email: 'admin@system.com' } });

    if (!adminExists) {
      await User.create({
        name: 'System Administrator Account',
        email: 'admin@system.com',
        password: 'Admin@123',
        address: '123 Admin Street, System City, SC 12345',
        role: 'admin'
      });
      console.log('Default admin user created.');
    }

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to start server:', error);
  }
};

startServer();
