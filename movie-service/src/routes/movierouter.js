const express = require('express');

const router = express.Router();
const googleValidation = require('../middleware/tokenverify');

const MovieController = require('../controller/moviecontroller');

const validate = require('../middleware/reqSchemaValidate');
const {
  getMoviesBySchema,
  deleteMoviesBySchema,
  updateMovieBySchema,
} = require('../validations/userValidation');
const requireAuth = require('../middleware/authMiddleware');
// const moviecontroller = require('../controller/moviecontroller');

router
  .route('/')
  .get(requireAuth, MovieController.getMovies)
  .post(requireAuth, MovieController.saveMovieDetails);

router
  .route('/:movieId')
  .get(requireAuth, validate(getMoviesBySchema), MovieController.getMoviesById)
  .patch(
    requireAuth,
    validate(updateMovieBySchema),
    MovieController.updateMovieDetails,
  )
  .delete(
    requireAuth,
    validate(deleteMoviesBySchema),
    MovieController.deleteMovieById,
  );

router.route('/pdf/movie').get(googleValidation, MovieController.generatePdf);

module.exports = router;

/**
 * @openapi
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     Movie:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "tt1234567"
 *         movieName:
 *           type: string
 *           example: "Inception"
 *         director:
 *           type: string
 *           example: "Christopher Nolan"
 *         rating:
 *           type: number
 *           example: 8.8
 *     GetMoviesResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: "success"
 *         statusCode:
 *           type: integer
 *           example: 200
 *         message:
 *           type: string
 *           example: "Movies retrieved successfully"
 *         data:
 *           type: object
 *           properties:
 *             movies:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Movie'
 *     SaveMovieRequest:
 *       type: object
 *       required:
 *         - id
 *         - movieName
 *         - director
 *         - rating
 *       properties:
 *         id:
 *           type: string
 *           example: "12"
 *         movieName:
 *           type: string
 *           example: "Inception"
 *         director:
 *           type: string
 *           example: "Christopher Nolan"
 *         rating:
 *           type: number
 *           example: 8.8
 *     SaveMovieResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: "success"
 *         statusCode:
 *           type: integer
 *           example: 200
 *         message:
 *           type: string
 *           example: "Movie saved successfully"
 *         data:
 *           type: object
 *           properties:
 *             movie:
 *               $ref: '#/components/schemas/Movie'
 *
 * /api/v1/movie:
 *   get:
 *     tags:
 *       - Movies
 *     summary: "Get all movies"
 *     description: "Retrieve a list of all movies."
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: "A list of movies"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GetMoviesResponse'
 *       401:
 *         description: "Unauthorized - No token or invalid token provided"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "error"
 *                 statusCode:
 *                   type: integer
 *                   example: 401
 *                 message:
 *                   type: string
 *                   example: "No token, authorization denied"
 *       500:
 *         description: "Internal Server Error"
 *   post:
 *     tags:
 *       - Movies
 *     summary: "Save movie details"
 *     description: "Save the details of a new movie."
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SaveMovieRequest'
 *     responses:
 *       200:
 *         description: "Movie saved successfully"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SaveMovieResponse'
 *       401:
 *         description: "Unauthorized - No token or invalid token provided"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "error"
 *                 statusCode:
 *                   type: integer
 *                   example: 401
 *                 message:
 *                   type: string
 *                   example: "No token, authorization denied"
 *       404:
 *         description: "Movie ID already exists"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "error"
 *                 statusCode:
 *                   type: integer
 *                   example: 404
 *                 message:
 *                   type: string
 *                   example: "MovieId already exists"
 *       500:
 *         description: "Internal Server Error"
 */

/**
 * @openapi
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     Movie:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "12"
 *         movieName:
 *           type: string
 *           example: "Inception"
 *         director:
 *           type: string
 *           example: "Christopher Nolan"
 *         rating:
 *           type: number
 *           example: 8.8
 *     GetMovieByIdResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: "success"
 *         statusCode:
 *           type: integer
 *           example: 200
 *         message:
 *           type: string
 *           example: "Movie retrieved successfully"
 *         data:
 *           type: object
 *           properties:
 *             movie:
 *               $ref: '#/components/schemas/Movie'
 *     UpdateMovieRequest:
 *       type: object
 *       required:
 *         - id
 *         - movieName
 *         - director
 *         - rating
 *       properties:
 *         id:
 *           type: string
 *           example: "12"
 *         movieName:
 *           type: string
 *           example: "Inception"
 *         director:
 *           type: string
 *           example: "Christopher Nolan"
 *         rating:
 *           type: number
 *           example: 8.8
 *     UpdateMovieResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: "success"
 *         statusCode:
 *           type: integer
 *           example: 200
 *         message:
 *           type: string
 *           example: "Movie updated successfully"
 *         data:
 *           type: object
 *           properties:
 *             movie:
 *               $ref: '#/components/schemas/Movie'
 *
 * paths:
 *   /api/v1/movie/{movieId}:
 *     get:
 *       tags:
 *         - Movies
 *       summary: "Get a movie by ID"
 *       description: "Retrieve the details of a movie by its ID. ID can be a MongoDB ObjectId or a custom ID."
 *       security:
 *         - BearerAuth: []
 *       parameters:
 *         - name: movieId
 *           in: path
 *           required: true
 *           schema:
 *             type: string
 *           description: "ID of the movie to retrieve. Can be a MongoDB ObjectId or a custom ID."
 *       responses:
 *         200:
 *           description: "Movie retrieved successfully"
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/GetMovieByIdResponse'
 *         401:
 *           description: "Unauthorized - No token or invalid token provided"
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   status:
 *                     type: string
 *                     example: "error"
 *                   statusCode:
 *                     type: integer
 *                     example: 401
 *                   message:
 *                     type: string
 *                     example: "No token, authorization denied"
 *         404:
 *           description: "Movie not found"
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   status:
 *                     type: string
 *                     example: "error"
 *                   statusCode:
 *                     type: integer
 *                     example: 404
 *                   message:
 *                     type: string
 *                     example: "Movie not found"
 *         500:
 *           description: "Internal Server Error"
 *
 *     patch:
 *       tags:
 *         - Movies
 *       summary: "Update a movie by ID"
 *       description: "Update the details of a movie by its ID. ID can be a MongoDB ObjectId or a custom ID."
 *       security:
 *         - BearerAuth: []
 *       parameters:
 *         - name: movieId
 *           in: path
 *           required: true
 *           schema:
 *             type: string
 *           description: "ID of the movie to update. Can be a MongoDB ObjectId or a custom ID."
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UpdateMovieRequest'
 *       responses:
 *         200:
 *           description: "Movie updated successfully"
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/UpdateMovieResponse'
 *         401:
 *           description: "Unauthorized - No token or invalid token provided"
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   status:
 *                     type: string
 *                     example: "error"
 *                   statusCode:
 *                     type: integer
 *                     example: 401
 *                   message:
 *                     type: string
 *                     example: "No token, authorization denied"
 *         404:
 *           description: "Movie not found or invalid ID"
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   status:
 *                     type: string
 *                     example: "error"
 *                   statusCode:
 *                     type: integer
 *                     example: 404
 *                   message:
 *                     type: string
 *                     example: "Movie not found"
 *         500:
 *           description: "Internal Server Error"
 */
/**
 * @openapi
 *
 * /api/v1/movie/{movieId}:
 *   delete:
 *     tags:
 *       - Movies
 *     summary: "Delete a movie by ID"
 *     description: "Delete a movie by its ID. The ID can be a MongoDB ObjectId or a custom ID."
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: movieId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: "ID of the movie to delete. Can be a MongoDB ObjectId or a custom ID."
 *     responses:
 *       200:
 *         description: "Movie deleted successfully"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "Movie deleted successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     movie:
 *                       $ref: '#/components/schemas/Movie'
 *       401:
 *         description: "Unauthorized - No token or invalid token provided"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "error"
 *                 statusCode:
 *                   type: integer
 *                   example: 401
 *                 message:
 *                   type: string
 *                   example: "No token, authorization denied"
 *       404:
 *         description: "Movie not found"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "error"
 *                 statusCode:
 *                   type: integer
 *                   example: 404
 *                 message:
 *                   type: string
 *                   example: "Movie not found"
 *       500:
 *         description: "Internal Server Error"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "error"
 *                 statusCode:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: "Internal Server Error"
 */
/**
 * @openapi
 * /api/v1/movie/pdf/movie:
 *   get:
 *     tags:
 *     - Movies
 *     summary: "Generate a PDF containing a list of movies"
 *     description: "This endpoint generates a PDF with the details of all available movies, including the movie ID, name, director, and rating."
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: "PDF of movie list generated successfully"
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *             examples:
 *               example-1:
 *                 summary: "Sample PDF"
 *                 value: "base64_encoded_string_here"
 *       401:
 *         description: "Unauthorized - No token or invalid token provided"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "error"
 *                 statusCode:
 *                   type: integer
 *                   example: 401
 *                 message:
 *                   type: string
 *                   example: "No token, authorization denied"
 *       404:
 *         description: "No movies found"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "error"
 *                 statusCode:
 *                   type: integer
 *                   example: 404
 *                 message:
 *                   type: string
 *                   example: "No movies found"
 *       500:
 *         description: "Internal Server Error"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "error"
 *                 statusCode:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: "Error generating PDF content"
 */
