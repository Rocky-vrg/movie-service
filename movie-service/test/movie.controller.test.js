// const request = require('supertest');
// const app = require('../../src/app');
const mockingoose = require('mockingoose');
const mockData = require('../data/movies.json');
const MovieModel = require('../src/model/moviemodel');
// const jwt = require('jsonwebtoken');
// const config = require('../../src/config/config');
jest.mock('jsonwebtoken');
const controller = require('../src/controller/moviecontroller');
const AppError = require('../src/utils/appError');
// const movieServices = require('../../movie-service/src/services/movieservice');

describe('Test movie service', () => {
  beforeEach(() => {
    mockingoose(MovieModel).toReturn(mockData.movies);
    // process.env.JWT_SECRET = 'test_secret';
    // jwt.sign.mockImplementation((payload, secret, options) => {
    //   // Implement your own logic for generating a mock token
    //   return 'mock_token test';
    // });
    // jwt.verify.mockImplementation((token, secret, callback) => {
    //   // Implement your own logic for verifying a mock token
    //   callback(null, { userId: 123 });
    // });
  });

  it('should return all movies', async () => {
    // const token = jwt.sign({ userId: 'testUser' }, config.JWT_SECRET, {
    //   expiresIn: '7d',
    // });

    // const res = await request(app)
    //   .get('/api/v1/movie')
    //   .set('Authorization', Bearer ${token});
    // expect(res.status).toBe(200);
    // expect(res.body).toEqual(mockUser);

    // expect(movieList).toHaveLength(7);

    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    await controller.getMovies(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('should save movie details successfully', async () => {
    const req = {
      body: {
        id: 1,
        movieName: 'New Movie',
        director: 'Some Director',
        rating: 8.5,
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const next = jest.fn();

    // Mock the movie service to return a Mongoose document
    const savedMovie = new MovieModel(req.body); // Creates a Mongoose document
    mockingoose(MovieModel).toReturn(savedMovie, 'save');

    // Invoke the controller method
    await controller.saveMovieDetails(req, res, next);

    // Check that the response was sent with the correct data
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: 'success',
      statusCode: 200,
      message: 'Movie saved Successfully',
      data: {
        movie: savedMovie.toObject(), // Convert the Mongoose document to a plain object
      },
    });
  });

  it('should return error if movie ID already exists', async () => {
    const req = {
      body: {
        id: 1,
        movieName: 'Existing Movie',
        director: 'Existing Director',
        rating: 7.5,
      },
    };

    // Mocking the response and next functions
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    // Mocking Mongoose to return an existing movie
    mockingoose(MovieModel).toReturn(req.body, 'findOne');

    // Invoke the controller method
    await controller.saveMovieDetails(req, res, next);

    // Check if the next function was called with the appropriate error
    expect(next).toHaveBeenCalledWith(expect.any(AppError));
    expect(next.mock.calls[0][0]).toMatchObject({
      message: 'MovieId already exists',
      statusCode: 404,
    });
  });

  it('should fetch movie details successfully by ID', async () => {
    const req = { params: { movieId: 1 } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    const movie = {
      _id: '66c984ef872653b752d62963',
      id: 1,
      movieName: 'Fetched Movie',
      director: 'Some Director',
      rating: 7.5,
    };

    mockingoose(MovieModel).toReturn(movie, 'findOne'); // Mock the findOne call

    await controller.getMoviesById(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    // expect(res.json).toHaveBeenCalledWith({
    //   status: 'success',
    //   statusCode: 200,
    //   message: 'Movie retrieved Successfully',
    //   data: { movie:movie },

    // });
  });

  it('should delete movie successfully by ID', async () => {
    const req = { params: { movieId: '66c984ef872653b752d62963' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    const movie = {
      _id: '66c984ef872653b752d62963',
      id: 1,
      movieName: 'Some Movie',
      director: 'Some Director',
      rating: 8.0,
    };

    mockingoose(MovieModel).toReturn(movie, 'findOneAndDelete');

    await controller.deleteMovieById(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    //   expect(res.json).toHaveBeenCalledWith({

    //   //   {
    //   //   status: 'success',
    //   //   statusCode: 200,
    //   //   message: 'Movie deleted Successfully',
    //   //   data: { movie },
    //   // }
    // );
  });

  it('should return 404 when movie is not found', async () => {
    const req = { params: { movieId: 'invalid-id' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    mockingoose(MovieModel).toReturn(null, 'findOneAndDelete');

    await controller.deleteMovieById(req, res, next);

    expect(next).toHaveBeenCalledWith(new AppError('Movie not Found', 404));
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  it('should update movie details successfully by MongoDB ID', async () => {
    const req = {
      params: { movieId: '66c984ef872653b752d62963' },
      body: {
        movieName: 'Updated Movie',
        director: 'New Director',
        rating: 9.0,
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    const updatedMovie = {
      _id: '66c984ef872653b752d62963',
      id: 1,
      movieName: 'Updated Movie',
      director: 'New Director',
      rating: 9.0,
    };

    mockingoose(MovieModel).toReturn(updatedMovie, 'findOneAndUpdate');

    await controller.updateMovieDetails(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    // expect(res.json).toHaveBeenCalledWith({
    //   status: 'success',
    //   statusCode: 200,
    //   message: 'Movie updated Successfully',
    //   data: { movie: updatedMovie },
    // });
  });

  it('should update movie details successfully by custom ID', async () => {
    const req = {
      params: { movieId: '1' },
      body: {
        movieName: 'Updated Movie',
        director: 'New Director',
        rating: 9.0,
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    const updatedMovie = {
      _id: '66c984ef872653b752d62963',
      id: 1,
      movieName: 'Updated Movie',
      director: 'New Director',
      rating: 9.0,
    };

    mockingoose(MovieModel).toReturn(updatedMovie, 'findOneAndUpdate');

    await controller.updateMovieDetails(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    // expect(res.json).toHaveBeenCalledWith({
    //   status: 'success',
    //   statusCode: 200,
    //   message: 'Movie updated Successfully',
    //   data: { movie: updatedMovie },
    // });
  });

  it('should return 404 if movie is not found by MongoDB ID', async () => {
    const req = {
      params: { movieId: '66c984ef872653b752d62963' },
      body: {
        movieName: 'Updated Movie',
        director: 'New Director',
        rating: 9.0,
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    mockingoose(MovieModel).toReturn(null, 'findOneAndUpdate');

    await controller.updateMovieDetails(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(AppError));
    expect(next.mock.calls[0][0]).toMatchObject({
      message: 'Movie not Found',
      statusCode: 404,
    });
    expect(res.status).not.toHaveBeenCalled();
  });

  it('should handle errors gracefully during update', async () => {
    const req = {
      params: { movieId: '66c984ef872653b752d62963' },
      body: {
        movieName: 'Updated Movie',
        director: 'New Director',
        rating: 9.0,
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    mockingoose(MovieModel).toReturn(
      new Error('Something went wrong'),
      'findOneAndUpdate',
    );

    await controller.updateMovieDetails(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(Error));
    expect(res.status).not.toHaveBeenCalled();
  });

  // it('should save a movie successfully', async () => {
  //   const req = { body: { id: 8, movieName: 'New Movie', director: 'Director', rating: 8.5 } };
  //   const res = {
  //     status: jest.fn().mockReturnThis(),
  //     json: jest.fn(),
  //   };

  //   mockingoose(MovieModel).toReturn({ ...req.body, _id: '66c0a7b8ce5c9ff590e060d8' }, 'save');

  //   await controller.saveMovieDetails(req, res);

  //   expect(res.status).toHaveBeenCalledWith(200);
  //   expect(res.json).toHaveBeenCalledWith(...expected)/* ({
  //     status: 'success',
  //     statusCode: 200,
  //     message: 'Movie saved Successfully',
  //     data:  { movie: { ...req.body, _id: '66c0a7b8ce5c9ff590e060d8' } },
  //   }); */
  // });

  // it('should save movie and return that object', async () => {
  //   let movie = {
  //     movieName: 'Sherlock Holmes',
  //     director: 'Franklin',
  //     rating: '10',
  //     id: 7,
  //   };
  //   const response = await movieservice.saveMovieDetails(movie);
  //   expect(response._id).toBeDefined();
  //   expect(response.movieName).toEqual(movie.movieName);
  // });

  // it('should return movie given the movie id', async () => {
  //   const movieList = await movieservice.getMovies();
  //   const firstMovie = movieList[0];
  //   mockingoose(MovieModel).toReturn(firstMovie, 'findOne');

  //   const response = await movieservice.getMoviesById(firstMovie.id);
  //   console.log(response);
  //   console.log(firstMovie);

  //   expect(response.movieName).toEqual(firstMovie.movieName);
  // });
});

// const supertest = require('supertest');
// const app = require('../../src/app');
// const jwt = require('jsonwebtoken');
// const config=require('../../src/config/config')
// const request=supertest(app)

// describe('Movie API', () => {
//   let token;

//   beforeAll(async () => {
//     // Signup a new user
//     const signupResponse = await request(app)
//       .post('/api/v1/auth/signup')
//       .send({
//         email: 'example@gmail.com',
//         password: 'test123',
//         // confirmPassword: 'TestPassword123',
//       });

//     expect(signupResponse.statusCode).toEqual(201);
//     expect(signupResponse.body.status).toBe('success');

//     // Signin to get the token
//     const signinResponse = await request(app)
//       .post('/api/v1/auth/signin')
//       .send({
//         email: 'example@gmail.com',
//         password: 'test123',
//       });

//     expect(signinResponse.statusCode).toEqual(200);
//     expect(signinResponse.body.status).toBe('success');
//     token = signinResponse.body.AccessToken;
//   });

//   it('should get movies with a valid token', async () => {
//     const res = await request(app)
//       .get('/api/v1/movie')
//       .set('Authorization', Bearer ${token});

//     expect(res.statusCode).toEqual(200);
//     expect(res.body.status).toBe('success');
//     expect(res.body.data).toHaveProperty('movies');
//   });

//   it('should return 401 without a token', async () => {
//     const res = await request(app).get('/api/v1/movie');

//     expect(res.statusCode).toEqual(401);
//   });

//   it('should return 401 with an invalid token', async () => {
//     const res = await request(app)
//       .get('/api/v1/movie')
//       .set('Authorization', Bearer invalidToken); // Invalid token

//     expect(res.statusCode).toEqual(401);
//   });
// });

// it("gets the test endpoint", async done => {
//   const response = await request.get("/api/v1/movie");

//   expect(response.status).toBe(200);
//   expect(response.body.message).toBe("Movie retrieved Successfully");
//   done();
// });

// import {describe,it,test} from jest

// const mongoose=require("mongoose")
// const databasename="test-jest"

// beforeAll(async()=>{
// const url=mongodb://localhost:27017/${databasename}
// await mongoose.connect(url)
// // console.log(url);

// })

// afterAll(async () => {
//   await mongoose.connection.close();
// });

// describe('GET /', () => {
//   it('should respond with a status code of 200', async () => {
//     const res = await request.get('/');

//     expect(res.statusCode).toEqual(200);
//     expect(res.text).toBe('Hello Movies');
//   });
// });

// // jestGlobalSetup.js
// const mongoose = require('mongoose');
// const { MongoMemoryServer } = require('mongodb-memory-server');

// let mongoServer;

// module.exports = async () => {
//   mongoServer = await MongoMemoryServer.create();
//   const uri = mongoServer.getUri();
//   process.env.MONGO_URI = uri; // Store the URI in an environment variable

//   // Connect to the in-memory database
//   await mongoose.connect(uri, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   });
// };

// // jestGlobalTeardown.js
// const mongoose = require('mongoose');

// module.exports = async () => {
//   await mongoose.connection.dropDatabase();
//   await mongoose.connection.close();
//   await mongoServer.stop();
// };

// // jest.config.js
// module.exports = {
//   globalSetup: './jestGlobalSetup.js',
//   globalTeardown: './jestGlobalTeardown.js',
//   testEnvironment: 'node',
// };
