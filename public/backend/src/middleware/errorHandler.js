const { BadRequest, NotFound, GeneralError } = require('@feathersjs/errors');
const logger = require('../logger');

/**
 * Middleware para transformar errores a formato estándar
 */
module.exports = function errorHandler(error, req, res, next) {
  let statusCode = 500;
  let message = 'Error interno del servidor';

  if (error.statusCode) {
    statusCode = error.statusCode;
    message = error.message;
  } else if (error.response) {
    // Error de GraphQL
    statusCode = error.response.status || 500;
    message = error.response.errors?.[0]?.message || error.message;
  } else if (error.message) {
    message = error.message;
    
    // Mapear mensajes comunes a códigos de estado
    if (error.message.includes('not found') || error.message.includes('no encontrado')) {
      statusCode = 404;
    } else if (error.message.includes('timeout')) {
      statusCode = 504;
    } else if (error.message.includes('unauthorized') || error.message.includes('no autorizado')) {
      statusCode = 401;
    }
  }

  logger.error('Error en middleware:', {
    statusCode,
    message,
    path: req.path,
    method: req.method,
    error: error.stack
  });

  res.status(statusCode).json({
    error: {
      message,
      statusCode,
      path: req.path
    }
  });
};

