module.exports = {
  apps: [
    {
      name: 'finance-control-backend',
      script: './backend/dist/server.js',
      cwd: '/var/www/finance-control/',
      env: {
        NODE_ENV: 'production',
        PORT: 3001
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G'
    },
    {
      name: 'finance-control-frontend',
      script: 'serve',
      env: {
        PM2_SERVE_PATH: './frontend/dist',
        PM2_SERVE_PORT: 3000,
        PM2_SERVE_SPA: 'true',
        PM2_SERVE_HOMEPAGE: '/index.html'
      },
      cwd: '/var/www/finance-control/'
    }
  ]
};
