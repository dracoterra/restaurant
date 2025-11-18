const rateLimiters = require('./rateLimiter');
const errorHandler = require('./errorHandler');

module.exports = function (app) {
  // Rate limiting - aplicar antes de otras rutas
  // Rate limiter general para todas las rutas
  app.use(rateLimiters.general);
  
  // Rate limiter estricto para métodos de escritura
  app.use((req, res, next) => {
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
      return rateLimiters.strict(req, res, next);
    }
    next();
  });
  
  // Rate limiter específico para contacto y reservas
  app.use('/contact', rateLimiters.contact);
  app.use('/reservations', rateLimiters.contact);
  
  // Error handler (se aplicará después de las rutas)
  // Se configura en index.js después de las rutas
};

