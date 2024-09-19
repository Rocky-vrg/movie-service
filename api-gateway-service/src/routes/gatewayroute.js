const { Router } = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const rateLimiter = require('../middlewares/ratelimiter');
const {
  validateSearchParams,
  threatDetection,
} = require('../middlewares/threatdetector');

const router = Router();

router.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    statusCode: 200,
    message: '! Welcome to Movie-Api ! You are under HTTPS Hands',
  });
  console.log('! Welcome to Movie-Api ! You are under HTTPS Hands !'); // eslint-disable-line no-console
});

router.use(
  '/v1/auth',
  validateSearchParams,
  rateLimiter,
  threatDetection,
  createProxyMiddleware({
    target: 'http://localhost:5000',
    changeOrigin: true,
    logLevel: 'debug',
  }),
);

router.use(
  '/v1/movie',
  validateSearchParams,
  rateLimiter,
  threatDetection,
  createProxyMiddleware({
    target: 'http://localhost:5002',
    changeOrigin: true,
    logLevel: 'debug',
  }),
);

router.use(
  '/v1',
  validateSearchParams,
  rateLimiter,
  threatDetection,
  createProxyMiddleware({
    target: 'http://localhost:5001',
    changeOrigin: true,
    logLevel: 'debug',
  }),
);

module.exports = router;
/**
 * @openapi
 * tags:
 *  - name: Welcome-Gateway-service
 *    description: "Endpoints related to welcome messages and basic status checks."
 */

/**
 * @openapi
 *
 * /:
 *   get:
 *     tags:
 *       - Welcome-Gateway-service
 *     summary: "Welcome endpoint"
 *     description: "A simple endpoint to check if the API is up and running. Returns a JSON message indicating the API is under HTTPS."
 *     responses:
 *       200:
 *         description: "A welcome message indicating that the API is under HTTPS."
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
 *                   example: "! Welcome to Movie-Api ! You are under HTTPS Hands"
 */
