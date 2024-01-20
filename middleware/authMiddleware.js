require('dotenv').config();

const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWTSECRET;

const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;

    if (token) {
        jwt.verify(token, jwtSecret, (err, decodedToken) => {
            if (err) {
                console.log(err);
                res.redirect('/login');
            }
            else {
                next();
            }
        });
    }
    else {
        res.redirect('/login');
    }
}

module.exports = { requireAuth }