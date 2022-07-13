/* eslint-disable linebreak-style */
/* eslint-disable consistent-return */
// -----------------------------------------------------------------
// imports
// -----------------------------------------------------------------
const jwt = require('jsonwebtoken');

const config = require('../config');

// -----------------------------------------------------------------
// Object / function
// -----------------------------------------------------------------
function verifyToken(req, res, next) {
  // retrieve authorization header’s content
  // Authorization: Bearer <token>
  let token = req.headers.authorization;

  // process the token
  if (!token || !token.includes('Bearer')) {
    return res.status(403).send({
      auth: false,
      message: 'Not authorized!',
    });
  }

  // obtain the token’s value
  // eslint-disable-next-line prefer-destructuring
  token = token.split('Bearer ')[1];

  // verify token
  jwt.verify(token, config.key, (err, decoded) => {
    if (err) {
      return res.status(403).send({
        auth: false,
        message: 'Not authorized!!!!!!!!!!!',
      });
    }
    // decode the userid and store in req for use
    req.id = decoded.id;
    // decode the role and store in req for use
    req.email = decoded.email;
    next();
  });
}

//------------------------
// Exports
//------------------------
module.exports = verifyToken;
