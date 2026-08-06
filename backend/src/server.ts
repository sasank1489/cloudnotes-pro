import app from './app.js';
import { config } from './config/index.js';
import { connectDatabase } from './database/connection.js';

const startServer = async () => {
  try {
    await connectDatabase();

    const server = app.listen(config.port, () => {
      console.log(`====================================================`);
      console.log(` 🚀 CloudNotes Pro API Server Running`);
      console.log(` 📍 Environment: ${config.env}`);
      console.log(` 🌐 URL: http://localhost:${config.port}`);
      console.log(` 🏥 Health Check: http://localhost:${config.port}/health`);
      console.log(` 📊 Metrics: http://localhost:${config.port}/metrics`);
      console.log(`====================================================`);
    });

    // Graceful Shutdown Handling (DevOps Best Practice)
    const gracefulShutdown = (signal: string) => {
      console.log(`Received ${signal}. Shutting down HTTP server gracefully...`);
      server.close(() => {
        console.log('HTTP server closed.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
