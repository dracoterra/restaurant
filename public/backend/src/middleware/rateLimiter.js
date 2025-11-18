/**
 * Rate Limiting Middleware
 * Protege el backend contra abuso y ataques DDoS
 */

const rateLimit = require('express-rate-limit');
const logger = require('../logger');

// Rate limiter general para todas las rutas
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Máximo 100 requests por IP en 15 minutos
  message: {
    error: {
      message: 'Demasiadas peticiones desde esta IP, por favor intenta más tarde.',
      statusCode: 429
    }
  },
  standardHeaders: true, // Retorna rate limit info en headers `RateLimit-*`
  legacyHeaders: false, // Deshabilita `X-RateLimit-*` headers
  handler: (req, res) => {
    logger.warn(`Rate limit excedido para IP: ${req.ip}, Path: ${req.path}`);
    res.status(429).json({
      error: {
        message: 'Demasiadas peticiones desde esta IP, por favor intenta más tarde.',
        statusCode: 429,
        retryAfter: Math.ceil(req.rateLimit.resetTime / 1000)
      }
    });
  },
  skip: (req) => {
    // Saltar rate limiting en desarrollo local
    return process.env.NODE_ENV === 'development' && req.ip === '::1';
  }
});

// Rate limiter estricto para endpoints de escritura (POST, PUT, DELETE)
const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 20, // Máximo 20 requests por IP en 15 minutos
  message: {
    error: {
      message: 'Demasiadas peticiones de escritura, por favor intenta más tarde.',
      statusCode: 429
    }
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
  handler: (req, res) => {
    logger.warn(`Rate limit estricto excedido para IP: ${req.ip}, Path: ${req.path}, Method: ${req.method}`);
    res.status(429).json({
      error: {
        message: 'Demasiadas peticiones de escritura, por favor intenta más tarde.',
        statusCode: 429,
        retryAfter: Math.ceil(req.rateLimit.resetTime / 1000)
      }
    });
  }
});

// Rate limiter para endpoints de contacto y reservas
const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 5, // Máximo 5 formularios por IP por hora
  message: {
    error: {
      message: 'Demasiados envíos de formulario, por favor intenta más tarde.',
      statusCode: 429
    }
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn(`Rate limit de contacto excedido para IP: ${req.ip}`);
    res.status(429).json({
      error: {
        message: 'Demasiados envíos de formulario, por favor intenta más tarde.',
        statusCode: 429,
        retryAfter: Math.ceil(req.rateLimit.resetTime / 1000)
      }
    });
  }
});

module.exports = {
  general: generalLimiter,
  strict: strictLimiter,
  contact: contactLimiter
};

