const mjml = require('mjml');
const puppeteer = require('puppeteer');
const logger = require('../../logger');

class EmailsService {
  constructor(options) {
    this.options = options || {};
  }

  async find(params) {
    // Return list of available email templates
    return {
      data: [
        { id: 'welcome', name: 'Welcome Email' },
        { id: 'newsletter', name: 'Newsletter' },
        { id: 'notification', name: 'Notification' }
      ],
      total: 3
    };
  }

  async get(id, params) {
    // Get email template by ID
    const templates = {
      welcome: this.getWelcomeTemplate(),
      newsletter: this.getNewsletterTemplate(),
      notification: this.getNotificationTemplate()
    };

    const template = templates[id];
    if (!template) {
      throw new Error('Template not found');
    }

    return template;
  }

  async create(data, params) {
    // Generate email from MJML template
    const { template, data: templateData } = data;
    
    try {
      const mjmlTemplate = this.getTemplate(template, templateData);
      const { html, errors } = mjml(mjmlTemplate);
      
      if (errors && errors.length > 0) {
        logger.warn('MJML errors:', errors);
      }

      return {
        html,
        errors: errors || []
      };
    } catch (error) {
      logger.error('Error generating email:', error);
      throw error;
    }
  }

  async update(id, data, params) {
    // Generate PDF from HTML
    const { html } = data;
    
    try {
      const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
      
      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: 'networkidle0' });
      
      const pdf = await page.pdf({
        format: 'A4',
        printBackground: true
      });
      
      await browser.close();
      
      return {
        pdf: pdf.toString('base64'),
        format: 'base64'
      };
    } catch (error) {
      logger.error('Error generating PDF:', error);
      throw error;
    }
  }

  getTemplate(template, data = {}) {
    const templates = {
      welcome: this.getWelcomeTemplate(),
      newsletter: this.getNewsletterTemplate(),
      notification: this.getNotificationTemplate()
    };

    let mjmlTemplate = templates[template] || templates.welcome;
    
    // Replace placeholders
    Object.keys(data).forEach(key => {
      mjmlTemplate = mjmlTemplate.replace(new RegExp(`{{${key}}}`, 'g'), data[key]);
    });

    return mjmlTemplate;
  }

  getWelcomeTemplate() {
    return `
      <mjml>
        <mj-body>
          <mj-section>
            <mj-column>
              <mj-text font-size="20px" color="#F45E43">Welcome!</mj-text>
              <mj-text>Thank you for joining us.</mj-text>
            </mj-column>
          </mj-section>
        </mj-body>
      </mjml>
    `;
  }

  getNewsletterTemplate() {
    return `
      <mjml>
        <mj-body>
          <mj-section>
            <mj-column>
              <mj-text font-size="20px" color="#F45E43">Newsletter</mj-text>
              <mj-text>{{content}}</mj-text>
            </mj-column>
          </mj-section>
        </mj-body>
      </mjml>
    `;
  }

  getNotificationTemplate() {
    return `
      <mjml>
        <mj-body>
          <mj-section>
            <mj-column>
              <mj-text font-size="20px" color="#F45E43">Notification</mj-text>
              <mj-text>{{message}}</mj-text>
            </mj-column>
          </mj-section>
        </mj-body>
      </mjml>
    `;
  }
}

module.exports = function (app) {
  app.use('/emails', new EmailsService());
  
  const service = app.service('emails');
  service.hooks({
    before: {
      all: [],
      find: [],
      get: [],
      create: [],
      update: []
    },
    after: {
      all: [],
      find: [],
      get: [],
      create: [],
      update: []
    },
    error: {
      all: [],
      find: [],
      get: [],
      create: [],
      update: []
    }
  });
};

