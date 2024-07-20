const jwt = require('jsonwebtoken');

const { isTokenBlacklisted } = require('../tokenBlacklist');

const authenticateSocket = (socket, next) => {
    const token = socket.handshake.query.accessToken;
    if (!token) {
        return next(new Error('Authentication error'));
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
        if (err) {
            return next(new Error('User is not authorized'));
        }

        socket.user = decoded.user;

        next();
    });
};

module.exports = authenticateSocket;

