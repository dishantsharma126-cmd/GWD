import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import goalRoutes from './routes/goals.js';
import routineRoutes from './routes/routines.js';
import logRoutes from './routes/logs.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));
app.use(express.json());

// Routes
app.use('/api/goals', goalRoutes);
app.use('/api/routines', routineRoutes);
app.use('/api/logs', logRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'GWD Backend Running 🔥' }));

mongoose
  .connect(process.env.MONGO_URI || 'mongodb://localhost:27017/gwd')
  .then(() => {
    console.log('✅ MongoDB Connected');
    app.listen(PORT, () => console.log(`🚀 GWD Server running on port ${PORT}`));
  })
  .catch((err) => console.error('❌ MongoDB Error:', err));
