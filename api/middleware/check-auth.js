const jwt = require('jsonwebtoken');

const HttpError = require('../models/http-error');

module.exports = (req, res, next) => {
    if (req.method === 'OPTIONS') {
        return next();
    }
    try {
        const token = req.headers.authorization.split(' ')[1]; 
        
        if (!token) {
            return next(new HttpError('Authentication failed!', 401));
        }
        const decodedToken = jwt.verify(token, 'super_top_secret_code_dont_share_with_anyone_ever_04021190');

        req.userData = { userId: decodedToken.userId };
        next();
    } catch (err) {
        return next(new HttpError('Authentication failed!', 401));
    }
};
