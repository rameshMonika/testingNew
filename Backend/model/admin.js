/* eslint-disable linebreak-style */
/* eslint-disable no-param-reassign */
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
const Admin = {

  //= ======================================================
  //              Features / Class
  //= ======================================================
  // get all class of services
  getAllClassOfService(callback) {
    // sql query statement
    const sql = 'SELECT * FROM heroku_6b49aedb7855c0b.class ;';
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
  // get class of service by id
  getClass(id, callback) {
    // sql query statement
    const sql = 'SELECT * FROM heroku_6b49aedb7855c0b.class where ClassID=?;';

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

  // add class of services
  addClass(ClassName, ClassPricing, ClassDes, callback) {
    // sql query statement
    const sql = `


        INSERT INTO
               heroku_6b49aedb7855c0b.class (
           ClassName,
           ClassPricing, 
          ClassDes)
        VALUES
        (
        ?,
        ?,
      ?
        );
`;
    // pool query
    pool.query(sql, [ClassName, ClassPricing, ClassDes], (err, result) => {
      if (err) {
        console.log(err);
        return callback(err);
      }
      // result accurate

      return callback(null, result);

      // pool.end()
    });
  },
  // update all class of services
  updateClass(ClassName, ClassPricing, ClassDes, id, callback) {
    // sql query statement
    const sql = `
            UPDATE 
            heroku_6b49aedb7855c0b.class
         SET
            ClassName=?,
            ClassPricing=?,
            ClassDes=?
        where
             ClassID=?;
            `;
    // pool query
    pool.query(sql, [ClassName, ClassPricing, ClassDes, id], (err, result) => {
      // error
      if (err) {
        console.log(err);
        return callback(err);
      }
      // result accurate
      return callback(null, result);
    });
  },
  // delete all class of services
  deleteClass(id, callback) {
    // sql query statement
    const sql = 'DELETE FROM heroku_6b49aedb7855c0b.class where ClassID =?;';

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
  //= ======================================================
  //              Features / Employee
  //= ======================================================
  // to limit and offset employee
  pageEmployee(pageNumber, callback) {
    // the page number clicked
    // eslint-disable-next-line radix
    pageNumber = parseInt(pageNumber);
    // Number of employee showed per page
    const limitPerPage = 6;
    // Number of employee to skip based on the page number so that
    // previously shown data will not be displayed
    const numberOfValueToSkip = (pageNumber - 1) * 6;
    // sql statement to limit and skip
    const sql = 'SELECT * FROM heroku_6b49aedb7855c0b.employee LIMIT ? OFFSET ?;';
    // values to pass for the query number of employee per page and number of employee to skip
    const values = [limitPerPage, numberOfValueToSkip];
    // query
    pool.query(sql, values, (err, result) => {
      // if error send error message
      if (err) {
        console.log(err);
        return callback(err);
      }
      // else send result
      return callback(null, result);
    });
  },
  // get all Employee
  getAllEmployee(callback) {
    // sql query statement
    const sql = 'SELECT * FROM heroku_6b49aedb7855c0b.employee;';
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
  getAdminEmail(callback) {
    // sql query statement
    const sql = 'SELECT Email FROM heroku_6b49aedb7855c0b.admin;';
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

  // get employee by id
  getEmployee(id, callback) {
    // sql query statement
    const sql = 'SELECT * FROM heroku_6b49aedb7855c0b.employee where EmployeeID=?;';

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

  // Get employee availability for admin to view in employee page (shuyang)
  getEmployeeAvailByID(id, date, callback) {
    // sql query statement
    const sql = `
      SELECT 
        DATE_FORMAT(ScheduleDate,'%Y-%m-%d') AS ScheduleDate, ScheduleID, TimeSlot, Employee
      FROM 
        heroku_6b49aedb7855c0b.schedule 
      WHERE 
        ScheduleDate = ? AND 
        Employee = ?;
    `;

    const values = [date, id];
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

  // get employee skills by id (shuyang)
  getEmployeeSkillsByID(id, callback) {
    // sql query statement
    const sql = 'SELECT Skillsets FROM heroku_6b49aedb7855c0b.employee where EmployeeID=?;';

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

  // update employee skills (shuyang)
  updateEmployeeSkills(EmployeeSkills, id, callback) {
    // sql query statement
    const sql = `
      UPDATE 
        heroku_6b49aedb7855c0b.employee
      SET
        Skillsets=?
      WHERE
        EmployeeID=?;
    `;
    // pool query
    pool.query(sql, [EmployeeSkills, id], (err, result) => {
      // error
      if (err) {
        console.log(err);
        return callback(err);
      }
      // result accurate
      return callback(null, result);
    });
  },

  // update employee
  updateEmployee(
    EmployeeName,
    EmployeeDes,
    EmployeeImageCloudinaryFileId,
    EmployeeImgUrl,
    EmployeeSkills,
    id,
    callback,
  ) {
    // sql query statement
    const sql = `
      UPDATE 
        heroku_6b49aedb7855c0b.employee
      SET
        EmployeeName=?,
        EmployeeDes=?,
        EmployeeImageCloudinaryFileId=?,
        EmployeeImgUrl=?,
        Skillsets=?
      WHERE
        EmployeeID=?;
    `;
    // pool query
    pool.query(sql, [
      EmployeeName,
      EmployeeDes,
      EmployeeImageCloudinaryFileId,
      EmployeeImgUrl,
      EmployeeSkills,
      id,
    ], (err, result) => {
      // error
      if (err) {
        console.log(err);
        return callback(err);
      }
      // result accurate
      return callback(null, result);
    });
  },

  // update employee
  updateEmployeeWithoutImg(
    EmployeeName,
    EmployeeDes,
    EmployeeSkills,
    id,
    callback,
  ) {
    // sql query statement
    const sql = `
        UPDATE 
          heroku_6b49aedb7855c0b.employee
        SET
          EmployeeName=?,
          EmployeeDes=?,
          Skillsets=?
        WHERE
          EmployeeID=?;
      `;
      // pool query
    pool.query(sql, [
      EmployeeName,
      EmployeeDes,
      EmployeeSkills,
      id,
    ], (err, result) => {
      // error
      if (err) {
        console.log(err);
        return callback(err);
      }
      // result accurate
      return callback(null, result);
    });
  },

  // feature/addEmployee Model
  addEmployee(
    EmployeeName,
    EmployeeDes,
    EmployeeImgageCloudinaryFileId,
    EmployeeImageUrl,
    Skillsets,
    callback,
  ) {
    // sql statement to insert new employee
    const sql = 'INSERT INTO heroku_6b49aedb7855c0b.employee (EmployeeName, EmployeeDes, EmployeeImageCloudinaryFileId, EmployeeImgUrl, Skillsets) VALUES (?,?,?,?,?);';
    // pool query
    pool.query(sql, [
      EmployeeName,
      EmployeeDes,
      EmployeeImgageCloudinaryFileId,
      EmployeeImageUrl,
      Skillsets,
    ], (err, result) => {
      // error
      if (err) {
        console.log(err);
        return callback(err);
      }
      // result accurate
      return callback(null, result); // if
    });
  },

  // delete employee
  deleteEmployee(id, callback) {
    // sql query statement
    const sql = 'DELETE FROM heroku_6b49aedb7855c0b.employee where EmployeeID =?;';

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

  //= ======================================================
  //              Features / Booking
  //= ======================================================

  // get all booking
  getAllBooking(callback) {
    // sql query statement
    const sql = `
  SELECT
  b.BookingID,b.Admin,DATE_FORMAT(b.ScheduleDate,'%Y-%m-%d') As ScheduleDate,b.ContractID,cu.FirstName,cu.LastName,e.EmployeeName,b.Status,p.PackageName,cl.ClassName,DATE_FORMAT(c.StartDate,'%Y-%m-%d') AS StartDate,c.TimeOfService,c.NoOfBathrooms,c.NoOfRooms,c.Rate,c.EstimatedPricing,c.Address
  FROM
  heroku_6b49aedb7855c0b.booking b
  join heroku_6b49aedb7855c0b.contract c on b.ContractId = c.ContractId
  join heroku_6b49aedb7855c0b.customer cu on c.Customer = cu.CustomerID
  join heroku_6b49aedb7855c0b.package p on c.Package = p.PackageID
  left join heroku_6b49aedb7855c0b.employee e on b.Employee = e.EmployeeID
  join heroku_6b49aedb7855c0b.class cl on c.Class = cl.ClassID
  order by
month(b.ScheduleDate) desc,day(b.ScheduleDate) asc
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

  // get class of service by id
  getBooking(id, callback) {
    // sql query statement
    const sql = 'SELECT * FROM heroku_6b49aedb7855c0b.booking where BookingID=?;';

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
  // to limit and offset booking
  pageBooking(pageNumber, callback) {
    // the page number clicked
    pageNumber = parseInt(pageNumber, 10);
    // Number of employee showed per page
    const limitPerPage = 6;
    // Prevent displaying repetitive information
    const numberOfValueToSkip = (pageNumber - 1) * 6;

    // sql statement to limit and skip
    const sql = `
    SELECT
    b.BookingID,b.Admin,DATE_FORMAT(b.ScheduleDate,'%Y-%m-%d') AS ScheduleDate,b.ContractID,cu.FirstName,cu.LastName,e.EmployeeName,b.Status,p.PackageName,
    cl.ClassName,DATE_FORMAT(c.StartDate,'%Y-%m-%d') AS StartDate,c.TimeOfService,c.NoOfBathrooms,c.NoOfRooms,c.Rate,c.EstimatedPricing,c.Address,a.FirstName as AdminFName,a.LastName as AdminLName
    FROM
    heroku_6b49aedb7855c0b.booking b
    join heroku_6b49aedb7855c0b.contract c on b.ContractId = c.ContractId
    join heroku_6b49aedb7855c0b.customer cu on c.Customer = cu.CustomerID
    join heroku_6b49aedb7855c0b.package p on c.Package = p.PackageID
    left join heroku_6b49aedb7855c0b.employee e on b.Employee = e.EmployeeID
    left join heroku_6b49aedb7855c0b.admin a on b.Admin = a.AdminID
    join heroku_6b49aedb7855c0b.class cl on c.Class = cl.ClassID
    order by
month(b.ScheduleDate) desc,day(b.ScheduleDate) asc
    LIMIT ? OFFSET ?;
  
    `;
    // values to pass for the query number of employee per page and number of employee to skip
    const values = [limitPerPage, numberOfValueToSkip];
    // query
    pool.query(sql, values, (err, result) => {
      // if error send error message
      if (err) {
        console.log(err);
        return callback(err);
      }
      // else send result
      return callback(null, result);
    });
  },

  // add booking of services
  addOneBooking(Contract, ScheduleDate, AdminID, callback) {
    // sql query statement

    const sql = `
    INSERT INTO
    heroku_6b49aedb7855c0b.booking (
    Contract,
    ScheduleDate, 
    Status,
    Admin)
    VALUES
    (?,?,'Pending',?);
`;
    // pool query
    pool.query(sql, [Contract, ScheduleDate, AdminID], (err, result) => {
      if (err) {
        console.log(err);
        return callback(err);
      }
      // result accurate

      return callback(null, result);

      // pool.end()
    });
  },

  // update all booking of services
  updateBooking(ScheduleDate, BookingID, callback) {
    // sql query statement
    const sql = `
          UPDATE heroku_6b49aedb7855c0b.booking SET ScheduleDate= ? WHERE BookingID= ?;  
              `;
    // pool query
    pool.query(sql, [ScheduleDate, BookingID], (err, result) => {
      // error
      if (err) {
        console.log(err);
        return callback(err);
      }
      // result accurate
      return callback(null, result);
    });
  },

  // get all booking with the status of Assigned and Pending
  getAllBookingCancel(callback) {
    // sql query statement
    const sql = `
        SELECT
        b.BookingID,b.Admin,b.ScheduleDate,b.ContractId,cu.FirstName,cu.LastName,e.EmployeeName,b.Status,p.PackageName,cl.ClassName,DATE_FORMAT(c.StartDate,'%Y-%m-%d') AS StartDate,c.TimeOfService,c.NoOfBathrooms,c.NoOfRooms,c.Rate,c.EstimatedPricing,c.Address
        FROM
        heroku_6b49aedb7855c0b.booking b
        join heroku_6b49aedb7855c0b.contract c on b.ContractId = c.ContractID
        join heroku_6b49aedb7855c0b.customer cu on c.Customer = cu.CustomerID
        join heroku_6b49aedb7855c0b.package p on c.Package = p.PackageID
        left join heroku_6b49aedb7855c0b.employee e on b.Employee = e.EmployeeID
        join heroku_6b49aedb7855c0b.class cl on c.Class = cl.ClassID where b.Status='Assigned' or b.Status='Pending'  order by
        month(b.ScheduleDate) desc,day(b.ScheduleDate) asc;
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

  // to limit and offset booking
  pageBookingCancel(pageNumber, callback) {
    // the page number clicked
    pageNumber = parseInt(pageNumber, 10);
    // Number of employee showed per page
    const limitPerPage = 6;
    // Prevent displaying repetitive information
    const numberOfValueToSkip = (pageNumber - 1) * 6;

    // sql statement to limit and skip
    const sql = `
      SELECT
      b.BookingID,b.Admin,b.ScheduleDate,b.ContractId,cu.FirstName,cu.LastName,e.EmployeeName,b.Status,p.PackageName,cl.ClassName,DATE_FORMAT(c.StartDate,'%Y-%m-%d') AS StartDate,c.TimeOfService,c.NoOfBathrooms,c.NoOfRooms,c.Rate,c.EstimatedPricing,c.Address
      FROM
      heroku_6b49aedb7855c0b.booking b
      join heroku_6b49aedb7855c0b.contract c on b.ContractId = c.ContractID
      join heroku_6b49aedb7855c0b.customer cu on c.Customer = cu.CustomerID
      join heroku_6b49aedb7855c0b.package p on c.Package = p.PackageID
      left join heroku_6b49aedb7855c0b.employee e on b.Employee = e.EmployeeID
      join heroku_6b49aedb7855c0b.class cl on c.Class = cl.ClassID where b.Status='Assigned' or b.Status='Pending'  order by
      month(b.ScheduleDate) desc,day(b.ScheduleDate) asc  LIMIT ? OFFSET ?;
    
      `;
    // values to pass for the query number of employee per page and number of employee to skip
    const values = [limitPerPage, numberOfValueToSkip];
    // query
    pool.query(sql, values, (err, result) => {
      // if error send error message
      if (err) {
        console.log(err);
        return callback(err);
      }
      // else send result
      return callback(null, result);
    });
  },

  // cancel admin booking
  cancelBookingAdmin(bookingId, callback) {
    // sql query statement

    const sql = `
      UPDATE 
        heroku_6b49aedb7855c0b.booking
      SET
        Status = "Cancelled",
        cancelled_at = CURDATE()
      WHERE
        BookingID = ?;
    `;
    // pool query
    pool.query(sql, [bookingId], (err, result) => {
      // error
      if (err) {
        console.log(err);
        return callback(err);
      }
      // result accurate
      return callback(null, result);
    });
  },

  // ---------------------------------------------------
  //                 Feature/adminCustomer
  // ---------------------------------------------------
  // get available employee for scheduling
  getAvailableEmployee(date, callback) {
    // sql query statement
    const sql = `
      SELECT DISTINCT
        e.EmployeeID, e.EmployeeName, e.EmployeeDes, e.EmployeeImgUrl, e.EmployeeImageCloudinaryFileId
      FROM 
        heroku_6b49aedb7855c0b.employee AS e
      LEFT JOIN 
        heroku_6b49aedb7855c0b.schedule AS s 
      ON 
        s.Employee = e.EmployeeID 
      WHERE
        ScheduleDate IS NULL OR ScheduleDate != ? 
      AND 
        Employee NOT IN (SELECT s.Employee FROM heroku_6b49aedb7855c0b.schedule s WHERE ScheduleDate = ?);
      `;

    const values = [date, date];
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

  // add employee availability
  addEmployeeAvailability(employeeId, date, time, callback) {
    // sql query statement
    const sql = `
      INSERT INTO
        heroku_6b49aedb7855c0b.schedule (
          ScheduleDate,
          TimeSlot, 
          Employee)
      VALUES
        (?,?,?);
    `;
    // pool query
    pool.query(sql, [date, time, employeeId], (err, result) => {
      if (err) {
        console.log(err);
        return callback(err);
      }
      // result accurate
      return callback(null, result);
      // pool.end()
    });
  },
  // get all Customer
  getAllCustomer(callback) {
    // sql query statement
    const sql = 'SELECT CustomerID, FirstName, LastName, Email, Password, Status FROM heroku_6b49aedb7855c0b.customer;';
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

  // get one Customer by id
  getCustomer(id, callback) {
    // sql query statement
    const sql = 'SELECT CustomerID, FirstName, LastName, Password, Status, PhoneNumber FROM heroku_6b49aedb7855c0b.customer WHERE CustomerID=?;';

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

  // delete customer
  deleteCustomer(id, callback) {
    console.log(` admin.js customer delete method start ${id}`);
    // sql query statement
    const sql = 'DELETE FROM heroku_6b49aedb7855c0b.customer where CustomerID =?;';

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

  // update customer
  updateCustomer(CustomerPassword, CustomerStatus, id, callback) {
    // sql query statement
    const sql = `
    UPDATE 
      heroku_6b49aedb7855c0b.customer
    SET
      Password=?,
      Status=?
    WHERE
      CustomerID=?;
  `;
    // pool query
    pool.query(sql, [CustomerPassword, CustomerStatus, id], (err, result) => {
      // error
      if (err) {
        console.log(err);
        return callback(err);
      }
      // result accurate
      return callback(null, result);
    });
  },

  // ---------------------------------------------------
  //                 Feature/rates
  // ---------------------------------------------------

  // get all rates
  getAllRates(callback) {
    // sql query statement
    const sql = 'SELECT rates.RatesID, rates.RateName, rates.RatePrice, package.PackageName FROM heroku_6b49aedb7855c0b.rates AS rates INNER JOIN heroku_6b49aedb7855c0b.package AS package ON rates.Package = package.PackageID;';
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

  // get rate by id
  getRate(id, callback) {
    // sql query statement
    const sql = 'SELECT * FROM heroku_6b49aedb7855c0b.rates where RatesID=?;';

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
  // get rate by id
  getRateByPackage(id, callback) {
    // sql query statement
    const sql = 'SELECT * FROM heroku_6b49aedb7855c0b.rates where Package=?;';

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
  // add new rate
  addRate(RateName, RatePrice, Package, callback) {
    // sql query statement
    const sql = `
        INSERT INTO
              heroku_6b49aedb7855c0b.rates (
                RateName,
                RatePrice,
                Package)
        VALUES
        (
        ?,
        ?,
        ?
        );
`;
    // pool query
    pool.query(sql, [RateName, RatePrice, Package], (err, result) => {
      if (err) {
        console.log(err);
        return callback(err);
      }
      // result accurate

      return callback(null, result);

      // pool.end()
    });
  },

  // update existing rate
  updateRate(RateName, RatePrice, Package, id, callback) {
    // sql query statement
    const sql = `
            UPDATE 
            heroku_6b49aedb7855c0b.rates
         SET
            RateName=?,
            RatePrice=?,
            Package=?
        where
            RatesID=?
             ;
            `;
    // pool query
    pool.query(sql, [RateName, RatePrice, Package, id], (err, result) => {
      // error
      if (err) {
        console.log(err);
        return callback(err);
      }
      // result accurate
      return callback(null, result);
    });
  },

  // delete existing rate
  deleteRate(id, callback) {
    // sql query statement
    const sql = 'DELETE FROM heroku_6b49aedb7855c0b.rates where RatesID =?;';

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
  //= ======================================================
  //              Features / ExtraServices
  //= ======================================================
  // get all extra services
  getAllExtraServices(callback) {
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

  // get extra service by id
  getExtraService(id, callback) {
    // sql query statement
    const sql = 'SELECT * FROM heroku_6b49aedb7855c0b.extraservice where ExtraServiceID=?;';

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

  // add new extra service
  addExtraService(ExtraServiceName, ExtraServicePrice, callback) {
    // sql query statement
    const sql = `
      INSERT INTO
             heroku_6b49aedb7855c0b.extraservice (
              ExtraServiceName,
              ExtraServicePrice)
      VALUES
      (
      ?,
      ?
      );
`;
    // pool query
    pool.query(sql, [ExtraServiceName, ExtraServicePrice], (err, result) => {
      if (err) {
        console.log(err);
        return callback(err);
      }
      // result accurate

      return callback(null, result);

      // pool.end()
    });
  },

  // update existing extra service
  updateExtraService(ExtraServiceName, ExtraServicePrice, id, callback) {
    // sql query statement
    const sql = `
          UPDATE 
          heroku_6b49aedb7855c0b.extraservice
       SET
          ExtraServiceName=?,
          ExtraServicePrice=?
      where
          ExtraServiceID=?
           ;
          `;
    // pool query
    pool.query(sql, [ExtraServiceName, ExtraServicePrice, id], (err, result) => {
      // error
      if (err) {
        console.log(err);
        return callback(err);
      }
      // result accurate
      return callback(null, result);
    });
  },

  // delete existing extra service
  deleteExtraService(id, callback) {
    // sql query statement
    const sql = 'DELETE FROM heroku_6b49aedb7855c0b.extraservice where ExtraServiceID =?;';

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

  //= ======================================================
  //              Features / Assign
  //= ======================================================
  getBookingDetails(id, callback) {
    // sql query statement
    const sql = `SELECT cu.CustomerID, b.BookingID,DATE_FORMAT(b.ScheduleDate,'%Y-%m-%d') as ScheduleDate,c.Address,c.NoOfRooms,c.NoOfBathrooms,c.EstimatedPricing,c.ExtraNotes,cu.FirstName,cu.LastName,r.RateName,e.EmployeeName
    FROM heroku_6b49aedb7855c0b.booking as b
    join heroku_6b49aedb7855c0b.contract as c on b.ContractId = c.ContractID
    join heroku_6b49aedb7855c0b.customer as cu on c.Customer = cu.CustomerID
    join heroku_6b49aedb7855c0b.rates as r on c.Rate = r.RatesID
    left join heroku_6b49aedb7855c0b.employee as e on b.Employee = e.EmployeeID
    where b.BookingID=?;`;

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
  getEmployeeAvailabilty(bookingDate, callback) {
    // sql query statement
    const sql = `SELECT e.EmployeeName,e.EmployeeDes,e.EmployeeImgUrl,DATE_FORMAT(s.ScheduleDate,'%Y-%m-%d') AS FormatScheduleDate,e.EmployeeID,b.*
    FROM heroku_6b49aedb7855c0b.employee as e
    left join heroku_6b49aedb7855c0b.schedule as s on e.EmployeeID = s.Employee
    left join heroku_6b49aedb7855c0b.booking as b on e.EmployeeID = b.Employee
    
    Having FormatScheduleDate= ?;`;

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
  assignBooking(EmployeeID, AdminID, BookingID, callback) {
    // sql query statement
    console.log(`${EmployeeID + BookingID} suPPP`);
    const sql = `
    UPDATE heroku_6b49aedb7855c0b.booking SET Employee = ? , Admin = ? , Status = 'Assigned' WHERE BookingID= ?;  
              `;
    // pool query
    pool.query(sql, [EmployeeID, AdminID, BookingID], (err, result) => {
      // error
      if (err) {
        console.log(err);
        return callback(err);
      }
      // result accurate
      return callback(null, result);
    });
  },

  //= ======================================================
  //              Features / Profile
  //= ======================================================
  //= ======================================================
  //              Features / adminDashboard
  //= ======================================================

  getAdminById(cID, callback) {
    // sql query statement
    const sql = 'SELECT FirstName, LastName, Email FROM heroku_6b49aedb7855c0b.admin WHERE AdminID = ?;';

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

  updateAdminProfile(firstName, lastName, email, id, callback) {
    // sql query statement
    const sql = `
            UPDATE 
            heroku_6b49aedb7855c0b.admin
         SET
            FirstName=?,
            LastName=?,
            Email=?
        where
            AdminID=?
             ;
            `;
    // pool query
    pool.query(sql, [firstName, lastName, email, id], (err, result) => {
      // error
      if (err) {
        console.log(err);
        return callback(err);
      }
      // result accurate
      return callback(null, result);
    });
  },

  checkAdminPassword(cID, currentPassword, callback) {
    // sql query statement
    const sql = 'SELECT AdminID FROM heroku_6b49aedb7855c0b.admin WHERE AdminID = ? AND Password = ?;';

    // pool query
    pool.query(sql, [cID, currentPassword], (err, result) => {
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
      // any results?
      if (JSON.stringify(result[0].AdminID) !== cID) {
        // no results - callback with no err & results
        // console.log(typeof result[0].AdminID);
        // console.log(typeof cID);
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

  updateAdminPassword(password, id, callback) {
    // sql query statement
    const sql = `
            UPDATE 
            heroku_6b49aedb7855c0b.admin
         SET
            Password = ?
        where
            AdminID = ?
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

  // get number of booking made by therir month
  getBookingByMonth(callback) {
    // sql query statement to get number of booking made by therir month
    const sql = ` select month(ScheduleDate) as month, count(ScheduleDate) as numberOfBooking, Status 
  from heroku_6b49aedb7855c0b.booking 
  WHERE     year(ScheduleDate) = year(curdate())  and Status='Completed'
  group by month(ScheduleDate);
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

  getRevenueOfTheMonth(callback) {
    // sql query statement to get revenue
    const sql = `
  select c.ContractID ,(c.EstimatedPricing * count(b.BookingID))
  as Revenue,count(b.BookingID) from heroku_6b49aedb7855c0b.contract 
  as c
   join heroku_6b49aedb7855c0b.booking as b
  on  c.ContractID=b.ContractId
  where (month(b.ScheduleDate) = month(CURRENT_DATE()) and year(b.ScheduleDate)=year(current_date())) and b.Status='Completed'
  group by c.ContractID
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
  getAllContracts(callback) {
    // sql query statement
    const sql = `
    select c.ContractId,DATE_FORMAT(c.StartDate,'%Y-%m-%d') AS StartDate,cu.FirstName,cu.LastName,p.PackageName,cl.ClassName,DATE_FORMAT(c.StartDate,'%Y-%m-%d') AS StartDate,c.TimeOfService,c.NoOfBathrooms,c.NoOfRooms,c.Rate,c.EstimatedPricing,c.Address
    FROM
    heroku_6b49aedb7855c0b.contract c
    join heroku_6b49aedb7855c0b.customer cu on c.Customer = cu.CustomerID
    join heroku_6b49aedb7855c0b.package p on c.Package = p.PackageID
    join heroku_6b49aedb7855c0b.class cl on c.Class = cl.ClassID
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
  pageContract(pageNumber, callback) {
    // the page number from parameter
    pageNumber = parseInt(pageNumber, 10);
    // Number of Contract showed per page
    const limitPerPage = 6;
    // Prevent displaying repetitive information
    const numberOfValueToSkip = (pageNumber - 1) * 6;

    // sql statement to limit and skip
    const sql = `
    select c.ContractId,DATE_FORMAT(c.StartDate,'%Y-%m-%d') AS StartDate,cu.FirstName,c.DayOfService,c.DayOfService2,cu.LastName,p.PackageName,cl.ClassName,r.RateName,DATE_FORMAT(c.StartDate,'%Y-%m-%d') AS StartDate,c.TimeOfService,c.NoOfBathrooms,c.NoOfRooms,c.Rate,c.EstimatedPricing,c.Address
    FROM
    heroku_6b49aedb7855c0b.contract c
    join heroku_6b49aedb7855c0b.customer cu on c.Customer = cu.CustomerID
    join heroku_6b49aedb7855c0b.package p on c.Package = p.PackageID
    join heroku_6b49aedb7855c0b.rates r on c.Rate = r.RatesID
    join heroku_6b49aedb7855c0b.class cl on c.Class = cl.ClassID 
    ORDER BY c.StartDate desc
    LIMIT ? OFFSET ? ;

  `;
    // values to pass for the query number of contract per page and number of contract to skip
    const values = [limitPerPage, numberOfValueToSkip];
    // query
    pool.query(sql, values, (err, result) => {
      // if error send error message
      if (err) {
        console.log(err);
        return callback(err);
      }
      // else send result
      return callback(null, result);
    });
  },
  getCancellationAbnormailtyDetails(callback) {
    // sql query statement
    const sql = `
    SELECT distinct
    b.ContractId,c.Customer,cu.FirstName,cu.LastName
  FROM 
    heroku_6b49aedb7855c0b.booking as b 
      left join heroku_6b49aedb7855c0b.contract as c
  on c.ContractId =b.ContractId 
      left join heroku_6b49aedb7855c0b.customer as cu
  on c.Customer =cu.CustomerID 
  where b.Status="Cancelled"
   and Month(b.ScheduleDate)=Month(curdate())
   group by c.Customer
    
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
  getCancellationAbnormailtyDisplay(callback) {
    // sql query statement
    const sql = `
    
 SELECT distinct
 cab.CancelBookingAbn,c.Customer,cu.FirstName,cu.LastName
 FROM 
   heroku_6b49aedb7855c0b.booking as b 
     left join heroku_6b49aedb7855c0b.contract as c
 on c.ContractId =b.ContractId 
     left join heroku_6b49aedb7855c0b.customer as cu
 on c.Customer =cu.CustomerID 
 left join heroku_6b49aedb7855c0b.cancel_booking_abnormality as cab
 on cu.CustomerID=cab.CustomerID
 where( b.Status="Cancelled"
  and Month(b.ScheduleDate)=Month(curdate())-1) and cab.AbnormalityStatus="Unresolved"
  group by c.Customer;
    
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
  insertCancelAbnormality(CustomerID, callback) {
    // sql query statement
    const sql = `
    INSERT INTO
    heroku_6b49aedb7855c0b.cancel_booking_abnormality (
     CustomerID
  )
VALUES
(
?
);
`;
    // pool query
    pool.query(sql, [CustomerID], (err, result) => {
      if (err) {
        console.log(err);
        return callback(err);
      }
      // result accurate

      return callback(null, result);

      // pool.end()
    });
  },
  getAllCancelAbnormalities(callback) {
    // sql query statement
    const sql = `
    SELECT * FROM heroku_6b49aedb7855c0b.cancel_booking_abnormality
where month(created_at)=month(curdate())-1;

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
  updateCancelAbnormaityStatus(id, callback) {
    // sql query statement
    const sql = `
    UPDATE heroku_6b49aedb7855c0b.cancel_booking_abnormality
    SET AbnormalityStatus = "Resolved"
    WHERE CustomerID=?;
       
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
  updateCustomerStatus(id, callback) {
    // sql query statement
    const sql = `
    UPDATE heroku_6b49aedb7855c0b.customer
    SET Status = "suspend"
    WHERE CustomerID=?;
       
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
  getAContractByID(id, callback) {
    // sql query statement
    const sql = 'SELECT Customer,DayOfService, DayOfService2, EstimatedPricing, ContractID FROM heroku_6b49aedb7855c0b.contract where ContractID=?;';

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
  getNumberOfBookingCancelledTheMonth(id, callback) {
    // sql query statement
    const sql = `SELECT count(BookingID) as NumBookingCancel FROM
    heroku_6b49aedb7855c0b.booking where (month(cancelled_at)=month(curdate())) and ContractId=?;`;

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
  getBookingCancelledTheMonthById(id, callback) {
    // sql query statement
    const sql = `SELECT * FROM heroku_6b49aedb7855c0b.booking where
    (month(cancelled_at)=month(curdate())) and ContractId=? ;`;

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
  //= ======================================================
  //              Features / inActiveCustomer
  //= ======================================================
  getAllInActiveCustomer(callback) {
    // sql query statement
    const sql = `
    SELECT CustomerID,FirstName,LastName,PhoneNumber FROM heroku_6b49aedb7855c0b.customer
    where CustomerID not in
     (SELECT distinct Customer FROM heroku_6b49aedb7855c0b.contract);
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
  pageInactiveCustomers(pageNumber, callback) {
    // the page number from parameter
    pageNumber = parseInt(pageNumber, 10);
    // Number of Contract showed per page
    const limitPerPage = 6;
    // Prevent displaying repetitive information
    const numberOfValueToSkip = (pageNumber - 1) * 6;

    // sql statement to limit and skip
    const sql = `
    SELECT CustomerID,FirstName,LastName,PhoneNumber FROM heroku_6b49aedb7855c0b.customer
    where CustomerID not in
     (SELECT distinct Customer FROM heroku_6b49aedb7855c0b.contract) LIMIT ? OFFSET ?;

  `;
    // values to pass for the query number of contract per page and number of contract to skip
    const values = [limitPerPage, numberOfValueToSkip];
    // query
    pool.query(sql, values, (err, result) => {
      // if error send error message
      if (err) {
        console.log(err);
        return callback(err);
      }
      // else send result
      return callback(null, result);
    });
  },
  updateCustomerStatusInactive(id, callback) {
    // sql query statement
    const sql = `
    UPDATE 
    heroku_6b49aedb7855c0b.customer
 SET
    Status = 'inactive'
where
    CustomerID = ?
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
  updateCustomerStatusActive(id, callback) {
    // sql query statement
    const sql = `
    UPDATE 
    heroku_6b49aedb7855c0b.customer
 SET
    Status = 'active'
where
    CustomerID = ?
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
  deleteInactiveCustomer(id, callback) {
    // sql query statement
    const sql = `
    DELETE from
    heroku_6b49aedb7855c0b.customer
where
    CustomerID = ?
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

  //= ======================================================
  //              Features / abnormalities
  //= ======================================================
  // Scan through contract table to find contract abnormality records
  scanAbnormalContract(callback) {
    // sql query statement
    const sql = `
      SELECT 
      cu.FirstName, cu.LastName, cu.Email, c.Customer, count(c.Customer) AS TotalContract
      FROM 
       heroku_6b49aedb7855c0b.contract as c,
        heroku_6b49aedb7855c0b.customer as cu
      WHERE 
      c.Customer = cu.CustomerID
       AND c.contractStatus != 'inactive'
      GROUP BY 
      Customer
      HAVING 
     count(Customer) >= 5
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

  // Insert new found contract abnormality record into contract_abnormality table
  newContractAbnormality(CustomerID, NoOfAbnContracts, callback) {
    // sql query statement
    const sql = `
      INSERT INTO
        heroku_6b49aedb7855c0b.contract_abnormality (
          UserID,
          TotalAbnContracts)
      VALUES
        (?,?);
    `;
    // pool query
    pool.query(sql, [CustomerID, NoOfAbnContracts], (err, result) => {
      // error
      if (err) {
        console.log(err);
        return callback(err);
      }
      // result accurate

      return callback(null, result); // if
    });
  },

  // Get contract abnormality by customer
  checkAbnContractById(CustomerID, callback) {
    // sql query statement
    const sql = `
      SELECT 
        *
      FROM
        heroku_6b49aedb7855c0b.contract_abnormality
      WHERE
        UserID = ?;
    `;
    // pool query
    pool.query(sql, [CustomerID], (err, result) => {
      // error
      if (err) {
        console.log(err);
        return callback(err);
      }
      // result accurate

      return callback(null, result); // if
    });
  },

  // Update Total Abnormal contract by customer
  updateNumOfAbnContracts(numOfContracts, CustomerID, status, callback) {
    // sql query statement
    const sql = `
      UPDATE 
        heroku_6b49aedb7855c0b.contract_abnormality
      SET
        TotalAbnContracts = ?
      where
        UserID = ? AND 
        AbnormalStatus = ?;
     ;
    `;
    // pool query
    pool.query(sql, [numOfContracts, CustomerID, status], (err, result) => {
      // error
      if (err) {
        console.log(err);
        return callback(err);
      }
      // result accurate

      return callback(null, result); // if
    });
  },

  // Get the number of contract abnormalities per customer
  getNumOfAbnormalContracts(callback) {
    // sql query statement
    const sql = `
      SELECT 
        cab.UserID, TotalAbnContracts, c.FirstName, c.LastName, c.Email, cab.AbnormalStatus
      FROM
        heroku_6b49aedb7855c0b.contract_abnormality AS cab,
        heroku_6b49aedb7855c0b.customer AS c
      WHERE
        cab.UserID = c.CustomerID;
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

  getAbnormalContracts(callback) {
    // sql query statement
    const sql = `
      SELECT 
      cab.ContractAbnId, cab.UserID, TotalAbnContracts, c.FirstName, c.LastName, c.Email, cab.AbnormalStatus
      FROM
        heroku_6b49aedb7855c0b.contract_abnormality AS cab,
        heroku_6b49aedb7855c0b.customer AS c
      WHERE
        cab.UserID = c.CustomerID AND 
        cab.AbnormalStatus != 'Resolved';
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

  getAbnormalContractsByID(CustomerID, contractNum, callback) {
    // sql query statement
    const sql = `
      SELECT DISTINCT
      ca.ContractID, c.FirstName, c.LastName, c.Email, ca.Created_At
      FROM 
      heroku_6b49aedb7855c0b.contract AS ca,
        heroku_6b49aedb7855c0b.customer AS c,
        heroku_6b49aedb7855c0b.contract_abnormality AS cab
      WHERE
     ca.Customer = c.CustomerID AND
        cab.UserID = c.CustomerID AND
        cab.AbnormalStatus != 'Resolved' AND
        ca.contractStatus != 'inactive' AND
        c.CustomerID = ?
      ORDER BY
      ca.Created_At DESC LIMIT ?;
    `;
    // pool query
    pool.query(sql, [CustomerID, contractNum], (err, result) => {
      // error
      if (err) {
        console.log(err);
        return callback(err);
      }
      // result accurate

      return callback(null, result); // if
    });
  },

  resolveAbnormalContract(ContractId, callback) {
    // sql query statement
    const sql = `
      UPDATE
        heroku_6b49aedb7855c0b.contract_abnormality
      SET
        AbnormalStatus = 'Resolved'
      WHERE
        ContractAbnId = ?;
    `;
    // pool query
    pool.query(sql, [ContractId], (err, result) => {
      // error
      if (err) {
        console.log(err);
        return callback(err);
      }
      // result accurate

      return callback(null, result); // if
    });
  },

  cancelAbnormalContract(ContractId, callback) {
    // sql query statement
    const sql = `
      UPDATE
        heroku_6b49aedb7855c0b.contract
      SET
        contractStatus = 'inactive'
      WHERE
        ContractID = ?;
    `;
    // pool query
    pool.query(sql, [ContractId], (err, result) => {
      // error
      if (err) {
        console.log(err);
        return callback(err);
      }
      // result accurate

      return callback(null, result); // if
    });
  },

  editContractInfo(dayOfService1, dayOfService2, estimatedPricing, contractId, callback) {
    // sql query statement
    const sql = `
            UPDATE 
            heroku_6b49aedb7855c0b.contract
         SET
            DayofService=?,
            DayofService2=?,
            EstimatedPricing=?
        where
            ContractID=?
             ;
            `;
    // pool query
    pool.query(sql, [dayOfService1, dayOfService2, estimatedPricing, contractId], (err, result) => {
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
module.exports = Admin;
