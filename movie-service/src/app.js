require('./config/logger');
const express = require('express');
require('express-async-errors');
const cors = require('cors');
const route = require('./routes/movierouter');
const Notfound = require('./middleware/notFound');
const errorHandler = require('./middleware/error');
// const requireAuth = require('./middleware/authMiddleware');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.set('trust proxy', true);

app.use('/' /*  requireAuth */, route);

app.use(Notfound);
app.use(errorHandler);

module.exports = app;
