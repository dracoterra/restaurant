const logger = require('../../logger');
const nodemailer = require('nodemailer');

class ContactService {
  constructor(options) {
    this.options = options || {};
  }

  async create(data, params) {
    try {
      const { name, email, phone, message, type = 'contact' } = data;

      // Validar datos requeridos
      if (!name || !email || !message) {
        throw new Error('Nombre, email y mensaje son requeridos');
      }

      // Validar formato de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error('Email inválido');
      }

      // Aquí puedes implementar el envío de email
      // Por ahora, solo logueamos y guardamos en la respuesta
      logger.info('Nuevo mensaje de contacto:', {
        type,
        name,
        email,
        phone,
        message: message.substring(0, 100) + '...'
      });

      // En producción, aquí enviarías el email usando nodemailer o un servicio de email
      // Ejemplo:
      // await this.sendEmail({
      //   to: process.env.CONTACT_EMAIL || 'contact@restaurant.com',
      //   subject: `Nuevo mensaje de ${type}: ${name}`,
      //   html: this.formatContactEmail({ name, email, phone, message })
      // });

      return {
        success: true,
        message: 'Mensaje enviado exitosamente',
        data: {
          id: Date.now().toString(),
          type,
          name,
          email,
          phone,
          createdAt: new Date().toISOString()
        }
      };
    } catch (error) {
      logger.error('Error en contacto:', error);
      throw new Error(error.message || 'Error al enviar el mensaje');
    }
  }

  formatContactEmail(data) {
    return `
      <h2>Nuevo mensaje de contacto</h2>
      <p><strong>Nombre:</strong> ${data.name}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Teléfono:</strong> ${data.phone || 'No proporcionado'}</p>
      <p><strong>Mensaje:</strong></p>
      <p>${data.message}</p>
    `;
  }
}

module.exports = function (app) {
  app.use('/contact', new ContactService());
  
  const service = app.service('contact');
  service.hooks({
    before: {
      create: []
    },
    after: {
      create: []
    },
    error: {
      create: []
    }
  });
};

