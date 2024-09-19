const express = require('express');
const helmet = require('helmet');
const path = require('path');
const swaggerUI = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const apiRoutes = require('./src/routes/gatewayroute');
const customLimiter = require('./src/middlewares/ratelimiter');
const createHttpsServer = require('./src/utils/https.Server');

require('dotenv').config({ path: path.join(__dirname, '../.env') });
require('./src/config/logger');

const app = express();
const port = process.env.HTTPS_PORT;
app.use(helmet());

app.use(customLimiter);

app.use('/api', apiRoutes);

app.get('/', apiRoutes);

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Movie Api',
      version: '1.0.0',
      description: 'A simple Express Movie API',
    },
    servers: [
      {
        url: `https://localhost:${port}`,
      },
    ],
  },
  apis: [
    './src/routes/gatewayroute.js',
    '../movie-service/src/routes/movierouter.js',
    '../auth-services/src/routes/authRoute.js',
    // '../auth-services/src/validations/authValidation.js',
    '../sample-service/index.js',
  ],
};

const specs = swaggerJsDoc(options);

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(specs));

const httpsServer = createHttpsServer(app);
httpsServer.listen(port, () => {
  console.log(`HTTPS Server running on https://localhost:${port}`); // eslint-disable-line no-console
});
