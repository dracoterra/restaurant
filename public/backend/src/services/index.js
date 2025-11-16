const insights = require('./insights/insights.service');
const emails = require('./emails/emails.service');
const products = require('./products/products.service');
const menus = require('./menus/menus.service');
const settings = require('./settings/settings.service');
const pages = require('./pages/pages.service');

module.exports = function (app) {
  app.configure(insights);
  app.configure(emails);
  app.configure(products);
  app.configure(menus);
  app.configure(settings);
  app.configure(pages);
};

