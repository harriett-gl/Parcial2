const morgan = require('morgan');

const logger = morgan('dev');

const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
};

module.exports = {
    logger,
    errorHandler
};