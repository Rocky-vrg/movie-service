module.exports = {
  apps: [
    {
      name: 'api-gateway-service',
      script: './api-gateway-service/index.js',
      watch: true,
      // ignore_watch: ['node_modules', 'logs'],
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        HTTPS_PORT: 443,
        // other env variables
      },
    },
    {
      name: 'auth-services',
      script: './auth-services/src/index.js',
      watch: true,
      // ignore_watch: ['node_modules', 'logs'],
      instances: 1,
      exec_mode: 'fork',
    },
    {
      name: 'movie-service',
      script: './movie-service/src/index.js',
      watch: true,
      // ignore_watch: ['node_modules', 'logs'],
      instances: 1,
      exec_mode: 'fork',
    },
    {
      name: 'sample-service',
      script: './sample-service/index.js',
      watch: true,
      ignore_watch: ['node_modules', 'logs'],
      instances: 1,
      exec_mode: 'fork',
    },
  ],
};
