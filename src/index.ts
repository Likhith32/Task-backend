import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

dotenv.config();

import authRoutes from './routes/auth';
import collegeRoutes from './routes/colleges';
import compareRoutes from './routes/compare';
import predictorRoutes from './routes/predictor';
import searchRoutes from './routes/search';
import savedRoutes from './routes/saved';
import qaRoutes from './routes/qa';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200 // Max 200 requests per IP per window
}));

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/colleges', collegeRoutes);
app.use('/api/compare', compareRoutes);
app.use('/api/predictor', predictorRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/saved', savedRoutes);
app.use('/api/qa', qaRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

export default app;
