export default {
  dev: {
    '/api.farm/': {
      target: 'https://api.daosuan.net/',
      changeOrigin: true,
      pathRewrite: {
        '^/api.farm': '',
      },
    },
  },
  test: {
    '/api/': {
      target: 'http://localhost:8001',
      changeOrigin: true,
      pathRewrite: {
        '^': '',
      },
    },
  },
  pre: {
    '/api/': {
      target: 'your pre url',
      changeOrigin: true,
      pathRewrite: {
        '^': '',
      },
    },
  },
};
