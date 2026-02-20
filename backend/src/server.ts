import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import healthRoutes from './routes/health.js';

const app: Application = express();
const PORT = process.env.PORT || 3001;

app.use(helmet());
app.use(cors({ origin: (process.env.VITE_CORS_ORIGIN || 'http://localhost:3000,http://localhost:5173').split(',') }));
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/health', healthRoutes);

app.listen(PORT, () => {
  console.log(`✅ AETHERIS Backend listening on http://localhost:${PORT}`);
  console.log(`   Supabase connected: ${process.env.VITE_SUPABASE_URL}`);
});
