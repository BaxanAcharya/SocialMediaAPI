const jwt = require('jsonwebtoken');
const User = require('../models/users');

module.exports.verifyUser = (req, res, next) => {
    let authHeader = req.headers.authorization;
    if (!authHeader) {
        let err = new Error("You have not set Bearer token!");
        err.status = 401;
        return next(err);
    }
    let token = authHeader.split(' ')[1];
    let data;
    try {
        data = jwt.verify(token, process.env.SECRET);
    } catch (err) {
        throw new Error('Invalid token!');
    }
    User.findById(data._id)
        .then((user) => {
            req.user = user;
            next();
        })
}