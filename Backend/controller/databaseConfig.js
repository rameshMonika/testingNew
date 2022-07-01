/* eslint-disable linebreak-style */
/* eslint-disable object-curly-spacing */
/* eslint-disable object-shorthand */
/* eslint-disable key-spacing */
/* eslint-disable linebreak-style */
/* eslint-disable no-console */
// sanity check
console.log('--------------------------------------');
console.log('databaseconfig.js');
console.log('--------------------------------------');
// get data from dbconfig
const {
  databaseUserName, databaseHost, database, databasePassword,
} = require('../dbConfig');

//= ======================================================
//              Imports
//= ======================================================
// eslint-disable-next-line import/order
const mysql = require('mysql');

//= ======================================================
//              Objects / Functions
//= ======================================================
const config = (
  {
    user: databaseUserName,
    password: databasePassword,
    host: databaseHost,
    database: database,
  }
);

// eslint-disable-next-line new-cap
const pool = new mysql.createPool(config);

//= ======================================================
//              Exports
//= ======================================================
module.exports = pool;
