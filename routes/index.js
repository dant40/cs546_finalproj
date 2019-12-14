const loggingMiddleware = require('./logging');
const homeRoutes = require('./home');
const authRoutes = require('./auth');
const profileRoutes = require('./profile')

const constructorMethod = app => {
    app.use('', loggingMiddleware);
    app.use('/', homeRoutes);
    app.use('/', authRoutes);
    app.use('/', profileRoutes);

    app.use('', (req, res) => {
        res.status(404).json({ error: 'Not found' });
    });
};

module.exports = constructorMethod;