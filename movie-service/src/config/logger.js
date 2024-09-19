const { createLogger, format, transports } = require('winston');

const logger = createLogger({
  level: 'info',
  format: format.combine(format.timestamp(), format.json()),
  transports: [
    new transports.Console(),
    new transports.File({ filename: 'combined.log' }),
  ],
});

console.log = (...args) => logger.info(args.join(' ')); // eslint-disable-line no-console
console.error = (...args) => logger.error(args.join(' ')); // eslint-disable-line no-console
console.warn = (...args) => logger.warn(args.join(' ')); // eslint-disable-line no-console
console.info = (...args) => logger.info(args.join(' ')); // eslint-disable-line no-console
console.debug = (...args) => logger.debug(args.join(' ')); // eslint-disable-line no-console

module.exports = logger;
