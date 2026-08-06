import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import { config } from './config/index.js';
import routes from './routes/index.js';
import { errorHandler } from './middleware/errorMiddleware.js';
import { metricsMiddleware } from './middleware/metricsMiddleware.js';
import { getMetrics, getContentType } from './utils/metrics.js';

const app = express();

// Security Middleware
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);

// CORS configuration
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl)
      if (!origin) return callback(null, true);
      if (config.corsOrigin.indexOf(origin) !== -1 || config.corsOrigin.includes('*')) {
        callback(null, true);
      } else {
        callback(null, true); // Dev fallback
      }
    },
    credentials: true,
  })
);

// Request Parsing & Compression
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use(compression());

// Logging Middleware (Structured for Loki Log Ingestion)
app.use(morgan(config.env === 'production' ? 'combined' : 'dev'));

// Metrics Middleware (Prometheus telemetry)
app.use(metricsMiddleware);

// Health Check Endpoint (For Kubernetes / AWS / Docker Health Probes)
app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'UP',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    service: 'cloudnotes-backend',
  });
});

// Prometheus Metrics Telemetry Endpoint
app.get('/metrics', async (_req, res) => {
  try {
    res.set('Content-Type', getContentType());
    res.end(await getMetrics());
  } catch (ex) {
    res.status(500).end(ex);
  }
});

// API Routes
app.use('/api', routes);

// 404 Route Handler
app.use('*', (_req, res) => {
  res.status(404).json({
    success: false,
    error: 'Requested API endpoint not found',
  });
});

// Global Error Handler
app.use(errorHandler);

export default app;
