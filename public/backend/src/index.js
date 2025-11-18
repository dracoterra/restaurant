const feathers = require('@feathersjs/feathers');
const express = require('@feathersjs/express');
const configuration = require('@feathersjs/configuration');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const logger = require('./logger');
const middleware = require('./middleware');
const services = require('./services');
const appHooks = require('./app.hooks');
const channels = require('./channels');

require('dotenv').config();

const app = express(feathers());

// Load app configuration
app.configure(configuration());

// Enable security, CORS, compression, favicon and body parsing
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable REST services
app.configure(express.rest());

// Configure services and real-time features (BEFORE static and 404 handler)
app.configure(services);
app.configure(channels);

// Configure middleware
app.configure(middleware);

// Host the public folder (AFTER services)
app.use('/', express.static('public'));

// Middleware para logging de acceso HTTP
app.use((req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const responseTime = Date.now() - start;
    logger.access(req, res, responseTime);
  });
  
  next();
});

// Configure a middleware for 404s and the error handler
app.use(express.notFound());
app.use(express.errorHandler({ logger }));

app.hooks(appHooks);

const port = process.env.PORT || 3030;
// Escuchar en todas las interfaces (0.0.0.0) para permitir conexiones IPv4 e IPv6
const host = process.env.HOST || '0.0.0.0';

const server = app.listen(port, host, () => {
  logger.info(`Feathers application started on http://${host}:${port}`);
  logger.info(`Feathers application accessible at http://localhost:${port}`);
});

module.exports = app;

