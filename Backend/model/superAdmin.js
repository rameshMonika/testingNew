/* eslint-disable linebreak-style */
/* eslint-disable no-console */

//= ======================================================
//              Imports
//= ======================================================
// intialising pool
const pool = require('../controller/databaseConfig');

//= ======================================================
//              Functions / Objects
//= ======================================================
const superAdmin = {

  // Get Admin
  getAdmin(id, callback) {
    // sql query statement
    const sql = 'SELECT AdminID, FirstName, LastName, Password, Email, AdminType FROM heroku_6b49aedb7855c0b.admin where AdminID=?;';

    const values = [id];
    // pool query
    pool.query(sql, values, (err, result) => {
      // error
      if (err) {
        console.log(err);
        return callback(err);
      }
      // result accurate
      return callback(null, result);
    });
  },

  // get all Admins and Super admins
  getAllAdmins(callback) {
    // sql query statement
    const sql = `
      SELECT 
        AdminID, FirstName, LastName, Email, AdminType 
      FROM 
        heroku_6b49aedb7855c0b.admin;
    `;

    // pool query
    pool.query(sql, (err, result) => {
      // error
      if (err) {
        console.log(err);
        return callback(err);
      }
      // result accurate
      return callback(null, result); // if
    });
  },

  // delete a regular admin
  deleteAdmin(id, callback) {
    // sql query statement
    const sql = 'DELETE FROM heroku_6b49aedb7855c0b.admin where AdminID =?;';

    // pool query
    pool.query(sql, [id], (err, result) => {
      // error
      if (err) {
        console.log(err);
        return callback(err);
      }
      // result accurate
      return callback(null, result);
    });
  },

  // update an admin
  updateAdmin(password, adminType, id, callback) {
    // sql query statement
    const sql = `
    UPDATE 
      heroku_6b49aedb7855c0b.admin
    SET
      Password=?,
      AdminType=?
    WHERE
      AdminID=?;
  `;
    // pool query
    pool.query(sql, [password, adminType, id], (err, result) => {
      // error
      if (err) {
        console.log(err);
        return callback(err);
      }
      // result accurate
      return callback(null, result); // if
    });
  },

  // add an admin
  addAdmin(firstName, lastName, pwd, email, type, callback) {
    // sql query statement
    const sql = `
      INSERT INTO
        heroku_6b49aedb7855c0b.admin (
          FirstName,
          LastName, 
          Password,
          Email,
          AdminType)
        VALUES 
        (?, ?, ?, ?, ?);
    `;
    // pool query
    pool.query(sql, [firstName, lastName, pwd, email, type], (err, result) => {
      if (err) {
        console.log(err);
        return callback(err);
      }
      // result accurate
      return callback(null, result);
      // pool.end()
    });
  },

  // ======================================================
  //              Features / auto booking
  // ======================================================

  // get all booking that are valid for auto booking
  getAutoBookingValidContracts(callback) {
    // sql query statement that select contracts and corresponding users that are
    // active the c represets contract table and cu represents customer
    // table in heroku_6b49aedb7855c0b database
    const sql = `
    Select c.ContractID,c.Customer,c.DayOfService,c.DayOfService2,c.Package from heroku_6b49aedb7855c0b.contract c
    inner join heroku_6b49aedb7855c0b.customer cu on cu.CustomerID=c.Customer 
    where c.contractStatus='active' and cu.Status='active';
  `;
    // pool query
    pool.query(sql, (err, result) => {
      // error
      if (err) {
        console.log(err);
        return callback(err);
      }
      // result accurate

      return callback(null, result); // if
    });
  },

  // add booking
  addBooking(ContractId, ScheduleDate, callback) {
    // sql query statement to add booking to database
    const sql = `
    INSERT INTO
    heroku_6b49aedb7855c0b.booking (
ContractId,
ScheduleDate)
VALUES
(
?,
?
);
`;
    // pool query
    pool.query(sql, [ContractId, ScheduleDate], (err, result) => {
      if (err) {
        console.log(err);
        return callback(err);
      }
      // result accurate

      return callback(null, result);

      // pool.end()
    });
  },

  getAllBookingForAutoBookingFunc(callback) {
    // sql query statement
    const sql = 'SELECT * FROM heroku_6b49aedb7855c0b.booking;';

    // pool query
    pool.query(sql, (err, result) => {
      // error
      if (err) {
        console.log(err);
        return callback(err);
      }
      // result accurate

      return callback(null, result);
    });
  },

  getAContract(id, callback) {
    // sql query statement
    const sql = 'SELECT * FROM heroku_6b49aedb7855c0b.contract where ContractID=?;';

    // pool query
    pool.query(sql, [id], (err, result) => {
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
module.exports = superAdmin;
