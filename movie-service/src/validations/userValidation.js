const Joi = require('joi');
const { validateId } = require('./customValid');

const getMoviesBySchema = Joi.object({
  params: Joi.object({
    movieId: Joi.string().custom(validateId).required(),
  }),
});

const updateMovieBySchema = Joi.object({
  params: Joi.object({
    movieId: Joi.string().custom(validateId).required(),
  }),
  body: Joi.object({
    id: Joi.number().optional(),
    movieName: Joi.string().optional(),
    director: Joi.string().optional(),
    rating: Joi.number().min(0).max(10).optional(),
  }),
});

const deleteMoviesBySchema = Joi.object({
  params: Joi.object({
    movieId: Joi.string().custom(validateId).required(),
  }),
});

// const saveMoviesBySchema={
//   params:Joi.object().keys({
//     movieId: Joi.string().custom(validateId).required(),
//   })}

// const getMovies={
//   params:Joi.object().keys({
//      movieId: Joi.string().custom(validateId).required(),
//   })}

module.exports = {
  getMoviesBySchema,
  deleteMoviesBySchema,
  updateMovieBySchema,
};
