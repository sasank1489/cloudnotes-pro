import client from 'prom-client';

// Collect default metrics (CPU, Memory, Event Loop)
client.collectDefaultMetrics({ prefix: 'cloudnotes_' });

// HTTP Request Duration Histogram
export const httpRequestDurationMicroseconds = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'code'],
  buckets: [0.05, 0.1, 0.3, 0.5, 1, 1.5, 2, 5],
});

// Total Requests Counter
export const httpRequestsTotal = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'code'],
});

export const getMetrics = async () => {
  return await client.register.metrics();
};

export const getContentType = () => {
  return client.register.contentType;
};
