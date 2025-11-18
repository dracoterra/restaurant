const logger = require('../../logger');

class ReservationsService {
  constructor(options) {
    this.options = options || {};
  }

  async create(data, params) {
    try {
      const { name, email, phone, date, time, person } = data;

      // Validar datos requeridos
      if (!name || !email || !phone || !date || !time || !person) {
        throw new Error('Todos los campos son requeridos');
      }

      // Validar formato de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error('Email inválido');
      }

      // Validar fecha (debe ser futura)
      const reservationDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (reservationDate < today) {
        throw new Error('La fecha de reserva debe ser futura');
      }

      // Aquí puedes implementar la lógica de reserva
      // Por ejemplo, guardar en base de datos, enviar email de confirmación, etc.
      logger.info('Nueva reserva:', {
        name,
        email,
        phone,
        date,
        time,
        person
      });

      // En producción, aquí guardarías la reserva en una base de datos
      // y enviarías emails de confirmación

      return {
        success: true,
        message: 'Reserva realizada exitosamente. Te confirmaremos pronto.',
        data: {
          id: Date.now().toString(),
          name,
          email,
          phone,
          date,
          time,
          person,
          status: 'pending',
          createdAt: new Date().toISOString()
        }
      };
    } catch (error) {
      logger.error('Error en reserva:', error);
      throw new Error(error.message || 'Error al procesar la reserva');
    }
  }

  async find(params) {
    // Listar reservas (solo para admin en producción)
    return {
      data: [],
      total: 0
    };
  }

  async get(id, params) {
    // Obtener reserva por ID
    throw new Error('Not implemented');
  }
}

module.exports = function (app) {
  app.use('/reservations', new ReservationsService());
  
  const service = app.service('reservations');
  service.hooks({
    before: {
      create: [],
      find: [],
      get: []
    },
    after: {
      create: [],
      find: [],
      get: []
    },
    error: {
      create: [],
      find: [],
      get: []
    }
  });
};

