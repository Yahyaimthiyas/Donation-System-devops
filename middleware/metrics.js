const client = require('prom-client');

// Create a Registry which registers the metrics
const register = new client.Registry();

// Add a default label which is added to all metrics
register.setDefaultLabels({
  app: 'donation-system'
});

// Enable the collection of default metrics
client.collectDefaultMetrics({ register });

/**
 * Professional Metrics Middleware
 * Tracks HTTP request performance (duration, status codes, methods)
 */
const requestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.5, 1, 2, 5]
});

register.registerMetric(requestDuration);

// Custom Business Metrics
const donationsTotal = new client.Counter({
  name: 'donations_total_collected',
  help: 'Total number of successful donations collected',
  labelNames: ['type']
});

register.registerMetric(donationsTotal);

const metricsMiddleware = (req, res, next) => {
  const start = process.hrtime();

  res.on('finish', () => {
    const duration = process.hrtime(start);
    const durationInSeconds = duration[0] + duration[1] / 1e9;
    
    // Normalize route for grouping
    const route = req.route ? req.route.path : req.path;

    requestDuration.observe(
      { method: req.method, route, status_code: res.statusCode },
      durationInSeconds
    );
  });

  next();
};

/**
 * Controller for metrics endpoint
 */
const getMetrics = async (req, res) => {
  res.setHeader('Content-Type', register.contentType);
  res.end(await register.metrics());
};

module.exports = {
  metricsMiddleware,
  getMetrics,
  donationsTotal // Exported to be used in controllers
};
