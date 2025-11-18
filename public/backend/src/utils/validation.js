/**
 * Utilidades de validación usando Joi
 * Validación de inputs para prevenir ataques y errores
 */

const Joi = require('joi');
const logger = require('../logger');

// Esquemas de validación comunes
const schemas = {
  // Validación de email
  email: Joi.string().email().max(255).required(),
  
  // Validación de teléfono (formato flexible)
  phone: Joi.string().pattern(/^[\d\s\-\+\(\)]+$/).min(7).max(20).required(),
  
  // Validación de nombre
  name: Joi.string().trim().min(2).max(100).required(),
  
  // Validación de mensaje
  message: Joi.string().trim().min(10).max(5000).required(),
  
  // Validación de slug
  slug: Joi.string().pattern(/^[a-z0-9-]+$/).min(1).max(100),
  
  // Validación de fecha
  date: Joi.string().isoDate(),
  
  // Validación de hora
  time: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  
  // Validación de número de personas
  person: Joi.number().integer().min(1).max(20)
};

// Esquemas compuestos para formularios
const formSchemas = {
  // Formulario de contacto
  contact: Joi.object({
    name: schemas.name,
    email: schemas.email,
    phone: schemas.phone.optional(),
    message: schemas.message,
    type: Joi.string().valid('contact', 'inquiry').optional()
  }),
  
  // Formulario de reserva
  reservation: Joi.object({
    name: schemas.name,
    email: schemas.email,
    phone: schemas.phone,
    date: schemas.date.required(),
    time: schemas.time.required(),
    person: schemas.person.required()
  })
};

/**
 * Validar datos contra un esquema
 * @param {object} data - Datos a validar
 * @param {Joi.Schema} schema - Esquema de validación
 * @param {object} options - Opciones de validación
 * @returns {object} - Datos validados y sanitizados
 * @throws {Error} - Si la validación falla
 */
function validate(data, schema, options = {}) {
  const { abortEarly = false, stripUnknown = true } = options;
  
  const { error, value } = schema.validate(data, {
    abortEarly,
    stripUnknown,
    allowUnknown: false
  });
  
  if (error) {
    const errors = error.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message
    }));
    
    logger.warn('Validación fallida:', {
      errors,
      data: Object.keys(data)
    });
    
    const validationError = new Error('Datos de entrada inválidos');
    validationError.statusCode = 400;
    validationError.errors = errors;
    throw validationError;
  }
  
  return value;
}

/**
 * Middleware de validación para Express
 * @param {Joi.Schema} schema - Esquema de validación
 * @param {string} source - Fuente de datos ('body', 'query', 'params')
 * @returns {Function} - Middleware de Express
 */
function validateMiddleware(schema, source = 'body') {
  return (req, res, next) => {
    try {
      const data = req[source];
      const validated = validate(data, schema);
      req[source] = validated; // Reemplazar con datos validados
      next();
    } catch (error) {
      if (error.statusCode === 400) {
        res.status(400).json({
          error: {
            message: error.message,
            statusCode: 400,
            errors: error.errors
          }
        });
      } else {
        next(error);
      }
    }
  };
}

module.exports = {
  validate,
  validateMiddleware,
  schemas,
  formSchemas
};

