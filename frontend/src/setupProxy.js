const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://user151920325-3gqeclu7.wormhole.vk-apps.com/',
      changeOrigin: true,
      pathRewrite: {
        '^/api/*': '/'
      }
    }),
  );
  app.use(
    '/images',
    createProxyMiddleware({
      target: 'https://user151920325-3gqeclu7.wormhole.vk-apps.com/',
      changeOrigin: true,
    }),
  );
};
