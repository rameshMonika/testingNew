/* eslint-disable linebreak-style */
/* eslint-disable no-shadow */
/* eslint-disable consistent-return */
/* eslint-disable no-console */

//= ======================================================
//              Imports
//= ======================================================
// intialising pool
const pool = require('../controller/databaseConfig');

//= ======================================================
//              Functions / Objects
//= ======================================================
const Register = {

  // eslint-disable-next-line max-len
  registerCustomer(FirstName, LastName, Password, Email, Address, PhoneNumber, PostalCode, callback) {
    // sql query statement
    const sql = `
        INSERT INTO
        heroku_6b49aedb7855c0b.customer (
        FirstName,
        LastName, 
        Password,
        Email,
        Address,
        PhoneNumber,
        PostalCode,
        Status,
        Verified)
        VALUES
        (?,?,?,?,?,?,?,'active',0);
    `;
    // pool query
    // eslint-disable-next-line max-len
    pool.query(sql, [FirstName, LastName, Password, Email, Address, PhoneNumber, PostalCode], (err, result) => {
      if (err) {
        console.log(err);
        return callback(err);
      }
      console.log(result);
      // result accurate
      return callback(null, result);

      // pool.end()
    });
  },

  verifyCustomerRecord(customerId, uniqueString, createdAt, expiresAt, callback) {
    // sql query statement
    const sql = `
      INSERT INTO
        heroku_6b49aedb7855c0b.user_verification (
          UserId,
          UniqueString,
          CreatedAt,
          ExpiresAt
        )
      VALUES
        (?,?,?,?);
    `;
    // pool query
    pool.query(sql, [customerId, uniqueString, createdAt, expiresAt], (err, result) => {
      if (err) {
        console.log(err);
        return callback(err);
      }
      console.log(result);
      // result accurate
      return callback(null, result);

      // pool.end()
    });
  },

  verifyCustomer(customerId, uniqueString, callback) {
    // sql query statement
    const sql = `
      SELECT 
        * 
      FROM 
        heroku_6b49aedb7855c0b.user_verification
      WHERE
        UserId = ?
    `;

    // pool query
    pool.query(sql, [customerId, uniqueString], (err, result) => {
      if (err) {
        console.log(err);
        return callback(err);
      }
      console.log(result);
      // result accurate
      return callback(null, result);

      // pool.end()
    });
  },

  deleteVerificationRecord(customerId, callback) {
    // sql query statement
    const sql = 'DELETE FROM heroku_6b49aedb7855c0b.user_verification WHERE UserId = ?';
    // pool query
    pool.query(sql, [customerId], (err, result) => {
      if (err) {
        console.log(err);
        return callback(err);
      }
      console.log(result);
      // result accurate
      return callback(null, result);

      // pool.end()
    });
  },

  deleteUnverifiedCustomer(customerId, callback) {
    // sql query statement
    const sql = 'DELETE FROM heroku_6b49aedb7855c0b.customer WHERE CustomerID = ?';
    // pool query
    pool.query(sql, [customerId], (err, result) => {
      if (err) {
        console.log(err);
        return callback(err);
      }
      console.log(result);
      // result accurate
      return callback(null, result);
      // pool.end()
    });
  },

  // update customer account verification status
  updateVerificationStatus(status, id, callback) {
    // sql query statement
    const sql = `
    UPDATE 
      heroku_6b49aedb7855c0b.customer
    SET
      Verified=?
    WHERE
      CustomerID=?;
  `;
    // pool query
    pool.query(sql, [status, id], (err, result) => {
      // error
      if (err) {
        console.log(err);
        return callback(err);
      }
      // result accurate

      return callback(null, result); // if
    });
  },

};

//= ======================================================
//              Exports
//= ======================================================
module.exports = Register;
