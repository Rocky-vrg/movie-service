const express = require('express');

const router = express.Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');
const authController = require('../controller/authController');
const validate = require('../middleware/reqSchemaValidate');
const { signinSchema, signupSchema } = require('../validations/authValidation');

const config = require('../config/config');
const verifyToken = require('../middleware/tokenverify');

router.route('/signup').post(validate(signupSchema), authController.signup);

router.route('/signin').post(validate(signinSchema), authController.signin);

router.route('/refresh_token').post(authController.signUsingRefreshToken);

router.route('/gog_auth').get(authController.gog_auth);

router
  .route('/google')
  .get(passport.authenticate('google', { scope: ['profile', 'email'] }));

router.route('/google/callback').get(
  passport.authenticate('google', {
    failureRedirect: '/api/v1/auth/failure_user',
  }),
  (req, res) => {
    const token = jwt.sign({ id: req.user.id }, config.GOOGLE_JWT_SECRET, {
      expiresIn: '100d',
    });
    // res.send(token)
    res.redirect(`/api/v1/auth/google_auth_user?token=${token}`);
  },
);

router
  .route('/protected_route')
  .get(verifyToken, authController.protected_route);

router.route('/google_auth_user').get(authController.google_auth_user);

router.route('/failure_user').get(authController.failure_route);

router.route('/logout').get((req, res, next) => {
  req.logOut((err) => {
    if (err) {
      return next(err);
    }
    req.session.destroy((sessionErr) => {
      if (sessionErr) {
        return next(sessionErr);
      }
      res.send('Tata see you next time');
    });
  });
});

module.exports = router;
/**
 * @openapi
 * components:
 *   schemas:
 *     Signup:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: "Must be a valid email address."
 *           example: "user@gmail.com"
 *         password:
 *           type: string
 *           format: password
 *           description: "Must be at least 6 characters long."
 *           example: "password123"
 */

/**
 * @openapi
 * paths:
 *   /api/v1/auth/signup:
 *     post:
 *       tags:
 *         - Auth-Service
 *       summary: "User Signup"
 *       description: "Register a new user with an email and password."
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Signup'
 *       responses:
 *         '201':
 *           description: "User successfully signed up"
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   status:
 *                     type: string
 *                     example: "success"
 *                   statusCode:
 *                     type: integer
 *                     example: 201
 *                   message:
 *                     type: string
 *                     example: "Successfully signed-up"
 *                   data:
 *                     type: object
 *                     properties:
 *                       AccessToken:
 *                         type: string
 *                         example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NmUxZDQyY2QxZDUxYzMzZjhmNjJmNmUiLCJpYXQiOjE3MjYyMzUwMjQsImV4cCI6MTczNDg3NTAyNH0.EB6ZdMjQdc46VR78w4WP7JlT1LM7az-9ZQwnF2vc5-0"
 *                         description: "JWT access token"
 *                       RefreshToken:
 *                         type: string
 *                         example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NmUxZDQyY2QxZDUxYzMzZjhmNjJmNmUiLCJpYXQiOjE3MjYyMzUwMjQsImV4cCI6MTc1Nzc3MTAyNH0.ub8axcl7e8V0315VKyS0LxMSd_aWz3xtlYf6hRfbs6Q"
 *                         description: "JWT refresh token"
 *         '400':
 *           description: "Bad Request - Validation failed or user already exists"
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
 *                     example: 400
 *                   message:
 *                     type: string
 *                     example: "Please provide a valid email, Password must be at least 6 characters long, User already exists"
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     Signin:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: "Must be a valid email address."
 *           example: "user@gmail.com"
 *         password:
 *           type: string
 *           format: password
 *           description: "Password for the account."
 *           example: "password123"
 *     SigninResponse:
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
 *           example: "Successfully signed-in"
 *         data:
 *           type: object
 *           properties:
 *             AccessToken:
 *               type: string
 *               description: "JWT access token"
 *               example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *             RefreshToken:
 *               type: string
 *               description: "JWT refresh token"
 *               example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *
 * /api/v1/auth/signin:
 *   post:
 *     tags:
 *       - Auth-Service
 *     summary: "User Signin"
 *     description: "Authenticate a user with their email and password."
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Signin'
 *     responses:
 *       200:
 *         description: "User successfully signed in"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SigninResponse'
 *       400:
 *         description: "Bad Request - Validation failed"
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
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: "Please provide a valid email, Password is required"
 *       401:
 *         description: "Unauthorized - Invalid email or password"
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
 *                   example: "Invalid email or password"
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     RefreshTokenRequest:
 *       type: object
 *       required:
 *         - token
 *       properties:
 *         token:
 *           type: string
 *           description: "The refresh token used to generate a new access token."
 *           example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NmUxZDQyY2QxZDUxYzMzZjhmNjJmNmUiLCJpYXQiOjE3MjYyMzUwMjQsImV4cCI6MTc1Nzc3MTAyNH0.ub8axcl7e8V0315VKyS0LxMSd_aWz3xtlYf6hRfbs6Q"
 *     RefreshTokenResponse:
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
 *           example: "Successfully created AccessToken using Refresh token"
 *         data:
 *           type: object
 *           properties:
 *             AccessToken:
 *               type: string
 *               description: "JWT access token"
 *               example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NmUxZDQyY2QxZDUxYzMzZjhmNjJmNmUiLCJpYXQiOjE3MjYyMzUwMjQsImV4cCI6MTczNDg3NTAyNH0.EB6ZdMjQdc46VR78w4WP7JlT1LM7az-9ZQwnF2vc5-0"
 *
 * /api/v1/auth/refresh_token:
 *   post:
 *     tags:
 *       - Auth-Service
 *     summary: "Generate a new access token using a refresh token"
 *     description: "This endpoint allows users to generate a new access token using a valid refresh token."
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RefreshTokenRequest'
 *     responses:
 *       200:
 *         description: "Access token successfully generated"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RefreshTokenResponse'
 *       400:
 *         description: "Bad Request - Validation failed"
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
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: "Refresh token is required"
 *       401:
 *         description: "Unauthorized - Invalid or missing refresh token"
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
 *                   example: "Invalid refresh token"
 */
/**
 * @openapi
 * /api/v1/auth/gog_auth:
 *   get:
 *     tags:
 *       - Auth-Service
 *     summary: Google Authentication Link
 *     description: Provides a link to initiate Google authentication.
 *     responses:
 *       '200':
 *         description: A link to initiate Google authentication.
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *               example:   <a href="https://localhost:443/api/v1/auth/google" target="_blank">Authenticate with Google</a>
 */
