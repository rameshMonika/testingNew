/* eslint-disable linebreak-style */
/* eslint-disable consistent-return */
/* eslint-disable no-console */
// -----------------------------------------------------------------
// imports
// -----------------------------------------------------------------
const jwt = require('jsonwebtoken');

const config = require('../config');

// -----------------------------------------------------------------
// Object / function
// -----------------------------------------------------------------
function verifyToken(req, res, next) {
  console.log(req.headers);

  // retrieve authorization header’s content
  // Authorization: Bearer <token>
  let token = req.headers.authorization;

  // Bearer <token>
  console.log(token);

  // process the token
  if (!token || !token.includes('Bearer')) {
    return res.status(403).send({
      auth: 'false',
      message: 'Not authorized!',
    });
  }

  // obtain the token’s value
  // eslint-disable-next-line prefer-destructuring
  token = token.split('Bearer ')[1];

  // <token>
  console.log(`IsloggedInMiddleware token: ${token}`);

  // verify token
  jwt.verify(token, config.key, (err, decoded) => {
    if (err) {
      console.log(err);
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
