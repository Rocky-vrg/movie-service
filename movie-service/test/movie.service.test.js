const mockingoose = require('mockingoose');
const movieservice = require('../src/services/movieservice');
const mockData = require('../data/movies.json');
const MovieModel = require('../src/model/moviemodel');

describe('Test movie service', () => {
  beforeEach(() => {
    mockingoose(MovieModel).toReturn(mockData.movies);
  });

  it('should return all movies-getMovies', async () => {
    const movieList = await movieservice.getMovies();
    expect(movieList).toHaveLength(7);
  });

  it('should save movie and return that object-saveMovieDetails', async () => {
    const movie = {
      movieName: 'Sherlock Holmes',
      director: 'Franklin',
      rating: '10',
      id: 7,
    };
    const response = await movieservice.saveMovieDetails(movie);
    expect(response._id).toBeDefined();
    expect(response.movieName).toEqual(movie.movieName);
  });

  it('should return movie given the movie id-getMoviesByMongoID', async () => {
    const movieList = await movieservice.getMovies();
    const firstMovie = movieList[0];

    mockingoose(MovieModel).toReturn(firstMovie, 'findOne');

    const response = await movieservice.getMoviesById(firstMovie.id);
    expect(response.movieName).toEqual(firstMovie.movieName);
  });

  it('should return the movie given the movie id-getmoviesByID', async () => {
    const movieList = [
      {
        _id: '66878241121789a69e3e75f7',
        id: 1,
        movieName: 'Trueee Grit',
        director: 'Joel and Ethan Coen',
        rating: 9.6,
      },
      {
        _id: '66878241121789a69e3e75fc',
        id: 6,
        movieName: 'Shawshank Redemption',
        director: 'Franklin',
        rating: 9.4,
      },
    ];
    mockingoose(MovieModel).toReturn(movieList[1], 'findOne');

    const movieId = 6;
    const response = await movieservice.getMoviesById(movieId);
    console.log(response); // eslint-disable-line no-console
    expect(response.movieName).toEqual('Shawshank Redemption');
  });

  it('should delete a movie by ID or MongoDB ID', async () => {
    const movieList = await movieservice.getMovies();
    const firstMovie = movieList[0];

    mockingoose(MovieModel).toReturn(firstMovie, 'findOneAndDelete');
    const responseById = await movieservice.deleteMovieById(firstMovie.id);
    expect(responseById.id).toEqual(firstMovie.id);

    mockingoose(MovieModel).toReturn(firstMovie, 'findOneAndDelete');
    const responseByMongoId = await movieservice.deleteMovieByMongoId(
      firstMovie._id,
    );
    expect(responseByMongoId._id).toEqual(firstMovie._id);
  });

  it('should update movie details by MongoDB ID', async () => {
    const movieList = await movieservice.getMovies();
    const firstMovie = movieList[0];

    const updatedMovie = { ...firstMovie, movieName: 'Updated Name' };

    mockingoose(MovieModel).toReturn(updatedMovie, 'findOneAndUpdate');

    const responseByMongoId = await movieservice.updateMovieDetailsByMongoId(
      updatedMovie,
      firstMovie._id,
    );
    expect(responseByMongoId.movieName).toEqual('Updated Name');

    const response = await movieservice.updateMovieDetails(
      updatedMovie,
      firstMovie.id,
    );
    expect(response.movieName).toEqual('Updated Name');
  });
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
