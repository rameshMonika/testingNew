/* eslint-disable linebreak-style */

// env variables
require('dotenv').config();

//-------------------------
// Object/ Fcuntions
//-------------------------
// your own secret key
const secret = process.env.SECRET;

//-------------------------
// Exports
//-------------------------
module.exports.key = secret;
