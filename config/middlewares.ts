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

module.exports.settings = {
  cors: {
    origin: ['http://localhost:8080'], // Frontend URL
    headers: ['Content-Type', 'Authorization'],
  },
};
