const Model = require('../model/moviemodel');

const getMovies = async () => {
  // eslint-disable-next-line no-return-await
  return await Model.find({});
};

const saveMovieDetails = async (movieData) => {
  const newMovie = new Model(movieData);
  // eslint-disable-next-line no-return-await
  return await newMovie.save();
};

const updateMovieDetails = async (movieData, movieId) => {
  // eslint-disable-next-line no-return-await
  return await Model.findOneAndUpdate({ id: movieId }, movieData, {
    new: true,
    runValidators: true,
  });
};

const updateMovieDetailsByMongoId = async (movieData, movieId) => {
  // eslint-disable-next-line no-return-await
  return await Model.findOneAndUpdate({ _id: movieId }, movieData, {
    new: true,
    runValidators: true,
  });
};

const deleteMovieByMongoId = async (movieId) => {
  // eslint-disable-next-line no-return-await
  return await Model.findOneAndDelete({ _id: movieId });
};

const deleteMovieById = async (movieId) => {
  // eslint-disable-next-line no-return-await
  return await Model.findOneAndDelete({ id: movieId });
};

const getMoviesById = async (movieId) => {
  // eslint-disable-next-line no-return-await
  return await Model.findOne({ id: movieId });
};

const getMoviesByMongoId = async (movieId) => {
  // eslint-disable-next-line no-return-await
  return await Model.findOne({ _id: movieId });
};

const generatePdf = async () => {
  // eslint-disable-next-line no-return-await
  return await Model.find({}).sort({ id: 1 });
};

module.exports = {
  getMovies,
  saveMovieDetails,
  updateMovieDetails,
  deleteMovieById,
  getMoviesById,
  getMoviesByMongoId,
  deleteMovieByMongoId,
  updateMovieDetailsByMongoId,
  generatePdf,
};
