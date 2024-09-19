const PDFDocument = require('pdfkit');
const movieServices = require('../services/movieservice');
const AppError = require('../utils/appError');
const model = require('../model/moviemodel');

class MovieController {
  static async getMovies(req, res, next) {
    try {
      const movies = await movieServices.getMovies();
      res.status(200).json({
        status: 'success',
        statusCode: 200,
        message: 'Movies retrieved successfully',
        data: { movies },
      });
    } catch (error) {
      next(error);
    }
  }

  static async saveMovieDetails(req, res, next) {
    try {
      const existingMovie = await model.findOne({ id: req.body.id });
      if (existingMovie) {
        return next(new AppError('MovieId already exists', 404));
      }

      const newMovies = await movieServices.saveMovieDetails(req.body);
      return res.status(200).json({
        status: 'success',
        statusCode: 200,
        message: 'Movie saved Successfully',
        data: { movie: newMovies.toObject() },
      });
    } catch (error) {
      return next(error);
    }
  }

  static async updateMovieDetails(req, res, next) {
    const { movieId } = req.params;
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(movieId);

    try {
      let updateMovies;
      if (isObjectId) {
        updateMovies = await movieServices.updateMovieDetailsByMongoId(
          req.body,
          movieId,
        );
      } else {
        updateMovies = await movieServices.updateMovieDetails(
          req.body,
          movieId,
        );
      }

      if (!updateMovies) {
        return next(new AppError('Movie not Found', 404));
      }

      return res.status(200).json({
        status: 'success',
        statusCode: 200,
        message: 'Movie updated Successfully',
        data: { movie: updateMovies },
      });
    } catch (error) {
      return next(error);
    }
  }

  static async deleteMovieById(req, res, next) {
    const { movieId } = req.params;
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(movieId);

    try {
      let deletedmovies;
      if (isObjectId) {
        deletedmovies = await movieServices.deleteMovieByMongoId(movieId);
      } else {
        deletedmovies = await movieServices.deleteMovieById(movieId);
      }

      if (!deletedmovies) {
        return next(new AppError('Movie not Found', 404));
      }

      return res.status(200).json({
        status: 'success',
        statusCode: 200,
        message: 'Movie deleted Successfully',
        data: { movie: deletedmovies },
      });
    } catch (error) {
      return next(error);
    }
  }

  static async getMoviesById(req, res, next) {
    const { movieId } = req.params;
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(movieId);

    try {
      let movies;
      if (isObjectId) {
        movies = await movieServices.getMoviesByMongoId(movieId);
      } else {
        movies = await movieServices.getMoviesById(movieId);
      }

      if (!movies) {
        return next(new AppError('Movie not Found', 404));
      }

      return res.status(200).json({
        status: 'success',
        statusCode: 200,
        message: 'Movie retrieved Successfully',
        data: { movie: movies },
      });
    } catch (error) {
      next(error);
    }
  }

  static async generatePdf(req, res, next) {
    try {
      const movies = await movieServices.generatePdf();
      if (!movies || movies.length === 0) {
        return next(new AppError('No movies found', 404));
      }
      const doc = new PDFDocument();
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'inline; filename=Movies.pdf');

      doc.pipe(res);

      doc.fontSize(20).text('Movie List', { align: 'center' });
      doc.moveDown();

      movies.forEach((movie, index) => {
        try {
          doc.fontSize(12).text(`${index + 1}. ${movie.id}`);
          doc.text(`   MovieName: ${movie._id}`);
          doc.text(`   Mongo_Id: ${movie.movieName}`);
          doc.text(`   Director: ${movie.director}`);
          doc.text(`   Rating: ${movie.rating}`);
          doc.moveDown();
        } catch (error) {
          return next(new AppError('Error generating PDF content', 500));
        }
      });

      doc.end();
    } catch (error) {
      next(error);
    }
  }
}

module.exports = MovieController;

// const getMovies = async (req, res) => {
//   const movies = await movieServices.getMovies();
//   res.status(200).json({
//     status: 'success',
//     statusCode: 200,
//     message: 'Movies retrieved successfully',
//     data: { movies },
//   });
// };

// const saveMovieDetails = async (req, res,next) => {
//   const existingMovie=await model.findOne({id:req.body.id})
//   if(existingMovie){
//     return next(new AppError('MovieId already exist', 404));
//   }

//   const newMovies = await movieServices.saveMovieDetails(req.body);
//   res.status(200).json({
//     status: 'success',
//     statusCode: 200,
//     message: 'Movie saved Successfully',
//     data: { movie: newMovies.toObject() },
//   });
// };

// const updateMovieDetails = async (req, res, next) => {
//   const { movieId } = req.params;

//   let updateMovies;
//   const isObjectId = /^[0-9a-fA-F]{24}$/.test(movieId);
//   try {
//     if (isObjectId) {
//       updateMovies = await movieServices.updateMovieDetailsByMongoId(
//         req.body,
//         movieId,
//       );
//     } else {
//       updateMovies = await movieServices.updateMovieDetails(req.body, movieId);
//     }

//     if (!updateMovies) {
//       return next(new AppError('Movie not Found', 404));
//     }
//     res.status(200).json({
//       status: 'success',
//       statusCode: 200,
//       message: 'Movie updated Successfully',
//       data: { movie: updateMovies },
//     });
//   } catch (error) {
//     next(error);
//   }

// };

// const deleteMovieById = async (req, res, next) => {
//   const { movieId } = req.params;

//   let deletedmovies;
//   const isObjectId = /^[0-9a-fA-F]{24}$/.test(movieId);

//   try {
//     if (isObjectId) {
//       deletedmovies = await movieServices.deleteMovieByMongoId(movieId);
//     } else {
//       deletedmovies = await movieServices.deleteMovieById(movieId);
//     }

//     if (!deletedmovies) {
//       return next(new AppError('Movie not Found', 404));
//     }

//     {
//       res.status(200).json({
//         status: 'success',
//         statusCode: 200,
//         message: 'Movie deleted Successfully',
//         data: { movie: deletedmovies },
//       });
//     }
//   } catch (error) {
//     next(error);
//   }
// };

// const getMoviesById = async (req, res, next) => {
//   const { movieId } = req.params;

//   let movies;
//   const isObjectId = /^[0-9a-fA-F]{24}$/.test(movieId);

//   try {
//     if (isObjectId) {
//       movies = await movieServices.getMoviesByMongoId(movieId);
//     } else {
//       movies = await movieServices.getMoviesById(movieId);
//     }

//     if (!movies) {
//       return next(new AppError('Movie not Found', 404));
//     }

//     {
//       res.status(200).json({
//         status: 'success',
//         statusCode: 200,
//         message: 'Movie retrieved Successfully',
//         data: { movie: movies },
//       });
//     }
//   } catch (error) {
//     next(error);
//   }
// };

// module.exports = {
//   getMovies,
//   saveMovieDetails,
//   updateMovieDetails,
//   deleteMovieById,
//   getMoviesById,
// };
// const deletedmovies = await movieServices.deleteMovieById(req.params.movieId)
// if (!deletedmovies) {
//   return next(new AppError('Movie not Found', 404))
// }
// {
//   res.status(200).json({
//     status: 'success',
//     statusCode: 200,
//     message: "Movie deleted Successfully",
//     data: { movie: deletedmovies }
//   })
// }

// const updateMovies = await movieServices.updateMovieDetails(req.body, req.params.movieId)
// if (!updateMovies) {
//   return next(new AppError('Movie not Found', 404))
// }
// res.status(200).json({
//   status: 'success',
//   statusCode: 200,
//   message: "Movie updated Successfully",
//   data: { movie: updateMovies }
// })
