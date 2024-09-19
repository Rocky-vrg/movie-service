const fs = require('fs');
const path = require('path');
const https = require('https');

function createHttpsServer(app) {
  const keyPath = path.join(__dirname, '..', '/config/certs', 'key.pem');
  const certPath = path.join(__dirname, '..', '/config/certs', 'cert.pem');

  const options = {
    key: fs.readFileSync(keyPath),
    cert: fs.readFileSync(certPath),
    passphrase: 'VRGRK',
  };

  const server = https.createServer(options, app);

  return server;
}

module.exports = createHttpsServer;
