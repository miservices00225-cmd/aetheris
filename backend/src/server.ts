import dotenv from 'dotenv';
import path from 'path';
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

dotenv.config({ path: path.join(process.cwd(), '.env.local') });

export const createApp = (): Application => {
  const app: Application = express();

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

  // Serve static files (only in production)
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(process.cwd(), 'public')));
  }

  // ============================================================================
  // PUBLIC ROUTES (no auth required)
  // ============================================================================
  app.use('/health', healthRoutes);

  // ============================================================================
  // PROTECTED ROUTES (auth required)
  // ============================================================================
  // Apply auth middleware to all /api routes
  // Use mock middleware in test mode, real Supabase auth in production
  let authMiddlewareToUse = authMiddleware;
  if (process.env.NODE_ENV === 'test') {
    // Dynamically import mock middleware for tests
    // This avoids circular dependency issues
    const mockAuth = async (req: any, res: any, next: any) => {
      try {
        const jwt = await import('jsonwebtoken');
        const authHeader = req.headers.authorization;

        if (!authHeader?.startsWith('Bearer ')) {
          res.status(401).json({ error: 'Missing or invalid authorization header' });
          return;
        }

        const token = authHeader.slice(7);
        const TEST_JWT_SECRET = 'test-secret-key-do-not-use-in-production';
        
        const decoded = jwt.verify(token, TEST_JWT_SECRET, { algorithms: ['HS256'] }) as any;
        req.user = {
          id: decoded.sub,
          email: `user-${decoded.sub.substring(0, 8)}@test.local`,
        };
        next();
      } catch (err) {
        res.status(401).json({ error: 'Invalid or expired token' });
      }
    };
    authMiddlewareToUse = mockAuth;
  }

  app.use('/api/v1', authMiddlewareToUse);

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

  return app;
};

// ============================================================================
// START SERVER (only if running directly, not imported for testing)
// ============================================================================
// Skip server startup in test environments
if (process.env.NODE_ENV !== 'test' && !process.argv.includes('--no-server')) {
  const app = createApp();
  const PORT = process.env.PORT || 3001;

  app.listen(PORT, () => {
    console.log(`✅ AETHERIS Backend listening on http://localhost:${PORT}`);
    console.log(`   Supabase connected: ${process.env.VITE_SUPABASE_URL}`);
    console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

// Export for testing
export const app = createApp();
