require('./config/logger');
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const Notfound = require('./middleware/notFound');
const authRoutes = require('./routes/authRoute');
require('./config/passport');
const errorHandler = require('./middleware/error');

const app = express();
// const config=require('./config/config')

app.use(
  session({
    secret: 'cats',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  }),
);

app.use(passport.initialize());
app.use(passport.session());

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

app.use('/', authRoutes);

app.use(Notfound);
app.use(errorHandler);

module.exports = app;
