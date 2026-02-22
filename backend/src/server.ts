import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

// Routes
import healthRoutes from './routes/health.js';
import tradesRouter from './routes/trades.js';
import accountsRouter from './routes/accounts.js';
import auditRouter from './routes/audit.js';
import brokersRouter from './routes/brokers.js';

// Middleware
import { authMiddleware } from './middleware/auth.js';
import { errorHandler } from './middleware/errorHandler.js';
import { sendError } from './utils/responses.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env.local') });

const app: Application = express();
const PORT = process.env.PORT || 3001;

// ============================================================================
// SECURITY & PARSING MIDDLEWARE (execute first)
// ============================================================================
app.use(helmet());
app.use(
  cors({
    origin: (process.env.VITE_CORS_ORIGIN || 'http://localhost:3000,http://localhost:5173').split(','),
    credentials: true,
  })
);
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files
app.use(express.static(path.join(__dirname, '../public')));

// ============================================================================
// PUBLIC ROUTES (no auth required)
// ============================================================================
app.use('/health', healthRoutes);

// ============================================================================
// PROTECTED ROUTES (auth required)
// ============================================================================
// Apply auth middleware to all /api routes
app.use('/api/v1', authMiddleware);

app.use('/api/v1/trades', tradesRouter);
app.use('/api/v1/accounts', accountsRouter);
app.use('/api/v1/audit', auditRouter);
app.use('/api/v1/broker-sync', brokersRouter);

// ============================================================================
// 404 & ERROR HANDLERS (must be last)
// ============================================================================
// 404 handler
app.use((req: Request, res: Response) => {
  sendError(res, `Route not found: ${req.method} ${req.path}`, 404);
});

// Error handling middleware (must have 4 parameters!)
app.use(errorHandler);

// ============================================================================
// START SERVER
// ============================================================================
app.listen(PORT, () => {
  console.log(`✅ AETHERIS Backend listening on http://localhost:${PORT}`);
  console.log(`   Supabase connected: ${process.env.VITE_SUPABASE_URL}`);
  console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
});
