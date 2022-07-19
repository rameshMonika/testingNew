/* eslint-disable linebreak-style */
/* eslint-disable no-console */

//= ======================================================
//              Imports
//= ======================================================
const pool = require('../controller/databaseConfig');

//= ======================================================
//              Functions / Objects
//= ======================================================
const Customer = {
  // get all class of services
  getCustomerById(cID, callback) {
    // sql query statement
    const sql = 'SELECT FirstName, LastName, Email, Address, PhoneNumber,PostalCode FROM heroku_6b49aedb7855c0b.customer WHERE CustomerID = ?;';

    // pool query
    pool.query(sql, [cID], (err, result) => {
      // error
      if (err) {
        console.log(err);
        return callback(err, null);
      }
      // any results?
      if (result.length === 0) {
        // no results - callback with no err & results
        console.log('this is null');
        return callback(null, null);
      }
      // one result - returns result
      console.log(result);
      return callback(null, result);
    });
  },
  // get employees scheduled as available for booking
  possibleAvailableHelpers(bookingDate, callback) {
    // sql query statement
    const sql = `
      SELECT 
        e.EmployeeName,e.EmployeeDes,e.EmployeeImgUrl,DATE_FORMAT(s.ScheduleDate,'%Y-%m-%d') AS FormatScheduleDate,e.EmployeeID, e.Skillsets
      FROM 
        heroku_6b49aedb7855c0b.employee AS e
      LEFT JOIN 
        heroku_6b49aedb7855c0b.schedule AS s ON e.EmployeeID = s.Employee
      Having 
        FormatScheduleDate= ?;`;

    const values = [bookingDate];

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
  updateCustProfile(firstName, lastName, address, postal, phone, email, id, callback) {
    // sql query statement
    const sql = `
            UPDATE 
            heroku_6b49aedb7855c0b.customer
         SET
            FirstName=?,
            LastName=?,
            Address=?,
            PostalCode=?,
            PhoneNumber=?,
            Email=?
        where
            CustomerID=?
             ;
            `;
    // pool query
    pool.query(sql, [firstName, lastName, address, postal, phone, email, id], (err, result) => {
      // error
      if (err) {
        console.log(err);
        return callback(err);
      }
      // result accurate
      return callback(null, result);
    });
  },
  // Get all customer bookings
  getBookingDetails(id, callback) {
    // sql query statement
    const sql = `SELECT b.BookingID,DATE_FORMAT(b.ScheduleDate,'%Y-%m-%d') as ScheduleDate,p.PackageName,cl.ClassName,c.DayOfService,c.DayOfService2,c.Address,c.NoOfRooms,c.NoOfBathrooms,c.EstimatedPricing,c.ExtraNotes,r.RateName,e.EmployeeName,b.Status
    FROM heroku_6b49aedb7855c0b.booking as b
    join heroku_6b49aedb7855c0b.contract as c on b.ContractID = c.ContractID
    join heroku_6b49aedb7855c0b.customer as cu on c.Customer = cu.CustomerID
    join heroku_6b49aedb7855c0b.rates as r on c.Rate = r.RatesID
    left join heroku_6b49aedb7855c0b.employee as e on b.Employee = e.EmployeeID
    join heroku_6b49aedb7855c0b.class as cl on c.Class = cl.ClassID
    join heroku_6b49aedb7855c0b.package as p on c.Package = p.PackageID
    where cu.CustomerID = ?
    order by ScheduleDate desc;`;

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

  // add contract of services
  addContract(
    // eslint-disable-next-line no-shadow
    Customer,
    StartDate,
    Package,
    DayOfService,
    DayOfService2,
    TimeOfService,
    EstimatedPricing,
    ExtraNotes,
    NoOfRooms,
    NoOfBathrooms,
    Address,
    Class,
    Rate,
    ExtraService,
    PostalCode,
    callback,
  ) {
    // sql query statement
    const sql = `
      INSERT INTO
        heroku_6b49aedb7855c0b.contract (
          Customer,
          StartDate, 
          Package,
          DayOfService,
          DayOfService2,
          TimeOfService,
          EstimatedPricing,
          ExtraNotes,
          NoOfRooms,
          NoOfBathrooms,
          Address,
          Class,
          Rate,
          ExtraService,
          PostalCode)
      VALUES
        (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);
    `;
    // pool query
    pool.query(sql, [
      Customer,
      StartDate,
      Package,
      DayOfService,
      DayOfService2,
      TimeOfService,
      EstimatedPricing,
      ExtraNotes,
      NoOfRooms,
      NoOfBathrooms,
      Address,
      Class,
      Rate,
      ExtraService,
      PostalCode,
      callback], (err, result) => {
      if (err) {
        console.log(err);
        return callback(err);
      }
      // result accurate
      return callback(null, result);
      // pool.end()
    });
  },

  // get all class of services
  getAllClassOfService(callback) {
    // sql query statement
    const sql = 'SELECT * FROM heroku_6b49aedb7855c0b.class;';
    // pool query
    pool.query(sql, (err, result) => {
      // error
      if (err) {
        console.log(err);
        return callback(err);
      }
      // result accurate
      return callback(null, result);
      // pool.end()
    });
  },

  // get all packages
  getAllPackage(callback) {
    // sql query statement
    const sql = 'SELECT * FROM heroku_6b49aedb7855c0b.package;';
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

  // get all rates
  getAllRates(callback) {
    // sql query statement
    const sql = 'SELECT * FROM heroku_6b49aedb7855c0b.rates;';
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

  // get all additional service
  getAllAdditionalService(callback) {
    // sql query statement
    const sql = 'SELECT * FROM heroku_6b49aedb7855c0b.extraservice;';
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

  updateBookingStatus(id, callback) {
    // sql query statement
    const sql = `
            UPDATE 
            heroku_6b49aedb7855c0b.booking
         SET
           Status='Cancelled',cancelled_at=CURDATE()
        where
            BookingID=?
             ;
            `;
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

  getABookingById(id, callback) {
    // sql query statement
    const sql = ` Select b.BookingID,b.Status,b.ScheduleDate ,b.ContractId,c.TimeOfService 
    from heroku_6b49aedb7855c0b.booking b
    inner join heroku_6b49aedb7855c0b.contract c 
    on b.ContractId=c.ContractID where b.BookingID=?;`;

    // pool query
    pool.query(sql, [id], (err, result) => {
      // error
      if (err) {
        console.log(err);
        return callback(err, null);
      }
      // any results?
      if (result.length === 0) {
        // no results - callback with no err & results
        console.log('this is null');
        return callback(null, null);
      }

      return callback(null, result);
    });
  },

  checkCustomerPassword(cID, callback) {
    // sql query statement
    const sql = 'SELECT CustomerID, Password FROM heroku_6b49aedb7855c0b.customer WHERE CustomerID = ?;';

    // pool query
    pool.query(sql, [cID], (err, result) => {
      // error
      if (err) {
        console.log(err);
        return callback(err, null);
      }
      // If no data in result
      if (result.length === 0) {
        console.log('this is null');
        const error = {
          message: 'No result',
        };
        console.log(error);
        return callback(error, null);
      }
      // If resulted ID not same as input ID
      if (JSON.stringify(result[0].CustomerID) !== cID) {
        console.log('this is null');
        const error = {
          message: 'No result',
        };
        console.log(error);
        return callback(error, null);
      }
      // one result - returns result
      console.log(result);
      return callback(null, result);
    });
  },

  updateCustomerPassword(password, id, callback) {
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
module.exports = Customer;
