const express = require('express');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
require('./logger');

const app = express();
const port = process.env.SAMPLE_PORT || 5001;

app.get('/', (req, res) => {
  console.log('! Hello User ! Lets Explore !'); // eslint-disable-line no-console
  res.status(200).json({
    status: 'success',
    statusCode: 200,
    message: '! Hello User ! Lets Explore ! ',
  });
});

const server = app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`); // eslint-disable-line no-console
});

module.exports = { app, server };
/**
 * @openapi
 * /api/v1/:
 *   get:
 *     tags:
 *       - Welcome
 *     summary: "Welcome endpoint"
 *     description: "A simple endpoint to greet users and confirm the API is up and running."
 *     responses:
 *       200:
 *         description: "A success message indicating the API is functional."
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
 *                   example: "! Hello User ! Lets Explore ! "
 */
