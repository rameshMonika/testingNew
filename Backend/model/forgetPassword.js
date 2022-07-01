/* eslint-disable linebreak-style */
/* eslint-disable no-shadow */
/* eslint-disable consistent-return */
/* eslint-disable no-console */
const jwt = require('jsonwebtoken');

const frontEndUrl = 'http://localhost:3001';
// const backEndUrl = 'http://localhost:5000';
// const frontEndUrl = 'https://moc-fa.herokuapp.com';
// const backEndUrl = 'https://moc-ba.herokuapp.com';
//= ======================================================
//              Imports
//= ======================================================
// intialising pool
const pool = require('../controller/databaseConfig');
const config = require('../config');

//= ======================================================
//              Functions / Objects
//= ======================================================
const forgetPassword = {

  // sql query statement
  // get all class of services
  Verify(email, callback) {
    // sql query statement
    const sql = `SELECT *
    FROM heroku_6b49aedb7855c0b.customer 
    Where Email = ?`;
    // pool query
    pool.query(sql, [email], (err, result) => {
      // error
      if (err) {
        console.log(err);
        return callback(err, null);
      }
      // there must only be 1 result here
      // since email is unique
      // confirm if we have the key
      // const secretUser = jwt + result[0].Password;

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
          // expires in 15min hrs
          expiresIn: 9000,
        },
      );
      const link = `${frontEndUrl}/resetPassword/?id=${result[0].CustomerID}&token=${token}`;
      console.log(link);

      return callback(null, link, result[0]);
    });
  },
  updateUserPassword(password, id, callback) {
    console.log(password);
    // sql query statement
    const sql = `
            UPDATE 
            heroku_6b49aedb7855c0b.customer
         SET
            Password = ?
        where
            CustomerID = ?
             ;
            `;
    // pool query
    pool.query(sql, [password, id], (err, result) => {
      // error
      if (err) {
        console.log(err);
        return callback(err);
      }
      // result accurate
      return callback(null, result);
    });
  },

};

//= ======================================================
//              Exports
//= ======================================================
module.exports = forgetPassword;
