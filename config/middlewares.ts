module.exports = [
  'strapi::logger',
  'strapi::errors',
  'strapi::security',
  'strapi::cors',
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];


// test commit ob ich diesen commit in jira sehen kann
module.exports.settings = {
  cors: {
    origin: ['http://localhost:8080'], // Frontend URL
    headers: ['Content-Type', 'Authorization'],
  },
};
