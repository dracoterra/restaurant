const insights = require('./insights/insights.service');
const emails = require('./emails/emails.service');

module.exports = function (app) {
  app.configure(insights);
  app.configure(emails);
};

