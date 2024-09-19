require('./config/logger');
const mongoose = require('mongoose');
const app = require('./app');
const config = require('./config/config');
const model = require('./model/moviemodel');
const movieData = require('../data/movies.json');

const start = async () => {
  try {
    await mongoose
      .connect(config.MONGO_URL)
      .then(() => console.log('Mongodb Connected')); // eslint-disable-line no-console
    // await model.deleteMany()
    const count = await model.estimatedDocumentCount();
    if (count === 0) {
      await model
        .create(movieData.movies)
        .then(() => console.log('Data Uploaded')); // eslint-disable-line no-console
    }
    app.listen(config.PORT, config.HOST, () => {
      console.log(`Server running on http://${config.HOST}:${config.PORT}`); // eslint-disable-line no-console
    });
    console.log('Success'); // eslint-disable-line no-console
  } catch (error) {
    console.log(error); // eslint-disable-line no-console
    process.exit(1);
  }
};

start();
