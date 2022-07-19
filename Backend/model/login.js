/* eslint-disable linebreak-style */
/* eslint-disable no-shadow */
/* eslint-disable consistent-return */
/* eslint-disable no-console */
const jwt = require('jsonwebtoken');
//= ======================================================
//              Imports
//= ======================================================
// intialising pool
const pool = require('../controller/databaseConfig');
const config = require('../config');

//= ======================================================
//              Functions / Objects
//= ======================================================
const Login = {

  // sql query statement
  // get all class of services
  Verify(email, password, callback) {
    // sql query statement
    const sql = `
      SELECT
        *
      FROM
        heroku_6b49aedb7855c0b.admin 
      Where
        Email = ?
    `;
    // pool query
    pool.query(sql, [email, password], (err, result) => {
      // error
      // if (verified) {
      if (err) {
        console.log(err);
        return callback(err, null);
      } if (result.length === 0) {
        // sql query statement
        const sql = `
          SELECT
            *
          FROM 
            heroku_6b49aedb7855c0b.customer 
          WHERE 
            Email = ?
        `;
        // pool query
        pool.query(sql, [email, password], (err, result) => {
          // error
          // if (verified) {
          if (err) {
            console.log(err);
            return callback(err, null);
          }
          if (result[0] !== undefined) {
            // Checks if the account is verified
            // If not verified, retuen unverified error
            if (result[0].Verified !== 1) {
              const error = 'UNVERIFIED_EMAIL';
              return callback(error, null);
            }
            // Checks if the account is suspended
            // If suspended, retuen suspended account error
            if (result[0].Status === 'suspend') {
              const error = 'CUSTOMER_SUSPENDED';
              return callback(error, null);
            }
            // generate the token
            const token = jwt.sign(
              {
                // (1)Payload
                email: result[0].email,
                id: result[0].CustomerID,
              },
              // (2) Secret Key
              config.key,
              // (3) Lifetime of a token
              {
                // expires in 24 hrs
                expiresIn: 86400,
              },
            );
            return callback(null, token, result[0]);
          }
          const error = 'NO_ACCOUNTS_FOUND';
          return callback(error, null);
        });
      } else {
        // there must only be 1 result here
        // since email is unique
        // confirm if we have the key
        // generate the token
        const token = jwt.sign(
          {
            // (1)Payload
            email: result[0].email,
            id: result[0].AdminID,
            role: result[0].AdminType,
          },
          // (2) Secret Key
          config.key,
          // (3) Lifetime of a token
          {
            // expires in 24 hrs
            expiresIn: 86400,
          },
        );
        return callback(null, token, result[0]);
      }
    });
  },

};

//= ======================================================
//              Exports
//= ======================================================
module.exports = Login;
