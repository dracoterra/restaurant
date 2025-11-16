const insights = require('./insights/insights.service');
const emails = require('./emails/emails.service');
const products = require('./products/products.service');

module.exports = function (app) {
  app.configure(insights);
  app.configure(emails);
  app.configure(products);
};

