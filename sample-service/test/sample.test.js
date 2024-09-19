// eslint-disable-next-line import/no-extraneous-dependencies
const request = require('supertest');
const { app, server } = require('../index');

afterAll(async () => {
  server.close(); // Ensure server is closed after tests
});

describe('GET /', () => {
  it('should return a message', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.text).toBe('! Hello User ! Lets Explore ! ');
  });
});
