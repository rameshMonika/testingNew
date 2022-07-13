/* eslint-disable linebreak-style */
/* eslint-disable consistent-return */
/* eslint-disable no-console */
/* eslint-disable no-plusplus */

// code
/* eslint-disable no-shadow */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

// ====================== Imports ======================
const express = require('express');

const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const moment = require('moment-weekdaysin');
// Email handler
const nodemailer = require('nodemailer');

// Unique String
const { v4: uuidv4 } = require('uuid');

// env variables
require('dotenv').config();

// bcrypt
const bcrypt = require('bcryptjs');
const helmet = require('helmet');
const cloudinary = require('../utils/cloudinary');
const upload = require('../utils/multer');
const verifyToken = require('../auth/isLoggedInMiddleWare');
const verifyTokenCustomer = require('../auth/isLoggedInMiddleWareCustomer');

// ------------------ model ------------------
const Login = require('../model/login');
const Admin = require('../model/admin');
const Customer = require('../model/customer');
const Register = require('../model/register');
const SuperAdmin = require('../model/superAdmin');
const forgetPassword = require('../model/forgetPassword');
// const { json } = require('body-parser');

const currentUrl = 'http://localhost:5000';
// const currentUrl = 'https://moc-ba.herokuapp.com;

// MF function
/**
 * prints useful debugging information about an endpoint we are going to service
 *
 * @param {object} req
 *   request object
 *
 * @param {object} res
 *   response object
 *
 * @param {function} next
 *   reference to the next function to call
 */

// ====================== MiddleWare Functions ======================
function printDebugInfo(req, res, next) {
  console.log();
  console.log('-----------------[Debug Info]----------------');
  // console.log(`Servicing ${urlPattern} ..`);
  console.log(`Servicing ${req.url}..`);

  console.log(`> req.params:${JSON.stringify(req.params)}`);
  console.log(`> req.body:${JSON.stringify(req.body)}`);
  // console.log("> req.myOwnDebugInfo:" + JSON.stringify(req.myOwnDebugInfo));

  console.log('---------------[Debug Info Ends]----------------');
  console.log();

  next();
}

const urlEncodedParser = bodyParser.urlencoded({ extended: false });
const jsonParser = bodyParser.json();

// MF Configurations
app.use(urlEncodedParser);
app.use(jsonParser);
app.use(helmet());
app.options('*', cors());
app.use(cors());

app.get('/', (req, res) => {
  res.status(200).send('HelloWorld');
});

// ====================== User Section ======================
// forgetPassword
app.post('/forgetPassword', printDebugInfo, async (req, res, next) => {
  const { email } = req.body;
  forgetPassword.Verify(email, (err, link, result) => {
    // mail options
    const mailOptions = {
      from: process.env.AUTH_EMAIL,
      to: email,
      subject: 'MOC - Forget Password Link',
      html: `
    <p>Hi ${result.FirstName}</p>
    <p>This <b>links expires in 15 Min</b>.</p>
    <p>Press <a href='${`${link}`}'>here</a> to reset your password</p>
   `,
    };

    let msg;
    if (!err) {
      if (!result) {
        msg = {
          Error: 'Invalid login',
        };
        res.status(404).send(msg);
      } else {
        // eslint-disable-next-line no-use-before-define
        transporter
          .sendMail(mailOptions)
          .then(() => {
            msg = 'sent';
            console.log('email sent');
            // email sent and verification record saved
            res.status(200).send({
              status: 'Pending',
              message: 'Reset Password email sent',
            });
          })
          .catch((error) => {
            console.log(`error: ${error}`);
            res.status(404).json({
              status: 'Failed',
              message: 'Reset Password email failed!',
            });
          });
      }
    } else if (err.code === 'ER_TRUNCATED_WRONG_VALUE_FOR_FIELD') {
      // if err.code === ER_TRUNCATED_WRONG_VALUE_FOR_FIELD
      // send Inappropriate value as return message
      res.status(406).send('Inappropriate value');
    } else if (err.code === 'ER_BAD_NULL_ERROR') {
      // if err.code === ER_BAD_NULL_ERROR send Null value not allowed as return message
      res.status(400).send('Null value not allowed');
    } else {
      // else if there is a server error return message
      res.status(500).send('Internal Server Error');
    }
  });
});

app.put('/resetUserPassword/:id/:token', printDebugInfo, verifyTokenCustomer, async (req, res) => {
  // extract id from params
  const { id, token } = req.params;
  const { password } = req.body;
  // calling getAdminById method from Admin model
  forgetPassword.updateUserPassword(password, id, (err, result) => {
    if (!err) {
      // if admin id is not found detect and return error message
      if (result.length === 0) {
        const output = {
          Error: 'Id not found',
        };
        res.status(404).send(output);
      } else {
        // output
        res.status(200).send(result);
      }
    } else if (err.code === 'ER_TRUNCATED_WRONG_VALUE_FOR_FIELD') {
      // if err.code === ER_TRUNCATED_WRONG_VALUE_FOR_FIELD
      // send Inappropriate value as return message
      res.status(406).send('Inappropriate value');
    } else if (err.code === 'ER_BAD_NULL_ERROR') {
      // if err.code === ER_BAD_NULL_ERROR send Null value not allowed as return message
      res.status(400).send('Null value not allowed');
    } else {
      // else if there is a server error return message
      res.status(500).send('Internal Server Error');
    }
  });
});

// get all Login

// nodemailer stuff
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  service: 'gmail',
  secure: true,
  auth: {
    user: process.env.AUTH_EMAIL,
    pass: process.env.AUTH_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// testing success
transporter.verify((error, success) => {
  if (error) {
    console.log(`${error}`);
  } else {
    console.log('Ready for messages');
    console.log(success);
  }
});

// send verification email
const sendVerificationEmail = ({ _id, email }, res) => {
  // url to be used in the email

  const UniqueString = uuidv4() + _id;

  // mail options
  const mailOptions = {
    from: process.env.AUTH_EMAIL,
    to: email,
    subject: 'Verify Your Email',
    html: `
    <p>Verify your email address to complete this signup and login to your account.</p>
    <p>This <b>links expires in 6 hours</b>.</p>
    <p>Press <a href='${`${currentUrl}/verify/${_id}/${UniqueString}`}'>here</a></p>`,
  };

  // hash the uniqueString
  const saltRounds = 10;
  bcrypt
    .hash(UniqueString, saltRounds)
    .then((hashedUniqueString) => {
      const createdAt = Date.now();
      const expiresAt = Date.now() + 21600000;
      console.log(`createdAt: ${createdAt}, expiresAt: ${expiresAt}`);
      // set values in userVerification collection
      // eslint-disable-next-line max-len
      Register.verifyCustomerRecord(_id, hashedUniqueString, createdAt, expiresAt, (err, result) => {
        if (err) {
          console.log(`error: ${err}`);
          res.status(200).json({
            status: 'Failed',
            message: 'Couldnt save verification email data!',
          });
        } else {
          console.log('sends email');
          transporter
            .sendMail(mailOptions)
            .then(() => {
              console.log('email sent');
              // email sent and verification record saved
              res.status(200).json({
                status: 'Pending',
                message: 'Verification email sent',
              });
            })
            .catch((error) => {
              console.log(`error: ${error}`);
              res.status(404).json({
                status: 'Failed',
                message: 'verification email failed!',
              });
            });
        }
      });
    })
    .catch(() => {
      res.json({
        status: 'Failed',
        message: 'An error occurred while hashing email data!',
      });
    });
};

// verify email
app.get('/verify/:userId/:uniqueString', printDebugInfo, async (req, res) => {
  const frontEndUrl = 'http://localhost:3001';
  // const frontEndUrl = 'https://moc-fa.herokuapp.com';

  const { userId, uniqueString } = req.params;
  console.log(uniqueString);

  // Check if verification record actually exist
  Register.verifyCustomer(userId, uniqueString, (err, result) => {
    if (err) {
      // Show error
      const message = 'An error occured while checking for existing user verification record';
      res.redirect(`${frontEndUrl}/user/verified?error=true&message=${message}`);
    } else {
      console.log(`Verify Record: ${result}`);
      // Show success
      if (result.length > 0) {
        // user verification record exists so we proceed
        // check if the record expired
        const expiresAt = result[0].ExpiresAt;
        const hashedUniqueString = result[0].UniqueString;

        if (expiresAt < Date.now()) {
          // record has expired so we delete it
          console.log('delete record');
          Register.deleteVerificationRecord(userId, (err1, result1) => {
            if (!err1) {
              // calling deleteClass method from admin model
              Register.deleteUnverifiedCustomer(userId, (err2, result2) => {
                if (!err2) {
                  const message = 'Link Expired. Sign up again.';
                  res.redirect(`${frontEndUrl}/user/verified?error=true&message=${message}`);
                } else {
                  const message = 'Clearing user with expired unique string failed';
                  res.redirect(`${frontEndUrl}/user/verified?error=true&message=${message}`);
                }
              });
            } else {
              const message = 'An error occured while clearing expired user verification record';
              res.redirect(`${frontEndUrl}/user/verified?error=true&message=${message}`);
            }
          });
        } else {
          // If success, delete record
          console.log(`
          uniqueString: ${uniqueString}
          hashedUniqueString: ${hashedUniqueString}`);
          // Fist compare the hashed unique string

          bcrypt
            .compare(uniqueString, hashedUniqueString)
            .then((result3) => {
              console.log(result3);
              if (result3) {
                // Strings match
                // calling updateSuperAdmin method from SuperAdmin model
                Register.updateVerificationStatus(1, userId, (err4, result4) => {
                  // if there is no errorsend the following as result
                  if (!err4) {
                    Register.deleteVerificationRecord(userId, (err5, result5) => {
                      if (!err5) {
                        const message = 'Your email has been successfully been verified. You may proceed to login.';
                        res.redirect(`${frontEndUrl}/user/verified?error=false&message=${message}`);
                      } else {
                        const message = 'An error occured while finalising successful verification';
                        res.redirect(`${frontEndUrl}/user/verified?error=true&message=${message}`);
                      }
                    });
                  } else {
                    console.log(err4);
                    const message = 'An error occrured while updating user record to show verified.';
                    res.redirect(`${frontEndUrl}/user/verified?error=true&message=${message}`);
                  }
                });
              } else {
                // Existing record but incorrect verification details passed
                const message = 'Invalid verification details passed. Check your inbox.';
                res.redirect(`${frontEndUrl}/user/verified?error=true&message=${message}`);
              }
            })
            .catch((error) => {
              const message = 'An error occured while comparing unique string';
              res.redirect(`${frontEndUrl}/user/verified?error=true&message=${message}`);
            });
        }
      } else {
        // user verification record does not exist
        const message = 'Account record does not exist or has been verified already. Please sign up or login.';
        res.redirect(`${frontEndUrl}/user/verified?error=true&message=${message}`);
      }
    }
  });
});

// register
app.post('/registerCustomer', printDebugInfo, async (req, res, next) => {
  const { FirstName } = req.body;
  const { LastName } = req.body;
  const { Password } = req.body;
  const { Email } = req.body;
  const { Address } = req.body;
  const { PhoneNumber } = req.body;
  const { PostalCode } = req.body;

  // eslint-disable-next-line max-len
  Register.registerCustomer(FirstName, LastName, Password, Email, Address, PhoneNumber, PostalCode, (err, result) => {
    if (!err) {
      const returnResult = {
        _id: result.insertId,
        email: Email,
      };

      // Handle account verification
      sendVerificationEmail(returnResult, res);
    } else if (err.code === 'ER_TRUNCATED_WRONG_VALUE_FOR_FIELD') {
      // if err.code === ER_TRUNCATED_WRONG_VALUE_FOR_FIELD
      // send Inappropriate value as return message
      res.status(406).send('Inappropriate value');
    } else if (err.code === 'ER_BAD_NULL_ERROR') {
      // if err.code === ER_BAD_NULL_ERROR send Null value not allowed as return message
      res.status(400).send('Null value not allowed');
    } else {
      // else if there is a server error return message
      res.status(500).send('Internal Server Error');
    }
  });
});

// get all Login
app.post('/login', printDebugInfo, async (req, res, next) => {
  const { email } = req.body;
  const { password } = req.body;

  Login.Verify(email, password, (err, token, result) => {
    if (!err) {
      let msg;
      if (!result) {
        msg = {
          Error: 'Invalid login',
        };
        res.status(404).send(msg);
      } else {
        msg = {
          AdminID: result.AdminID,
          token,
          CustomerID: result.CustomerID,
          AdminType: result.AdminType,
        };
        res.status(200).send(msg);
      }
    } else if (err.code === 'ER_TRUNCATED_WRONG_VALUE_FOR_FIELD') {
      // if err.code === ER_TRUNCATED_WRONG_VALUE_FOR_FIELD
      // send Inappropriate value as return message
      res.status(406).send('Inappropriate value');
    } else if (err.code === 'ER_BAD_NULL_ERROR') {
      // if err.code === ER_BAD_NULL_ERROR send Null value not allowed as return message
      res.status(400).send('Null value not allowed');
    } else if (err === 'UNVERIFIED_EMAIL') {
      // else if there is a server error return message
      res.status(401).send('Your email is not verified. Please Verify your email');
    } else if (err === 'NO_ACCOUNTS_FOUND') {
      res.status(401).send('Wrong Username or Password!');
    }
  });
});

app.get('/ratesByPackagePublic/:id', printDebugInfo, async (req, res) => {
  // extract id from params
  const rateid = req.params.id;

  // calling getClass method from admin model
  Admin.getRateByPackage(rateid, (err, result) => {
    if (!err) {
      // if id not found detect and return error message
      if (result.length === 0) {
        const output = {
          Error: 'Id not found',
        };
        res.status(404).send(output);
      } else {
        // output
        res.status(200).send(result);
      }
    } else {
      // sending output as error message if there is any server issues
      const output = {
        Error: 'Internal sever issues',
      };
      res.status(500).send(output);
    }
  });
});

// ====================== Admin Section ======================
app.get('/classes', printDebugInfo, async (req, res) => {
  // calling getAllClassOfService method from admin model
  Admin.getAllClassOfService((err, result) => {
    if (!err) {
      console.log('==================================');
      console.log('get class work');
      console.log('==================================');
      res.status(200).send(result);
    } else {
      res.status(500).send('Some error');
    }
  });
});

// get a class of sevice
app.get('/classes/:id', printDebugInfo, async (req, res) => {
  // extract id from params
  const classid = req.params.id;

  // calling getClass method from admin model
  Admin.getClass(classid, (err, result) => {
    if (!err) {
      // if id not found detect and return error message
      if (result.length === 0) {
        const output = {
          Error: 'Id not found',
        };
        res.status(404).send(output);
      } else {
        // output
        res.status(200).send(result);
      }
    } else {
      // sending output as error message if there is any server issues
      const output = {
        Error: 'Internal sever issues',
      };
      res.status(500).send(output);
    }
  });
});

// add a class
app.post('/class', printDebugInfo, verifyToken, (req, res) => {
  if (req.role == null) {
    res.status(403).send();
    return;
  }
  // extract all details needed
  const { ClassName } = req.body;
  const { ClassPricing } = req.body;
  const { ClassDes } = req.body;

  // check if class pricing is float value and execute code
  if (Number.parseFloat(ClassPricing)) {
    // calling addClass method from admin model
    Admin.addClass(ClassName, ClassPricing, ClassDes, (err, result) => {
      // if no error send results as positive
      if (!err) {
        res.status(201).send(result);
      } else if (err.code === 'ER_TRUNCATED_WRONG_VALUE_FOR_FIELD') {
        // if err.code === ER_TRUNCATED_WRONG_VALUE_FOR_FIELD
        // send Inappropriate value as return message
        res.status(406).send('Inappropriate value');
      } else if (err.code === 'ER_BAD_NULL_ERROR') {
        // if err.code === ER_BAD_NULL_ERROR send Null value not allowed as return message
        res.status(400).send('Null value not allowed');
      } else {
        // else if there is a server error return message
        res.status(500).send('Internal Server Error');
      }
    });
    // eslint-disable-next-line brace-style
  }
  // if class pricing is not float
  else {
    res.status(400).send('Null value not allowed');
  }
});

// update class of service
app.put('/class/:id', printDebugInfo, verifyToken, (req, res) => {
  if (req.role == null) {
    res.status(403).send();
    return;
  }
  // extract id from params
  const classID = req.params.id;
  // extract all details needed
  const { ClassName } = req.body;
  const { ClassPricing } = req.body;
  const { ClassDes } = req.body;

  // check if class pricing is float value and execute code
  if (Number.parseFloat(ClassPricing)) {
    // calling updateClass method from admin model
    Admin.updateClass(ClassName, ClassPricing, ClassDes, classID, (err, result) => {
      // if there is no errorsend the following as result
      if (!err) {
        res.status(201).send(result);
      } else if (err.code === 'ER_TRUNCATED_WRONG_VALUE_FOR_FIELD') {
        // if err.code === ER_TRUNCATED_WRONG_VALUE_FOR_FIELD
        // send Inappropriate value as return message
        res.status(406).send('Inappropriate value');
      } else if (err.code === 'ER_BAD_NULL_ERROR') {
        // if err.code === ER_BAD_NULL_ERROR send Null value not allowed as return message
        res.status(400).send('Null value not allowed');
      } else {
        // else if there is a server error return message
        res.status(500).send('Internal Server Error');
      }
    });
  } else {
    // if class pricing is not float
    res.status(406).send('Inappropriate value');
  }
});

// delete class of service
app.delete('/class/:id', printDebugInfo, verifyToken, (req, res) => {
  if (req.role == null) {
    res.status(403).send();
    return;
  }
  // extract id from params
  const { id } = req.params;
  // calling deleteClass method from admin model
  Admin.deleteClass(id, (err, result) => {
    if (!err) {
      // result.affectedRows indicates that id to be deleted
      // cannot be found hence send as error message
      if (result.affectedRows === 0) {
        res.status(404).send('Item cannot be deleted');
      } else {
        // else a postitve result
        res.status(200).send(result);
      }
    } else {
      // sever error
      const output = {
        Error: 'Internal sever issues',
      };
      res.status(500).send(output);
    }
  });
});

// get employee per page
app.get('/employee/:pageNumber', printDebugInfo, verifyToken, async (req, res) => {
  if (req.role == null) {
    res.status(403).send();
    return;
  }

  // extract pageNumber from params to determine the page we are at
  const { pageNumber } = req.params;
  if (req.role == null) {
    res.status(403).send();
    return;
  }

  // calling pageEmployee method from admin model
  Admin.pageEmployee(pageNumber, (err, result) => {
    // if no error send result
    if (!err) {
      // if id not found detect and return error message
      if (result.length === 0) {
        const output = {
          Error: 'Id not found',
        };
        res.status(404).send(output);
      } else {
        // output
        res.status(200).send(result);
      }
    } else {
      // if error send error message
      res.status(500).send('Some error');
    }
  });
});

// get all employee
app.get('/employee', printDebugInfo, verifyToken, async (req, res) => {
  if (req.role == null) {
    res.status(403).send();
    return;
  }
  // calling getAllEmployee method from admin model
  Admin.getAllEmployee((err, result) => {
    // if no error send result
    if (!err) {
      // if id not found detect and return error message
      if (result.length === 0) {
        const output = {
          Error: 'Id not found',
        };
        res.status(404).send(output);
      } else {
        // output
        res.status(200).send(result);
      }
    } else {
      // if error send error message
      res.status(500).send('Some error');
    }
  });
});

// get an employee
app.get('/oneemployee/:id', printDebugInfo, verifyToken, async (req, res) => {
  // extract id from params
  const employeeId = req.params.id;
  if (req.role == null) {
    res.status(403).send();
    return;
  }

  // calling getEmployee method from admin model
  Admin.getEmployee(employeeId, (err, result) => {
    if (!err) {
      // if id not found detect and return error message
      if (result.length === 0) {
        const output = {
          Error: 'Id not found',
        };
        res.status(404).send(output);
      } else {
        // output
        res.status(200).send(result);
      }
    } else {
      // sending output as error message if there is any server issues
      const output = {
        Error: 'Internal sever issues',
      };
      res.status(500).send(output);
    }
  });
});

// update employee
app.put('/employees/:id', printDebugInfo, verifyToken, (req, res) => {
  if (req.role == null) {
    res.status(403).send();
    return;
  }
  // extract id from params
  const EmployeeID = req.params.id;
  // extract all details needed
  const { EmployeeName } = req.body;
  const { EmployeeDes } = req.body;
  const { EmployeeSkills } = req.body;
  const { EmployeeImg } = req.body;

  // calling updateEmployee method from admin model
  Admin.updateEmployee(
    EmployeeName,
    EmployeeSkills,
    EmployeeImg,
    EmployeeDes,
    EmployeeID,
    (err, result) => {
      // if there is no errorsend the following as result
      if (!err) {
        const output = {
          classID: result.insertId,
        };
        console.log(`result ${output.classID}`);
        res.status(201).send(result);
      } else if (err.code === 'ER_TRUNCATED_WRONG_VALUE_FOR_FIELD') {
        // if err.code === ER_TRUNCATED_WRONG_VALUE_FOR_FIELD
        // send Inappropriate value as return message
        res.status(406).send('Inappropriate value');
      } else if (err.code === 'ER_BAD_NULL_ERROR') {
        // if err.code === ER_BAD_NULL_ERROR send Null value not allowed as return message
        res.status(400).send('Null value not allowed');
      } else {
        // else if there is a server error return message
        res.status(500).send('Internal Server Error');
      }
    },
  );
});

// get an employee availability (shuyang)
app.get('/employee/availability/:id/:date', printDebugInfo, async (req, res) => {
  // extract id from params
  const employeeId = req.params.id;
  const dateExtracted = req.params.date;

  // calling getEmployeeAvailabilty method from admin model
  Admin.getEmployeeAvailByID(employeeId, dateExtracted, (err, result) => {
    if (!err) {
      // output
      res.status(200).send(result);
    } else {
      // sending output as error message if there is any server issues
      const output = {
        Error: 'Internal sever issues',
      };
      res.status(500).send(output);
    }
  });
});

// get an employee skills (shuyang)
app.get('/employee/skills/:id', printDebugInfo, async (req, res) => {
  // extract id from params
  const employeeId = req.params.id;

  // calling getEmployeeSkillsByID method from admin model
  Admin.getEmployeeSkillsByID(employeeId, (err, result) => {
    if (!err) {
      // output
      res.status(200).send(result);
    } else {
      // sending output as error message if there is any server issues
      const output = {
        Error: 'Internal sever issues',
      };
      res.status(500).send(output);
    }
  });
});

// update employee skills (shuyang)
app.put('/employees/skills/:id', printDebugInfo, (req, res) => {
  // extract id from params
  const EmployeeID = req.params.id;
  // extract all details needed
  const { EmployeeSkills } = req.body;

  // calling deleteEmployeeSkills method from admin model
  Admin.updateEmployeeSkills(EmployeeSkills, EmployeeID, (err, result) => {
    // if there is no errorsend the following as result
    if (!err) {
      res.status(201).send(result);
    } else if (err.code === 'ER_TRUNCATED_WRONG_VALUE_FOR_FIELD') {
      // if err.code === ER_TRUNCATED_WRONG_VALUE_FOR_FIELD
      // send Inappropriate value as return message
      res.status(406).send('Inappropriate value');
    } else if (err.code === 'ER_BAD_NULL_ERROR') {
      // if err.code === ER_BAD_NULL_ERROR send Null value not allowed as return message
      res.status(400).send('Null value not allowed');
    } else {
      // else if there is a server error return message
      res.status(500).send('Internal Server Error');
    }
  });
});

// delete employee
app.delete('/employee/:employeeId', printDebugInfo, verifyToken, (req, res) => {
  // extract id from params
  if (req.role == null) {
    res.status(403).send();
    return;
  }
  const { employeeId } = req.params;
  console.log(` app.js employee delete method start ${employeeId}`);
  let output1;

  Admin.getEmployee(employeeId, (err, result) => {
    if (!err) {
      // if id not found detect and return error message
      if (result.length === 0) {
        const output = {
          Error: 'Id not found',
        };
        res.status(404).send(output);
      } else {
        // output
        output1 = {
          EmployeeId: result[0].EmployeeID,
          EmployeeImageCloudinaryFileId: result[0].EmployeeImageCloudinaryFileId,

        };

        res.status(200).send(output1);
      }
    } else {
      // sending output as error message if there is any server issues
      const output = {
        Error: 'Internal sever issues',
      };
      res.status(500).send(output);
    }
  });

  // calling deleteEmployee method from admin model
  Admin.deleteEmployee(employeeId, (err, result1) => {
    if (!err) {
      console.log('DELETE EMPLOYEE STATEMENT');
      // result.affectedRows indicates that id to be deleted
      // cannot be found hence send as error message
      if (result1.affectedRows === 0) {
        res.status(404).send('Item cannot be deleted');
      } else {
        // else a postitve result
        console.log(output1.EmployeeImageCloudinaryFileId);
        cloudinary.uploader.destroy(output1.EmployeeImageCloudinaryFileId);
        // res.send(result1);
      }
    } else {
      // sever error
      const output = {
        Error: 'Internal sever issues',
      };
      res.status(500).send(output);
    }
  });
});

// update employee
app.put('/employee/:employeeId', upload.single('image_edit'), printDebugInfo, verifyToken, async (req, res) => {
  // extract id from params
  if (req.role == null) {
    res.status(403).send();
    return;
  }
  const { employeeId } = req.params;
  console.log(` app.js employee update method start ${employeeId}`);
  // retrieve Skillsets from body
  const InitialImg = req.body.initialImg;
  let EmployeeImgageCloudinaryFileId;
  let EmployeeImageUrl;
  let ImgCheck = false;

  Admin.getEmployee(employeeId, async (err, result) => {
    if (!err) {
      // if id not found detect and return error message
      if (result.length === 0) {
        const output = {
          Error: 'Id not found',
        };
        res.status(404).send(output);
      } else {
        // output
        const output1 = {
          EmployeeId: result[0].EmployeeID,
          EmployeeImageCloudinaryFileId: result[0].EmployeeImageCloudinaryFileId,
          EmployeeImgUrl: result[0].EmployeeImgUrl,
        };

        if (output1.EmployeeImgUrl !== InitialImg) {
          cloudinary.uploader.destroy(output1.EmployeeImageCloudinaryFileId);
          console.log('previous pic deleted');
          try {
            console.log(`When image changes: ${ImgCheck}`);
            // cloudinary image upload method to the folder employee
            if (ImgCheck === false) {
              const result = await cloudinary.uploader.upload(req.file.path, { folder: 'employee' });
              // retrieve EmployeeImgageCloudinaryFileId from
              // result.public_id from uploading cloudinary
              EmployeeImgageCloudinaryFileId = result.public_id;
              // retrieve EmployeeImageUrl from result.secure_url from uploading cloudinary
              EmployeeImageUrl = result.secure_url;
              console.log(result);
              console.log(`EmployeeImgageCloudinaryFileId: ${EmployeeImgageCloudinaryFileId}`);
              console.log(`EmployeeImageUrl: ${EmployeeImageUrl}`);
              // retrieve EmployeeName from body
              const EmployeeName = req.body.employeeName;
              // retrieve EmployeeDes from body
              const EmployeeDes = req.body.employeeDes;
              // retrieve Skillsets from body
              const Skillsets = req.body.skillSet;
              // invoking Admin.addEmployee
              Admin.updateEmployee(
                EmployeeName,
                EmployeeDes,
                EmployeeImgageCloudinaryFileId,
                EmployeeImageUrl,
                Skillsets,
                employeeId,
                (err) => {
                  // if there is no error
                  if (!err) {
                    const output = 'done';
                    return res.status(201).send(output);
                  }
                },
              );
            }
          } catch (error) {
            const output = {
              Error: 'Internal sever issues',
            };
            console.log(error);
            return res.status(500).send(output);
          }
        } else {
          ImgCheck = true;
          // ImgCheck = true;
          console.log(ImgCheck);
          // retrieve EmployeeImgageCloudinaryFileId from
          // result.public_id from uploading cloudinary
          EmployeeImgageCloudinaryFileId = output1.EmployeeImageCloudinaryFileId;
          // retrieve EmployeeImageUrl from result.secure_url from uploading cloudinary
          EmployeeImageUrl = output1.EmployeeImgUrl;
          // retrieve EmployeeName from body
          const EmployeeName = req.body.employeeName;
          // retrieve EmployeeDes from body
          const EmployeeDes = req.body.employeeDes;
          // retrieve Skillsets from body
          const Skillsets = req.body.skillSet;
          console.log(`EmployeeImgageCloudinaryFileId: ${EmployeeImgageCloudinaryFileId}`);
          console.log(`EmployeeImageUrl: ${EmployeeImageUrl}`);
          // invoking Admin.addEmployee
          Admin.updateEmployee(
            EmployeeName,
            EmployeeDes,
            EmployeeImgageCloudinaryFileId,
            EmployeeImageUrl,
            Skillsets,
            employeeId,
            (err) => {
              // if there is no error
              if (!err) {
                const output = 'done';
                return res.status(201).send(output);
              }
            },
          );
        }
      }
    } else if (err.code === 'ER_TRUNCATED_WRONG_VALUE_FOR_FIELD') {
      // if err.code === ER_TRUNCATED_WRONG_VALUE_FOR_FIELD
      // send Inappropriate value as return message
      res.status(406).send('Inappropriate value');
    } else if (err.code === 'ER_BAD_NULL_ERROR') {
      // if err.code === ER_BAD_NULL_ERROR send Null value not allowed as return message
      res.status(400).send('Null value not allowed');
    } else {
      // else if there is a server error return message
      res.status(500).send('Internal Server Error');
    }
  });
});

// upload.single method to upload an image with the key of image
app.post('/adddEmployee', upload.single('image'), verifyToken, async (req, res) => {
  if (req.role == null) {
    res.status(403).send();
    return;
  }
  try {
    // cloudinary image upload method to the folder employee
    const result = await cloudinary.uploader.upload(req.file.path, { folder: 'employee' });
    // retrieve EmployeeName from body
    const EmployeeName = req.body.employeeName;
    // retrieve EmployeeDes from body
    const EmployeeDes = req.body.employeeDes;
    // retrieve Skillsets from body
    const Skillsets = req.body.skillSet;
    // retrieve EmployeeImgageCloudinaryFileId from result.public_id from uploading cloudinary
    const EmployeeImgageCloudinaryFileId = result.public_id;
    // retrieve EmployeeImageUrl from result.secure_url from uploading cloudinary
    const EmployeeImageUrl = result.secure_url;
    // invoking Admin.addEmployee
    Admin.addEmployee(
      EmployeeName,
      EmployeeDes,
      EmployeeImgageCloudinaryFileId,
      EmployeeImageUrl,
      Skillsets,
      // eslint-disable-next-line no-shadow
      (err, result) => {
        if (!err) {
          const output = 'done';
          res.status(201).send(output + result);
        } else if (err.code === 'ER_TRUNCATED_WRONG_VALUE_FOR_FIELD') {
          // if err.code === ER_TRUNCATED_WRONG_VALUE_FOR_FIELD
          // send Inappropriate value as return message
          res.status(406).send('Inappropriate value');
        } else if (err.code === 'ER_BAD_NULL_ERROR') {
          // if err.code === ER_BAD_NULL_ERROR send Null value not allowed as return message
          res.status(400).send('Null value not allowed');
        } else {
          // else if there is a server error return message
          res.status(500).send('Internal Server Error');
        }
      },
    );
  } catch (error) {
    const output = {
      Error: 'Internal sever issues',
    };
    return res.status(500).send(output);
  }
});

app.get('/booking/:pageNumber', printDebugInfo, verifyToken, async (req, res) => {
  if (req.role == null) {
    res.status(403).send();
    return;
  }
  // extract pageNumber from params to determine the page we are at
  const { pageNumber } = req.params;

  // calling pageEmployee method from admin model
  Admin.pageBooking(pageNumber, (err, result) => {
    // if no error send result
    if (!err) {
      res.status(200).send(result);
    } else {
      // if error send error message
      const output = {
        Error: 'Internal sever issues',
      };
      res.status(500).send(output);
    }
  });
});

// get all booking
app.get('/booking', verifyToken, printDebugInfo, async (req, res) => {
  if (req.role == null) {
    res.status(403).send();
    return;
  }
  // calling getAllClassOfService method from admin model
  Admin.getAllBooking((err, result) => {
    // if no error send result
    if (!err) {
      res.status(200).send(result);
    } else {
      // if error send error message
      res.status(500).send('Some error');
    }
  });
});
// get a class of sevice
app.get('/oneBooking/:id', verifyToken, printDebugInfo, async (req, res) => {
  // extract id from params
  if (req.role == null) {
    res.status(403).send();
    return;
  }

  const bookingID = req.params.id;

  // calling getClass method from admin model
  Admin.getBooking(bookingID, (err, result) => {
    if (!err) {
      // if id not found detect and return error message
      if (result.length === 0) {
        const output = {
          Error: 'Id not found',
        };
        res.status(404).send(output);
      } else {
        // output
        res.status(200).send(result);
      }
    } else {
      // sending output as error message if there is any server issues
      const output = {
        Error: 'Internal sever issues',
      };
      res.status(500).send(output);
    }
  });
});

// add a booking
app.post('/booking', printDebugInfo, verifyToken, (req, res) => {
  if (req.role == null) {
    res.status(403).send();
    return;
  }
  // extract all details needed
  const { bookingID } = req.body;
  const { bookingDate } = req.body;
  const { AdminId } = req.body;
  console.log(AdminId);
  Admin.addOneBooking(bookingID, bookingDate, AdminId, (err, result) => {
    if (!err) {
      res.status(201).send(result);
    } else if (err.code === 'ER_TRUNCATED_WRONG_VALUE_FOR_FIELD') {
      res.status(406).send('Inappropriate value');
    } else if (err.code === 'ER_BAD_NULL_ERROR') {
      res.status(400).send('Null value not allowed');
    } else {
      res.status(500).send('Internal Server Error');
    }
  });
});

// update class of service
app.put('/updateBooking/:bookingIDs', printDebugInfo, verifyToken, (req, res) => {
  if (req.role == null) {
    res.status(403).send();
    return;
  }
  // extract id from params
  const BookingID = req.params.bookingIDs;
  // extract all details needed
  const { ScheduleDate } = req.body;
  console.log('Im HERE');
  // check if class pricing is float value and execute code

  // calling updateClass method from admin model
  Admin.updateBooking(ScheduleDate, BookingID, (err, result) => {
    // if there is no errorsend the following as result
    if (!err) {
      res.status(201).send(result);
    } else if (err.code === 'ER_TRUNCATED_WRONG_VALUE_FOR_FIELD') {
      // if err.code === ER_TRUNCATED_WRONG_VALUE_FOR_FIELD
      // send Inappropriate value as return message
      res.status(406).send('Inappropriate value');
    } else if (err.code === 'ER_BAD_NULL_ERROR') {
      // if err.code === ER_BAD_NULL_ERROR send Null value not allowed as return message
      res.status(400).send('Null value not allowed');
    } else {
      // else if there is a server error return message
      res.status(500).send('Internal Server Error');
    }
  });
});

// get all class of service
app.get('/classes', printDebugInfo, async (req, res) => {
  // calling getAllClassOfService method from admin model
  Admin.getAllClassOfService((err, result) => {
    if (!err) {
      console.log('==================================');
      console.log('get class work');
      console.log('==================================');
      res.status(200).send(result);
    } else {
      res.status(500).send('Some error');
    }
  });
});

// get a class of sevice
app.get('/classes/:id', printDebugInfo, async (req, res) => {
  // extract id from params
  const classid = req.params.id;

  // calling getClass method from admin model
  Admin.getClass(classid, (err, result) => {
    if (!err) {
      // if id not found detect and return error message
      if (result.length === 0) {
        const output = {
          Error: 'Id not found',
        };
        res.status(404).send(output);
      } else {
        // output
        res.status(200).send(result);
      }
    } else {
      // sending output as error message if there is any server issues
      const output = {
        Error: 'Internal sever issues',
      };
      res.status(500).send(output);
    }
  });
});

// add a class
app.post('/class', printDebugInfo, verifyToken, (req, res) => {
  if (req.role == null) {
    res.status(403).send();
    return;
  }

  // extract all details needed
  const { ClassName } = req.body;
  const { ClassPricing } = req.body;
  const { ClassDes } = req.body;

  // check if class pricing is float value and execute code
  if (Number.parseFloat(ClassPricing)) {
    // calling addClass method from admin model
    Admin.addClass(ClassName, ClassPricing, ClassDes, (err, result) => {
      // if no error send results as positive
      if (!err) {
        res.status(201).send(result);
      } else if (err.code === 'ER_TRUNCATED_WRONG_VALUE_FOR_FIELD') {
        // if err.code === ER_TRUNCATED_WRONG_VALUE_FOR_FIELD
        // send Inappropriate value as return message
        res.status(406).send('Inappropriate value');
      } else if (err.code === 'ER_BAD_NULL_ERROR') {
        // if err.code === ER_BAD_NULL_ERROR send Null value not allowed as return message
        res.status(400).send('Null value not allowed');
      } else {
        // else if there is a server error return message
        res.status(500).send('Internal Server Error');
      }
    });
    // eslint-disable-next-line brace-style
  }
  // if class pricing is not float
  else {
    res.status(400).send('Null value not allowed');
  }
});

// update class of service
app.put('/class/:id', printDebugInfo, verifyToken, (req, res) => {
  if (req.role == null) {
    res.status(403).send();
    return;
  }

  // extract id from params
  const classID = req.params.id;
  // extract all details needed
  const { ClassName } = req.body;
  const { ClassPricing } = req.body;
  const { ClassDes } = req.body;

  // check if class pricing is float value and execute code
  if (Number.parseFloat(ClassPricing)) {
    // calling updateClass method from admin model
    Admin.updateClass(ClassName, ClassPricing, ClassDes, classID, (err, result) => {
      // if there is no errorsend the following as result
      if (!err) {
        res.status(201).send(result);
      } else if (err.code === 'ER_TRUNCATED_WRONG_VALUE_FOR_FIELD') {
        // if err.code === ER_TRUNCATED_WRONG_VALUE_FOR_FIELD
        // send Inappropriate value as return message
        res.status(406).send('Inappropriate value');
      } else if (err.code === 'ER_BAD_NULL_ERROR') {
        // if err.code === ER_BAD_NULL_ERROR send Null value not allowed as return message
        res.status(400).send('Null value not allowed');
      } else {
        // else if there is a server error return message
        res.status(500).send('Internal Server Error');
      }
    });
  } else {
    // if class pricing is not float
    res.status(406).send('Inappropriate value');
  }
});

// delete class of service
app.delete('/class/:id', printDebugInfo, verifyToken, (req, res) => {
  if (req.role == null) {
    res.status(403).send();
    return;
  }

  // extract id from params
  const { id } = req.params;
  // calling deleteClass method from admin model
  Admin.deleteClass(id, (err, result) => {
    if (!err) {
      // result.affectedRows indicates that id to be deleted
      // cannot be found hence send as error message
      if (result.affectedRows === 0) {
        res.status(404).send('Item cannot be deleted');
      } else {
        // else a postitve result
        res.status(200).send(result);
      }
    } else {
      // sever error
      const output = {
        Error: 'Internal sever issues',
      };
      res.status(500).send(output);
    }
  });
});

// get booking that are pending or assigned per page
app.get('/bookingCancel/:pageNumber', printDebugInfo, verifyToken, async (req, res) => {
  if (req.role == null) {
    res.status(403).send();
    return;
  }

  // extract pageNumber from params to determine the page we are at
  const { pageNumber } = req.params;

  // calling pageEmployee method from admin model
  Admin.pageBookingCancel(pageNumber, (err, result) => {
    // if no error send result
    if (!err) {
      res.status(200).send(result);
    } else {
      // if error send error message
      const output = {
        Error: 'Internal sever issues',
      };
      res.status(500).send(output);
    }
  });
});

// get all bookings that are pending or assigned
app.get('/bookingCancel', printDebugInfo, verifyToken, async (req, res) => {
  if (req.role == null) {
    res.status(403).send();
    return;
  }

  // calling getAllBookingCancel method from admin model
  Admin.getAllBookingCancel((err, result) => {
    // if no error send result
    if (!err) {
      console.log('==================================');
      console.log('Bihh');
      console.log('==================================');
      res.status(200).send(result);
    } else {
      // if error send error message
      res.status(500).send('Some error');
    }
  });
});

// update cancel booking
app.put('/cancelBooking/:id', printDebugInfo, verifyToken, (req, res) => {
  if (req.role == null) {
    res.status(403).send();
    return;
  }

  // extract id from params
  const bookingId = req.params.id;
  // calling cancelBookingAdmin method from admin model
  Admin.cancelBookingAdmin(

    bookingId,
    (err, result) => {
      // if there is no errorsend the following as result
      if (!err) {
        res.status(201).send(result);
      } else if (err.code === 'ER_TRUNCATED_WRONG_VALUE_FOR_FIELD') {
        // if err.code === ER_TRUNCATED_WRONG_VALUE_FOR_FIELD
        // send Inappropriate value as return message
        res.status(406).send('Inappropriate value');
      } else if (err.code === 'ER_BAD_NULL_ERROR') {
        // if err.code === ER_BAD_NULL_ERROR send Null value not allowed as return message
        res.status(400).send('Null value not allowed');
      } else {
        // else if there is a server error return message
        res.status(500).send('Internal Server Error');
      }
    },
  );
});

// get unassigned available employee
app.get('/availemployee/:date', printDebugInfo, verifyToken, async (req, res) => {
  if (req.role == null) {
    res.status(403).send();
    return;
  }

  // extract id from params
  const { date } = req.params;

  // calling getAvailableEmployee method from admin model
  Admin.getAvailableEmployee(date, (err, result) => {
    if (!err) {
      // if id not found detect and return error message
      if (result.length === 0) {
        const output = {
          Error: 'Id not found',
        };
        res.status(404).send(output);
      } else {
        // output
        res.status(200).send(result);
      }
    } else {
      // sending output as error message if there is any server issues
      const output = {
        Error: 'Internal sever issues',
      };
      res.status(500).send(output);
    }
  });
});

// schedule employee availability
app.post('/availemployee/:employeeId', printDebugInfo, verifyToken, (req, res) => {
  if (req.role == null) {
    res.status(403).send();
    return;
  }

  // extract all details needed
  const { employeeId } = req.params;
  const { date } = req.body;
  const { time } = req.body;

  // calling addEmployeeAvailability method from admin model
  Admin.addEmployeeAvailability(employeeId, date, time, (err, result) => {
    // if no error send results as positive
    if (!err) {
      const output = {
        success: true,
        'affected rows': result.affectedRows,
        'changed rows': result.changedRows,
      };
      res.status(201).send(output);
    } else if (err.code === 'ER_TRUNCATED_WRONG_VALUE_FOR_FIELD') {
      // if err.code === ER_TRUNCATED_WRONG_VALUE_FOR_FIELD
      // send Inappropriate value as return message
      res.status(406).send('Inappropriate value');
    } else if (err.code === 'ER_BAD_NULL_ERROR') {
      // if err.code === ER_BAD_NULL_ERROR send Null value not allowed as return message
      res.status(400).send('Null value not allowed');
    } else {
      // else if there is a server error return message
      res.status(500).send('Internal Server Error');
    }
  });
});

// get all customer
app.get('/customer', printDebugInfo, verifyToken, async (req, res) => {
  if (req.role == null) {
    res.status(403).send();
    return;
  }

  // calling getAllCustomer method from admin model
  Admin.getAllCustomer((err, result) => {
    // if no error send result
    if (!err) {
      // if id not found detect and return error message
      if (result.length === 0) {
        const output = {
          Error: 'Id not found',
        };
        res.status(404).send(output);
      } else {
        // output
        res.status(200).send(result);
      }
    } else {
      // if error send error message
      res.status(500).send('Some error');
    }
  });
});

// get an customer
app.get('/onecustomer/:id', printDebugInfo, verifyToken, async (req, res) => {
  if (req.role == null) {
    res.status(403).send();
    return;
  }

  // extract id from params
  const customerId = req.params.id;

  // calling getCustomer method from admin model
  Admin.getCustomer(customerId, (err, result) => {
    if (!err) {
      // if id not found detect and return error message
      if (result.length === 0) {
        const output = {
          Error: 'Id not found',
        };
        res.status(404).send(output);
      } else {
        // output
        res.status(200).send(result);
      }
    } else {
      // sending output as error message if there is any server issues
      const output = {
        Error: 'Internal sever issues',
      };
      res.status(500).send(output);
    }
  });
});

// update customer
app.put('/customer/:id', printDebugInfo, verifyToken, (req, res) => {
  if (req.role == null) {
    res.status(403).send();
    return;
  }

  // extract id from params
  const CustomerID = req.params.id;
  // extract all details needed
  const { CustomerPassword } = req.body;
  const { CustomerStatus } = req.body;

  // calling updateCustomer method from admin model
  Admin.updateCustomer(CustomerPassword, CustomerStatus, CustomerID, (err, result) => {
    // if there is no errorsend the following as result
    if (!err) {
      res.status(201).send(result);
    } else if (err.code === 'ER_TRUNCATED_WRONG_VALUE_FOR_FIELD') {
      // if err.code === ER_TRUNCATED_WRONG_VALUE_FOR_FIELD
      // send Inappropriate value as return message
      res.status(406).send('Inappropriate value');
    } else if (err.code === 'ER_BAD_NULL_ERROR') {
      // if err.code === ER_BAD_NULL_ERROR send Null value not allowed as return message
      res.status(400).send('Null value not allowed');
    } else {
      // else if there is a server error return message
      res.status(500).send('Internal Server Error');
    }
  });
});

// delete customer
app.delete('/customer/:id', printDebugInfo, verifyToken, (req, res) => {
  if (req.role == null) {
    res.status(403).send();
    return;
  }

  // extract id from params
  const { id } = req.params;
  // calling deleteCustomer method from admin model
  Admin.deleteCustomer(id, (err, result) => {
    if (!err) {
      // result.affectedRows indicates that id to be deleted
      // cannot be found hence send as error message
      if (result.affectedRows === 0) {
        res.status(404).send('Item cannot be deleted');
      } else {
        // else a postitve result
        res.status(200).send(result);
      }
    } else {
      // sever error
      const output = {
        Error: 'Internal sever issues',
      };
      res.status(500).send(output);
    }
  });
});

// get all extra services
app.get('/extraServices', printDebugInfo, async (req, res) => {
  // calling getAllExtraServices method from admin model
  Admin.getAllExtraServices((err, result) => {
    if (!err) {
      console.log('==================================');
      console.log('get extra services');
      console.log('==================================');
      res.status(200).send(result);
    } else {
      res.status(500).send('Some error');
    }
  });
});

// get a class of sevice
app.get('/extraServices/:id', printDebugInfo, async (req, res) => {
  // extract id from params
  const extraserviceid = req.params.id;

  // calling getClass method from admin model
  Admin.getExtraService(extraserviceid, (err, result) => {
    if (!err) {
      // if id not found detect and return error message
      if (result.length === 0) {
        const output = {
          Error: 'Id not found',
        };
        res.status(404).send(output);
      } else {
        // output
        res.status(200).send(result);
      }
    } else {
      // sending output as error message if there is any server issues
      const output = {
        Error: 'Internal sever issues',
      };
      res.status(500).send(output);
    }
  });
});

// add an extra service
app.post('/extraService', printDebugInfo, verifyToken, (req, res) => {
  if (req.role == null) {
    res.status(403).send();
    return;
  }

  // extract all details needed
  const { ExtraServiceName } = req.body;
  const { ExtraServicePrice } = req.body;

  // check if extra service pricing is float value and execute code
  if (Number.parseFloat(ExtraServicePrice)) {
    // calling addExtraService method from admin model
    Admin.addExtraService(ExtraServiceName, ExtraServicePrice, (err, result) => {
      // if no error send results as positive
      if (!err) {
        res.status(201).send(result);
      } else if (err.code === 'ER_TRUNCATED_WRONG_VALUE_FOR_FIELD') {
        // if err.code === ER_TRUNCATED_WRONG_VALUE_FOR_FIELD
        // send Inappropriate value as return message
        res.status(406).send('Inappropriate value');
      } else if (err.code === 'ER_BAD_NULL_ERROR') {
        // if err.code === ER_BAD_NULL_ERROR send Null value not allowed as return message
        res.status(400).send('Null value not allowed');
      } else {
        // else if there is a server error return message
        res.status(500).send('Internal Server Error');
      }
    });
    // eslint-disable-next-line brace-style
  }
  // if class pricing is not float
  else {
    res.status(400).send('Null value not allowed');
  }
});

// update extra service
app.put('/extraService/:id', printDebugInfo, verifyToken, (req, res) => {
  if (req.role == null) {
    res.status(403).send();
    return;
  }

  // extract id from params
  const ExtraServiceID = req.params.id;
  // extract all details needed
  const { ExtraServiceName } = req.body;
  const { ExtraServicePrice } = req.body;

  // check if extra service pricing is float value and execute code
  if (Number.parseFloat(ExtraServicePrice)) {
    // calling updateExtraService method from admin model
    Admin.updateExtraService(ExtraServiceName, ExtraServicePrice, ExtraServiceID, (err, result) => {
      // if there is no errorsend the following as result
      if (!err) {
        res.status(201).send(result);
      } else if (err.code === 'ER_TRUNCATED_WRONG_VALUE_FOR_FIELD') {
        // if err.code === ER_TRUNCATED_WRONG_VALUE_FOR_FIELD
        // send Inappropriate value as return message
        res.status(406).send('Inappropriate value');
      } else if (err.code === 'ER_BAD_NULL_ERROR') {
        // if err.code === ER_BAD_NULL_ERROR send Null value not allowed as return message
        res.status(400).send('Null value not allowed');
      } else {
        // else if there is a server error return message
        res.status(500).send('Internal Server Error');
      }
    });
  } else {
    // if class pricing is not float
    res.status(406).send('Inappropriate value');
  }
});

// delete extra service
app.delete('/extraService/:id', printDebugInfo, verifyToken, (req, res) => {
  if (req.role == null) {
    res.status(403).send();
    return;
  }

  // extract id from params
  const { id } = req.params;
  // calling deleteExtraService method from admin model
  Admin.deleteExtraService(id, (err, result) => {
    if (!err) {
      // result.affectedRows indicates that id to be
      // deleted cannot be found hence send as error message
      if (result.affectedRows === 0) {
        res.status(404).send('Item cannot be deleted');
      } else {
        // else a postitve result
        res.status(200).send(result);
      }
    } else {
      // sever error
      const output = {
        Error: 'Internal sever issues',
      };
      res.status(500).send(output);
    }
  });
});

// get all rates
app.get('/rates', printDebugInfo, async (req, res) => {
  // calling getAllRates method from admin model
  Admin.getAllRates((err, result) => {
    if (!err) {
      console.log('==================================');
      console.log('get rates');
      console.log('==================================');
      res.status(200).send(result);
    } else {
      res.status(500).send('Some error');
    }
  });
});

// get a rate
app.get('/rates/:id', printDebugInfo, async (req, res) => {
  // extract id from params
  const rateid = req.params.id;

  // calling getClass method from admin model
  Admin.getRate(rateid, (err, result) => {
    if (!err) {
      // if id not found detect and return error message
      if (result.length === 0) {
        const output = {
          Error: 'Id not found',
        };
        res.status(404).send(output);
      } else {
        // output
        res.status(200).send(result);
      }
    } else {
      // sending output as error message if there is any server issues
      const output = {
        Error: 'Internal sever issues',
      };
      res.status(500).send(output);
    }
  });
});
// get a rate
app.get('/ratesByPackage/:id', printDebugInfo, verifyToken, async (req, res) => {
  if (req.role == null) {
    res.status(403).send();
    return;
  }
  // extract id from params
  const rateid = req.params.id;

  // calling getClass method from admin model
  Admin.getRateByPackage(rateid, (err, result) => {
    if (!err) {
      // if id not found detect and return error message
      if (result.length === 0) {
        const output = {
          Error: 'Id not found',
        };
        res.status(404).send(output);
      } else {
        // output
        res.status(200).send(result);
      }
    } else {
      // sending output as error message if there is any server issues
      const output = {
        Error: 'Internal sever issues',
      };
      res.status(500).send(output);
    }
  });
});
// add new rate
app.post('/rate', printDebugInfo, verifyToken, (req, res) => {
  if (req.role == null) {
    res.status(403).send();
    return;
  }

  // extract all details needed
  const { RateName } = req.body;
  const { RatePrice } = req.body;
  const { Package } = req.body;

  // check if rate pricing is float value and execute code
  if (Number.parseFloat(RatePrice)) {
    // calling addClass method from admin model
    Admin.addRate(RateName, RatePrice, Package, (err, result) => {
      // if no error send results as positive
      if (!err) {
        res.status(201).send(result);
      } else if (err.code === 'ER_TRUNCATED_WRONG_VALUE_FOR_FIELD') {
        // if err.code === ER_TRUNCATED_WRONG_VALUE_FOR_FIELD
        // send Inappropriate value as return message
        res.status(406).send('Inappropriate value');
      } else if (err.code === 'ER_BAD_NULL_ERROR') {
        // if err.code === ER_BAD_NULL_ERROR send Null value not allowed as return message
        res.status(400).send('Null value not allowed');
      } else {
        // else if there is a server error return message
        res.status(500).send('Internal Server Error');
      }
    });
    // eslint-disable-next-line brace-style
  }
  // if class pricing is not float
  else {
    res.status(400).send('Null value not allowed');
  }
});

// update existing extra service
app.put('/rate/:id', printDebugInfo, verifyToken, (req, res) => {
  if (req.role == null) {
    res.status(403).send();
    return;
  }

  // extract id from params
  const RatesID = req.params.id;
  // extract all details needed
  const { RateName } = req.body;
  const { RatePrice } = req.body;
  const { Package } = req.body;

  // check if rate pricing is float value and execute code
  if (Number.parseFloat(RatePrice)) {
    // calling updateRate method from admin model
    Admin.updateRate(RateName, RatePrice, Package, RatesID, (err, result) => {
      // if there is no errorsend the following as result
      if (!err) {
        res.status(201).send(result);
      } else if (err.code === 'ER_TRUNCATED_WRONG_VALUE_FOR_FIELD') {
        // if err.code === ER_TRUNCATED_WRONG_VALUE_FOR_FIELD
        // send Inappropriate value as return message
        res.status(406).send('Inappropriate value');
      } else if (err.code === 'ER_BAD_NULL_ERROR') {
        // if err.code === ER_BAD_NULL_ERROR send Null value not allowed as return message
        res.status(400).send('Null value not allowed');
      } else {
        // else if there is a server error return message
        res.status(500).send('Internal Server Error');
      }
    });
  } else {
    // if class pricing is not float
    res.status(406).send('Inappropriate value');
  }
});

// delete existing rate
app.delete('/rate/:id', printDebugInfo, verifyToken, (req, res) => {
  if (req.role == null) {
    res.status(403).send();
    return;
  }

  // extract id from params
  const { id } = req.params;
  // calling deleteRate method from admin model
  Admin.deleteRate(id, (err, result) => {
    if (!err) {
      // result.affectedRows indicates that id to be deleted
      // cannot be found hence send as error message
      if (result.affectedRows === 0) {
        res.status(404).send('Item cannot be deleted');
      } else {
        // else a postitve result
        res.status(200).send(result);
      }
    } else {
      // sever error
      const output = {
        Error: 'Internal sever issues',
      };
      res.status(500).send(output);
    }
  });
});

app.get('/contract/:id', printDebugInfo, async (req, res) => {
  // calling getBookingdetails method from admin model
  const details = req.params.id;

  Admin.getBookingDetails(details, (err, result) => {
    // if no error send result
    if (!err) {
      console.log('==================================');
      console.log('Continue');
      console.log('==================================');
      res.status(200).send(result);
    } else {
      // if error send error message
      res.status(500).send('Some error');
    }
  });
});

app.post('/employeeList', printDebugInfo, verifyToken, async (req, res) => {
  if (req.role == null) {
    res.status(403).send();
    return;
  }

  // calling getBookingdetails method from admin model
  const detail = req.body.bookingDates;

  Admin.getEmployeeAvailabilty(detail, (err, result) => {
    // if no error send result
    if (!err) {
      console.log('==================================');
      console.log('Continue');
      console.log('==================================');
      res.status(200).send(result);
    } else {
      // if error send error message
      res.status(500).send('Some error');
    }
  });
});

app.put('/assignBooking/:bookingIDs', printDebugInfo, verifyToken, async (req, res) => {
  if (req.role == null) {
    res.status(403).send();
    return;
  }

  // extract id from params
  const BookingID = req.params.bookingIDs;
  // extract all details needed
  const { EmployeeID } = req.body;
  const { AdminID } = req.body;
  const { CustomerID } = req.body;

  // check if class pricing is float value and execute code

  // calling updateClass method from admin model
  Admin.assignBooking(EmployeeID, AdminID, BookingID, (err, result) => {
    // if there is no errorsend the following as result
    if (!err) {
      Admin.getEmployee(EmployeeID, (err1, result1) => {
        console.log('getEmployee');
        if (!err1) {
          Admin.getCustomer(CustomerID, (err2, result2) => {
            console.log('getCustomer');
            console.log(result1);
            console.log(result2);
            if (!err2) {
              const output = {
                EmployeeName: result1[0].EmployeeName,
                EmployeeMobile: result1[0].MobileNo,
                CustomerName: `${result2[0].FirstName} ${result2[0].LastName}`,
                CustomerMobile: result2[0].PhoneNumber,
              };
              console.log(output);
              res.status(200).send(output);
            } else {
              // sending output as error message if there is any server issues
              const output = {
                Error: 'Internal sever issues',
              };
              res.status(500).send(output);
            }
          });
        } else {
          // sending output as error message if there is any server issues
          const output = {
            Error: 'Internal sever issues',
          };
          res.status(500).send(output);
        }
      });
    } else if (err.code === 'ER_TRUNCATED_WRONG_VALUE_FOR_FIELD') {
      // if err.code === ER_TRUNCATED_WRONG_VALUE_FOR_FIELD
      // send Inappropriate value as return message
      res.status(406).send('Inappropriate value');
    } else if (err.code === 'ER_BAD_NULL_ERROR') {
      // if err.code === ER_BAD_NULL_ERROR send Null value not allowed as return message
      res.status(400).send('Null value not allowed');
    } else {
      // else if there is a server error return message
      res.status(500).send('Internal Server Error');
    }
  });
});
//= ======================================================
//              Features / Contract
//= ======================================================

// get Contracts per page
app.get('/contracts/:pageNumber', printDebugInfo, verifyToken, async (req, res) => {
  if (req.role == null) {
    res.status(403).send();
    return;
  }

  // extract pageNumber from parameter
  const { pageNumber } = req.params;

  // calling pageContract method from admin model
  Admin.pageContract(pageNumber, (err, result) => {
    // if no error send result
    if (!err) {
      res.status(200).send(result);
    } else {
      // if error send error message
      const output = {
        Error: 'Internal sever issues',
      };
      res.status(500).send(output);
    }
  });
});

// Get admin profile by AdminID
app.get('/admin/profile/:id', printDebugInfo, verifyToken, async (req, res) => {
  if (req.role == null) {
    res.status(403).send();
    return;
  }

  // extract id from params
  const adminID = req.params.id;

  // calling getAdminById method from Admin model
  Admin.getAdminById(adminID, (err, result) => {
    if (!err) {
      // if admin id is not found detect and return error message
      if (result.length === 0) {
        const output = {
          Error: 'Id not found',
        };
        res.status(404).send(output);
      } else {
        // output
        res.status(200).send(result);
      }
    } else {
      // sending output as error message if there is any server issues
      const output = {
        Error: 'Internal sever issues',
      };
      res.status(500).send(output);
    }
  });
});

// Update admin details with id in web parameter
app.put('/update/admin/:id', printDebugInfo, verifyToken, (req, res) => {
  if (req.role == null) {
    res.status(403).send();
    return;
  }
  // extract id from params
  const adminID = req.params.id;
  // extract all details needed
  const { firstName } = req.body;
  const { lastName } = req.body;
  const { email } = req.body;

  // calling updateAdminProfile method from admin model
  // eslint-disable-next-line max-len
  Admin.updateAdminProfile(firstName, lastName, email, adminID, (err, result) => {
    // if there is no errorsend the following as result
    if (!err) {
      console.log(`result ${result.affectedRows}`);
      res.status(202).send(result);
    } else if (err.code === 'ER_TRUNCATED_WRONG_VALUE_FOR_FIELD') {
      // if err.code === ER_TRUNCATED_WRONG_VALUE_FOR_FIELD
      // send Inappropriate value as return message
      res.status(406).send('Inappropriate value');
    } else if (err.code === 'ER_BAD_NULL_ERROR') {
      // if err.code === ER_BAD_NULL_ERROR send Null value not allowed as return message
      res.status(400).send('Null value not allowed');
    } else {
      // else if there is a server error return message
      res.status(500).send('Internal Server Error');
    }
  });
});

// Check admin password and return adminID if true
app.put('/admin/password/:id', printDebugInfo, verifyToken, async (req, res) => {
  if (req.role == null) {
    res.status(403).send();
    return;
  }
  // extract id from params
  const adminID = req.params.id;
  const { currentPassword } = req.body;
  // calling checkAdminPassword method from Admin model
  Admin.checkAdminPassword(adminID, currentPassword, (err, result) => {
    if (!err) {
      // output
      res.status(200).send(result);
    } else if (err.message === 'No result') {
      // if admin id is not found detect and return error message
      const output = {
        Error: 'Wrong password',
      };
      res.status(404).send(output);
    } else if (err.code === 'ER_TRUNCATED_WRONG_VALUE_FOR_FIELD') {
      // if err.code === ER_TRUNCATED_WRONG_VALUE_FOR_FIELD
      // send Inappropriate value as return message
      res.status(406).send('Inappropriate value');
    } else if (err.code === 'ER_BAD_NULL_ERROR') {
      // if err.code === ER_BAD_NULL_ERROR send Null value not allowed as return message
      res.status(400).send('Null value not allowed');
    } else {
      // else if there is a server error return message
      res.status(500).send('Internal Server Error');
    }
  });
});

app.put('/admin/editPassword/:id', printDebugInfo, verifyToken, async (req, res) => {
  console.log(req.role);
  if (req.role == null) {
    res.status(403).send();
    return;
  }
  // extract id from params
  const adminID = req.params.id;
  const { confirmPassword } = req.body;
  // calling getAdminById method from Admin model
  Admin.updateAdminPassword(confirmPassword, adminID, (err, result) => {
    if (!err) {
      // if admin id is not found detect and return error message
      if (result.length === 0) {
        const output = {
          Error: 'Id not found',
        };
        res.status(404).send(output);
      } else {
        // output
        res.status(200).send(result);
      }
    } else if (err.code === 'ER_TRUNCATED_WRONG_VALUE_FOR_FIELD') {
      // if err.code === ER_TRUNCATED_WRONG_VALUE_FOR_FIELD
      // send Inappropriate value as return message
      res.status(406).send('Inappropriate value');
    } else if (err.code === 'ER_BAD_NULL_ERROR') {
      // if err.code === ER_BAD_NULL_ERROR send Null value not allowed as return message
      res.status(400).send('Null value not allowed');
    } else {
      // else if there is a server error return message
      res.status(500).send('Internal Server Error');
    }
  });
});

app.get('/bookingsByMonth', printDebugInfo, verifyToken, async (req, res) => {
  if (req.role == null) {
    res.status(403).send();
    return;
  }
  // calling getAllClassOfService method from admin model
  Admin.getBookingByMonth((err, result) => {
    // array to store and send the finalOutput
    const finalOutput = [];
    // array to store and send all the months
    const month = [];
    // array to store number of booking made in a month
    const numMonthBooking = [];

    if (!err) {
      // loop through the months
      for (let i = 0; i < result.length; i++) {
        // pushing month and numbber of booking made in january if result for january is available
        if (result[i].month === 1) {
          month.push(result[i].month);
          numMonthBooking.push(result[i].numberOfBooking);
        }
        // pushing month and numbber of booking made in february if result for february is available
        if (result[i].month === 2) {
          month.push(result[i].month);
          numMonthBooking.push(result[i].numberOfBooking);
        }
        // pushing month and numbber of booking made in march if result for march is available
        if (result[i].month === 3) {
          month.push(result[i].month);
          numMonthBooking.push(result[i].numberOfBooking);
        }
        // pushing month and numbber of booking made in april if result for april is available
        if (result[i].month === 4) {
          month.push(result[i].month);
          numMonthBooking.push(result[i].numberOfBooking);
        }
        // pushing month and numbber of booking made in may if result for may is available
        if (result[i].month === 5) {
          month.push(result[i].month);
          numMonthBooking.push(result[i].numberOfBooking);
        }
        // pushing month and numbber of booking made in june if result for june is available
        if (result[i].month === 6) {
          month.push(result[i].month);
          numMonthBooking.push(result[i].numberOfBooking);
        }
        // pushing month and numbber of booking made in july if result for july is available
        if (result[i].month === 7) {
          month.push(result[i].month);
          numMonthBooking.push(result[i].numberOfBooking);
        }
        // pushing month and numbber of booking made in august if result for august is available
        if (result[i].month === 8) {
          month.push(result[i].month);
          numMonthBooking.push(result[i].numberOfBooking);
        }
        // pushing month and numbber of booking made in
        // september if result for september is available
        if (result[i].month === 9) {
          month.push(result[i].month);
          numMonthBooking.push(result[i].numberOfBooking);
        }
        // pushing month and numbber of booking made in october if result for january is available
        if (result[i].month === 10) {
          month.push(result[i].month);
          numMonthBooking.push(result[i].numberOfBooking);
        }
        // pushing month and numbber of booking made in
        // novemeber if result for novemeber is available
        if (result[i].month === 11) {
          month.push(result[i].month);
          numMonthBooking.push(result[i].numberOfBooking);
        }
        // pushing month and numbber of booking made in december if result for december is available
        if (result[i].month === 12) {
          month.push(result[i].month);
          numMonthBooking.push(result[i].numberOfBooking);
        }
      }

      // setting countNumBooking to 0
      let countNumBooking = 0;
      // getting length of the number of months that have booking
      const actualCountNumBooking = numMonthBooking.length;
      // for loop to check if booking for month was retrieved and assigning the
      // value of number of booking and month into finalOutput as objects
      for (let x = 1; x < 13; x++) {
        // check if the array month inclues value of x
        // and add the month and number of booking made in
        if (month.includes(x)) {
          // to ensure that the number of bookings that are
          // equivilent to the number of booking beign added
          countNumBooking++;
          if (countNumBooking <= actualCountNumBooking) {
            finalOutput.push({ month: x, numberOfBooking: numMonthBooking[countNumBooking - 1] });
          }
        } else {
          // if array does not include month get the month and put it's numberOfBooking as 0
          finalOutput.push({ month: x, numberOfBooking: 0 });
        }
      }
      // send all the months and number of booking made
      // in month as array of objects called finalOutput
      res.status(200).send(finalOutput);
    } else {
      res.status(500).send('Some error');
    }
  });
});

// get revenue of the month
app.get('/revenueOfTheMonth', printDebugInfo, verifyToken, async (req, res) => {
  if (req.role == null) {
    res.status(403).send();
    return;
  }
  // calling getAllRates method from admin model
  Admin.getRevenueOfTheMonth((err, result) => {
    if (!err) {
      // inistialise sum as 0
      let sum = 0;
      // loop throught the result and add the revenue calculated for each month as the sum
      for (let i = 0; i < result.length; i++) {
        // adding value to the sum
        sum += result[i].Revenue;
      }
      // assigning output as a object with the key of totalRevenue and value of sum calculated
      const output = { totalRevenue: sum };
      // send output
      res.status(200).send(output);
    } else {
      res.status(500).send('Some error');
    }
  });
});

// Scan through contract table to insert the contract abnormality record
app.get('/abnormality/contracts/checks', printDebugInfo, verifyToken, async (req, res) => {
  console.log(req.role);
  if (req.role == null) {
    res.status(403).send();
    return;
  }
  // Get the total abnormal contracts and group by customer in contract table
  Admin.scanAbnormalContract((err, result) => {
    if (!err) {
      // Get all details in the contract table
      Admin.getNumOfAbnormalContracts((err1, result1) => {
        if (!err) {
          // Loop through the contract table record
          for (let i = 0; i < result.length; i++) {
            // Get the customer ID of the returned contract table record
            const CustomerID = result[i].Customer;
            // Get the total contract from the returned contract table record
            const { TotalContract } = result[i];

            // Get contract abnormality by customer
            Admin.checkAbnContractById(CustomerID, (err2, result2) => {
              if (!err) {
                // If customer is not found
                if (result2.length === 0) {
                  // Add the customer into the abnormality table
                  Admin.newContractAbnormality(CustomerID, TotalContract, (err3, result3) => {
                    if (!err) {
                      console.log('New customer added');
                    } else {
                      console.log(err3);
                    }
                  });
                } else {
                  // Get the total num of abnormal contracts in contract_abnormality table
                  // const { TotalAbnContracts } = result2[0];

                  // Get the status of the abnormal contract
                  const status = result2[0].AbnormalStatus;
                  console.log(`status: ${status}`);
                  if (status === 'Abnormal') {
                    // There should only have 1 abnormal per customer
                    // If abnormal contract status is abnormal,
                    // jus update the total abnormal contract num
                    Admin.updateNumOfAbnContracts(
                      TotalContract,
                      CustomerID,
                      status,
                      (err4, result4) => {
                        if (!err) {
                          console.log('Total Updated');
                        } else {
                          console.log('internal error');
                          console.log(err4);
                        }
                      },
                    );
                  }

                  if (status === 'Resolved') {
                    // For loop will add up the total abnormal contract in
                    // the contract abnormality table where the status is resolved
                    // There might be more than 1 resolved record
                    let initialContractNo = 0;
                    for (let x = 0; x < result2.length; x++) {
                      if (status === 'Resolved') {
                        // If abnormal contract status add the total abnormal contract
                        initialContractNo += result2[x].TotalAbnContracts;
                      }
                    }
                    console.log(`initialContractNo: ${initialContractNo}`);
                    // Totalcontract: Num of abnormal contracts in contract table for each customer
                    const contractNoDiff = TotalContract - initialContractNo;
                    console.log(`contractNoDiff: ${contractNoDiff}`);
                    // If the remainder if still more than 5,
                    // insert another record in contract_abnormality
                    if (contractNoDiff >= 5) {
                      // Insert the record in
                      Admin.newContractAbnormality(CustomerID, contractNoDiff, (err5, result5) => {
                        if (!err) {
                          console.log('New customer added');
                        } else {
                          console.log(err5);
                        }
                      });
                    }
                  }
                }
              } else {
                console.log('internal error');
              }
            });
          }
          res.send('Contract Abnormality Retrieved Successfully');
        } else {
          // sending output as error message if there is any server issues
          const output = {
            Error: 'Internal sever issues',
          };
          res.status(500).send(output);
        }
      });
    } else {
      // sever error
      const output = {
        Error: 'Internal sever issues',
      };
      res.status(500).send(output);
    }
  });
});

// Get the number of contract abnormalities per customer
app.get('/abnormality/contracts', printDebugInfo, verifyToken, async (req, res) => {
  console.log(req.role);
  if (req.role == null) {
    res.status(403).send();
    return;
  }
  // calling getAllRates method from admin model
  Admin.getAbnormalContracts((err, result) => {
    if (!err) {
      // result.affectedRows indicates that id to be deleted
      // cannot be found hence send as error message
      if (result.affectedRows === 0) {
        res.status(404).send('Item cannot be deleted');
      } else {
        // else a postitve result
        res.status(200).send(result);
      }
    } else {
      // sever error
      const output = {
        Error: 'Internal sever issues',
      };
      res.status(500).send(output);
    }
  });
});

// Get abnormal contracts
app.get('/abnormality/contracts/:customerId/:contractnum', printDebugInfo, verifyToken, async (req, res) => {
  const CustomerID = req.params.customerId;
  const AbnContractNum = parseInt(req.params.contractnum, 10);
  console.log(req.role);
  if (req.role == null) {
    res.status(403).send();
    return;
  }

  // calling getAllRates method from admin model
  Admin.getAbnormalContractsByID(CustomerID, AbnContractNum, (err, result) => {
    if (!err) {
      // result.affectedRows indicates that id to be deleted
      // cannot be found hence send as error message
      if (result.affectedRows === 0) {
        res.status(404).send('Item cannot be deleted');
      } else {
        // else a postitve result
        res.status(200).send(result);
      }
    } else {
      // sever error
      const output = {
        Error: 'Internal sever issues',
      };
      res.status(500).send(output);
    }
  });
});

// Resolve abnormal contracts
app.put('/abnormalcontracts/:id', printDebugInfo, verifyToken, async (req, res) => {
  // extract id from params
  const contractId = req.params.id;
  console.log(req.role);
  if (req.role == null) {
    res.status(403).send();
    return;
  }

  // calling resolveAbnormalContract method from Admin model
  Admin.resolveAbnormalContract(contractId, (err, result) => {
    if (!err) {
      // if admin id is not found detect and return error message
      if (result.length === 0) {
        const output = {
          Error: 'Id not found',
        };
        res.status(404).send(output);
      } else {
        // output
        res.status(200).send(result);
      }
    } else if (err.code === 'ER_TRUNCATED_WRONG_VALUE_FOR_FIELD') {
      // if err.code === ER_TRUNCATED_WRONG_VALUE_FOR_FIELD
      // send Inappropriate value as return message
      res.status(406).send('Inappropriate value');
    } else if (err.code === 'ER_BAD_NULL_ERROR') {
      // if err.code === ER_BAD_NULL_ERROR send Null value not allowed as return message
      res.status(400).send('Null value not allowed');
    } else {
      // else if there is a server error return message
      res.status(500).send('Internal Server Error');
    }
  });
});

// Cancel abnormal contracts
app.put('/cancelAbnContract/:id', printDebugInfo, verifyToken, (req, res) => {
  // extract id from params
  const { id } = req.params;
  console.log(req.role);
  if (req.role == null) {
    res.status(403).send();
    return;
  }
  // calling resolveAbnormalContract method from SuperAdmin model
  Admin.cancelAbnormalContract(id, (err, result) => {
    if (!err) {
      res.status(200).send(result);
    } else if (err.code === 'ER_TRUNCATED_WRONG_VALUE_FOR_FIELD') {
      // if err.code === ER_TRUNCATED_WRONG_VALUE_FOR_FIELD
      // send Inappropriate value as return message
      res.status(406).send('Inappropriate value');
    } else if (err.code === 'ER_BAD_NULL_ERROR') {
      // if err.code === ER_BAD_NULL_ERROR send Null value not allowed as return message
      res.status(400).send('Null value not allowed');
    } else {
      // else if there is a server error return message
      res.status(500).send('Internal Server Error');
    }
  });
});

// ====================== Customer Section ======================
// Get user profile
app.get('/customerAddBooking/:customerID', printDebugInfo, verifyTokenCustomer, async (req, res, next) => {
  const customerId = req.params.customerID;

  Customer.getCustomerById(customerId, (err, result) => {
    if (!err) {
      res.status(200).send(result);
    } else {
      return next(err);
    }
  });
});

app.get('/helpers/:bookingDates', printDebugInfo, verifyTokenCustomer, async (req, res) => {
  const dates = req.params.bookingDates;

  // calling possibleAvailableHelpers method from customer model
  Customer.possibleAvailableHelpers(dates, (err, result) => {
    // if no error send result
    if (!err) {
      // if id not found detect and return error message
      if (result.length === 0) {
        const output = {
          Error: 'Id not found',
        };
        res.status(404).send(output);
      } else {
        // output
        res.status(200).send(result);
      }
    } else {
      // sending output as error message if there is any server issues
      const output = {
        Error: 'Internal sever issues',
      };
      res.status(500).send(output);
    }
  });
});

// Update own account details
app.put('/update/customer/:id', printDebugInfo, verifyTokenCustomer, (req, res) => {
  // extract id from params
  const customerId = req.params.id;
  // extract all details needed
  const { firstName } = req.body;
  const { lastName } = req.body;
  const { address } = req.body;
  const { postal } = req.body;
  const { phoneNumber } = req.body;
  const { email } = req.body;

  // calling updateCustProfile method from customer model
  // eslint-disable-next-line max-len
  Customer.updateCustProfile(firstName, lastName, address, postal, phoneNumber, email, customerId, (err, result) => {
    // if there is no errorsend the following as result
    if (!err) {
      console.log(`result ${result.affectedRows}`);

      res.status(202).send(result);
    } else if (err.code === 'ER_TRUNCATED_WRONG_VALUE_FOR_FIELD') {
      // if err.code === ER_TRUNCATED_WRONG_VALUE_FOR_FIELD
      // send Inappropriate value as return message
      res.status(406).send('Inappropriate value');
    } else if (err.code === 'ER_BAD_NULL_ERROR') {
      // if err.code === ER_BAD_NULL_ERROR send Null value not allowed as return message
      res.status(400).send('Null value not allowed');
    } else {
      // else if there is a server error return message
      res.status(500).send('Internal Server Error');
    }
  });
});

app.get('/user/customer/:id', printDebugInfo, verifyTokenCustomer, async (req, res) => {
  // extract id from params
  const customerId = req.params.id;

  // calling getCustomerById method from Customer model
  Customer.getCustomerById(customerId, (err, result) => {
    if (!err) {
      // if customer id is not found detect and return error message
      if (result.length === 0) {
        const output = {
          Error: 'Id not found',
        };
        res.status(404).send(output);
      } else {
        // output
        res.status(200).send(result);
      }
    } else {
      // sending output as error message if there is any server issues
      const output = {
        Error: 'Internal sever issues',
      };
      res.status(500).send(output);
    }
  });
});

// get all class of services
app.get('/classOfService', printDebugInfo, verifyTokenCustomer, async (req, res) => {
  // calling getAllClassOfService method from customer model
  Customer.getAllClassOfService((err, result) => {
    if (!err) {
      console.log('==================================');
      console.log('get class of service');
      console.log('==================================');
      res.status(200).send(result);
    } else {
      res.status(500).send('Some error');
    }
  });
});

app.get('/show/bookings/:id', printDebugInfo, verifyTokenCustomer, (req, res) => {
  // extract id from params
  const customerId = req.params.id;
  // calling updateCustProfile method from customer model
  // eslint-disable-next-line max-len
  Customer.getBookingDetails(customerId, (err, result) => {
    // if there is no errorsend the following as result
    if (!err) {
      console.log(`result ${result}`);

      res.status(202).send(result);
    } else {
      res.status(500).send('Internal Server Error');
    }
  });
});

app.post('/customer/autobooking', printDebugInfo, verifyTokenCustomer, (req, res) => {
  // extract contract data from request body
  const { customer } = req.body;
  const { StartDate } = req.body;
  const { Package } = req.body;
  const { DayOfService } = req.body;
  const { DayOfService2 } = req.body;
  const { TimeOfService } = req.body;
  const { EstimatedPricing } = req.body;
  const { ExtraNotes } = req.body;
  const { NoOfRooms } = req.body;
  const { NoOfBathrooms } = req.body;
  const { Address } = req.body;
  const { Class } = req.body;
  const { Rate } = req.body;
  const { ExtraService } = req.body;
  const { PostalCode } = req.body;
  console.log(PostalCode);

  // Declare newContractId variable
  let newContractId;
  // Get contract start date and convert to moment form
  const start = moment(StartDate);
  // Get last day of current month depending on the contract start date
  const end = moment(StartDate).endOf('month');
  // Declare a date array
  let dateArray = [];

  // Function to add a booking record
  function AddBooking(ContractID, ScheduleDate) {
    // invokes addBooking method created at superAdmin file in app.js
    // eslint-disable-next-line no-unused-vars
    SuperAdmin.addBooking(ContractID, ScheduleDate, (err, result) => {
      // if no error send result
      if (!err) {
        console.log('done');
      } else {
        // if error send error message
        res.status(500).send('Some error');
      }
    });
  }

  // Function to getDateRange from contract start date to last day of month
  // Gets the date of the wanted days between this range
  function getDateRange(day) {
    // Calls an empty dateArray to clear whatever is within it
    dateArray = [];
    // Gets the dayname from the contract start day and stores within tmp constant
    const tmp = start.clone().day(day);
    // Get the day number of the contract start date
    const startDay = start.day();
    // Converts startDay constant into name format
    // Stores within startDayName constant
    const startDayName = moment().day(startDay).format('ddd');

    // Check if day of contract start date is equals to the first day of service
    if (startDayName === DayOfService) {
      // Pushes contract start date into dateArray
      dateArray.push(start.format('YYYY-MM-DD'));
    }

    // Check if tmp is after the contract start date
    if (tmp.isAfter(start, 'd')) {
      // Pushes date into dateArray
      dateArray.push(tmp.format('YYYY-MM-DD'));
    }
    // While loop to check if tmp is before last day of the month
    while (tmp.isBefore(end)) {
      // Adds one week to the date
      tmp.add(7, 'days');
      // Pushes date into dateArray
      dateArray.push(tmp.format('YYYY-MM-DD'));
    }
  }

  // Function to getDateRange from contract start date to last day of month
  // Gets the date of the wanted days between this range
  // For those contracts which chose the second package
  function getDateRange2(day) {
    // Calls an empty dateArray to clear whatever is within it
    dateArray = [];
    // Gets the dayname from the contract start day and stores within tmp constant
    const tmp = start.clone().day(day);
    // Get the day number of the contract start date
    const startDay = start.day();
    // Converts startDay constant into name format
    // Stores within startDayName constant
    const startDayName = moment().day(startDay).format('ddd');

    // Check if day of contract start date is equals to the second day of service
    if (startDayName === DayOfService2) {
      // Pushes contract start date into dateArray
      dateArray.push(start.format('YYYY-MM-DD'));
    }

    // Check if tmp is after the contract start date
    if (tmp.isAfter(start, 'd')) {
      // Pushes date into dateArray
      dateArray.push(tmp.format('YYYY-MM-DD'));
    }
    // While loop to check if tmp is before last day of the month
    while (tmp.isBefore(end)) {
      // Adds one week to the date
      tmp.add(7, 'days');
      // Pushes date into dateArray
      dateArray.push(tmp.format('YYYY-MM-DD'));
    }
  }

  // invokes addContract method created at Customer model
  Customer.addContract(
    customer,
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
    (err, result) => {
      if (!err) {
        // stores the contract Id returned into the newContractId variable
        newContractId = result.insertId;
        if (DayOfService.includes('Mon')) {
          // check if DayOfService includes 'Mon' which represents monday
          getDateRange(1);
          // loop through the mondays and extract the date
          for (let x = 0; x < dateArray.length - 1; x++) {
            // Stores the date into ScheduleDate const
            const ScheduleDate = dateArray[x];
            // call addbooking function
            AddBooking(newContractId, ScheduleDate);
          }
        } else if (DayOfService.includes('Tue')) {
          // check if DayOfService includes 'Tue' which represents tuesday
          getDateRange(2);
          // loop through the tuesday and extract the date
          for (let x = 0; x < dateArray.length - 1; x++) {
            // Stores the date into ScheduleDate const
            const ScheduleDate = dateArray[x];
            // call addbooking function
            AddBooking(newContractId, ScheduleDate);
          }
        } else if (DayOfService.includes('Wed')) {
          // check if DayOfService includes 'Wed' which represents tuesday
          getDateRange(3);
          // loop through the wednesday and extract the date
          for (let x = 0; x < dateArray.length - 1; x++) {
            // Stores the date into ScheduleDate const
            const ScheduleDate = dateArray[x];
            // call addbooking function
            AddBooking(newContractId, ScheduleDate);
          }
        } else if (DayOfService.includes('Thu')) {
          // check if DayOfService includes 'Thu' which represents tuesday
          getDateRange(4);
          // loop through the thursday and extract the date
          for (let x = 0; x < dateArray.length - 1; x++) {
            // Stores the date into ScheduleDate const
            const ScheduleDate = dateArray[x];
            // call addbooking function
            AddBooking(newContractId, ScheduleDate);
          }
        } else if (DayOfService.includes('Fri')) {
          // check if DayOfService includes 'Fri' which represents tuesday
          getDateRange(5);
          // loop through the friday and extract the date
          for (let x = 0; x < dateArray.length - 1; x++) {
            // Stores the date into ScheduleDate const
            const ScheduleDate = dateArray[x];
            // call addbooking function
            AddBooking(newContractId, ScheduleDate);
          }
        } else if (DayOfService.includes('Sat')) {
          // check if DayOfService includes 'Sat' which represents tuesday
          getDateRange(6);
          // loop through the saturday and extract the date
          for (let x = 0; x < dateArray.length - 1; x++) {
            // Stores the date into ScheduleDate const
            const ScheduleDate = dateArray[x];
            // call addbooking function
            AddBooking(newContractId, ScheduleDate);
          }
        } else if (DayOfService.includes('Sun')) {
          // check if DayOfService includes 'Sun' which represents tuesday
          getDateRange(0);
          // loop through the sunday and extract the date
          for (let x = 0; x < dateArray.length - 1; x++) {
            // Stores the date into ScheduleDate const
            const ScheduleDate = dateArray[x];
            // call addbooking function
            AddBooking(newContractId, ScheduleDate);
          }
        }

        // check if Pakage equals to 2
        if (Package === '2') {
          // check if DayOfService2 includes 'Mon' which represents monday
          if (DayOfService2.includes('Mon')) {
            getDateRange2(1);
            // loop through the mondays and extract the date
            for (let x = 0; x < dateArray.length - 1; x++) {
              // Stores the date into ScheduleDate const
              const ScheduleDate = dateArray[x];
              // call addbooking function
              AddBooking(newContractId, ScheduleDate);
            }
          } else if (DayOfService2.includes('Tue')) {
            // check if DayOfService2 includes 'Tue' which represents tuesday
            getDateRange2(2);
            // loop through the tuesday and extract the date
            for (let x = 0; x < dateArray.length - 1; x++) {
              // Stores the date into ScheduleDate const
              const ScheduleDate = dateArray[x];
              // call addbooking function
              AddBooking(newContractId, ScheduleDate);
            }
          } else if (DayOfService2.includes('Wed')) {
            // check if DayOfService2 includes 'Wed' which represents tuesday
            getDateRange2(3);
            // loop through the wednesday and extract the date
            for (let x = 0; x < dateArray.length - 1; x++) {
              // Stores the date into ScheduleDate const
              const ScheduleDate = dateArray[x];
              // call addbooking function
              AddBooking(newContractId, ScheduleDate);
            }
          } else if (DayOfService2.includes('Thu')) {
            // check if DayOfService2 includes 'Thu' which represents tuesday
            getDateRange2(4);
            // loop through the thursday and extract the date
            for (let x = 0; x < dateArray.length - 1; x++) {
              // Stores the date into ScheduleDate const
              const ScheduleDate = dateArray[x];
              // call addbooking function
              AddBooking(newContractId, ScheduleDate);
            }
          } else if (DayOfService2.includes('Fri')) {
            // check if DayOfService2 includes 'Fri' which represents tuesday
            getDateRange2(5);
            // loop through the friday and extract the date
            for (let x = 0; x < dateArray.length - 1; x++) {
              // Stores the date into ScheduleDate const
              const ScheduleDate = dateArray[x];
              // call addbooking function
              AddBooking(newContractId, ScheduleDate);
            }
          } else if (DayOfService2.includes('Sat')) {
            // check if DayOfService2 includes 'Sat' which represents tuesday
            getDateRange2(6);
            // loop through the saturday and extract the date
            for (let x = 0; x < dateArray.length - 1; x++) {
              // Stores the date into ScheduleDate const
              const ScheduleDate = dateArray[x];
              // call addbooking function
              AddBooking(newContractId, ScheduleDate);
            }
          } else if (DayOfService2.includes('Sun')) {
            // check if DayOfService2 includes 'Sun' which represents tuesday
            getDateRange2(0);
            // loop through the sunday and extract the date
            for (let x = 0; x < dateArray.length - 1; x++) {
              // Stores the date into ScheduleDate const
              const ScheduleDate = dateArray[x];
              // call addbooking function
              AddBooking(newContractId, ScheduleDate);
            }
          }
        }
        // respond
        res.status(201).send(result);
      } else if (err.code === 'ER_TRUNCATED_WRONG_VALUE_FOR_FIELD') {
        res.status(406).send('Inappropriate value');
      } else if (err.code === 'ER_BAD_NULL_ERROR') {
        res.status(400).send('Null value not allowed');
      } else {
        res.status(500).send('Internal Server Error');
      }
    },
  );
});

// get all packages
app.get('/package', printDebugInfo, async (req, res) => {
  // calling getAllPackage method from customer model
  Customer.getAllPackage((err, result) => {
    if (!err) {
      console.log('==================================');
      console.log('get package');
      console.log('==================================');
      res.status(200).send(result);
    } else {
      res.status(500).send('Some error');
    }
  });
});

// get all rates
app.get('/rates', printDebugInfo, async (req, res) => {
  // calling getAllRates method from customer model
  Customer.getAllRates((err, result) => {
    if (!err) {
      console.log('==================================');
      console.log('get rates');
      console.log('==================================');
      res.status(200).send(result);
    } else {
      res.status(500).send('Some error');
    }
  });
});

// get all additional service
app.get('/additionalService', printDebugInfo, async (req, res) => {
  // calling getAllAdditionalService method from customer model
  Customer.getAllAdditionalService((err, result) => {
    if (!err) {
      console.log('==================================');
      console.log('get additional service');
      console.log('==================================');
      res.status(200).send(result);
    } else {
      res.status(500).send('Some error');
    }
  });
});
// cancel booking for customer
app.put('/update/customerBooking/:id', printDebugInfo, verifyToken, (req, res) => {
  if (req.id == null) {
    res.status(403).send();
    return;
  }
  // extract id from params
  const bookingId = req.params.id;

  // eslint-disable-next-line no-shadow
  function cancelBooking(bookingId) {
    function adminEmail() {
      Admin.getAdminEmail((err, result) => {
        // if there is no errorsend the following as result
        let AdminEtwo = '';
        if (!err) {
          for (x = 0; x < result.length; x++) {
            AdminEtwo += `${result[x].Email},`;
          }
          const mailOptions = {
            from: process.env.AUTH_EMAIL,
            to: AdminEtwo,
            subject: 'MOC - Booking Cancel',
            html: `
          <p>Booking ID ${bookingId} have been cancelled</p>
         `,
          };
          transporter
            .sendMail(mailOptions)
            .then(() => {
              msg = 'sent';
              console.log('email sent');
              // email sent and verification record saved
              res.status(200).send({
                status: 'Pending',
                message: 'Reset Password email sent',
              });
            })
            .catch((error) => {
              console.log(`error: ${error}`);
              res.status(404).json({
                status: 'Failed',
                message: 'Reset Password email failed!',
              });
            });
        } else {
          res.status(500).send('Internal Server Error');
        }
      });
    }
    Customer.updateBookingStatus(bookingId, (err, result) => {
      // if there is no errorsend the following as result
      if (!err) {
        adminEmail();
      } else {
        res.status(500).send('Internal Server Error');
      }
    });
  }
  // get currentDate
  const currentDate = new Date();
  // ger currentTime
  // eslint-disable-next-line no-unused-vars
  const currentTime = moment().format('HH:MM:SS');
  // initialising variables for bookingDate
  let bookingDate;
  // initialising variables for bookingTime
  // eslint-disable-next-line no-unused-vars
  let bookingTime;
  // initialising variables for diffInDates
  let diffInDates;
  // initialising variables for diffInHours
  let diffInHours;
  // initialising variables for diffInTime
  // eslint-disable-next-line no-unused-vars
  let diffInTime;
  // initialising variables for statusOfAppointment
  let statusOfAppointment;

  // get a cusotmer by id
  Customer.getABookingById(bookingId, (err, result) => {
    // if there is no errorsend the following as result
    if (!err) {
      // get bookingDate from the result
      bookingDate = result[0].ScheduleDate;
      // get bookingTIme from the result
      bookingTime = result[0].TimeOfService;
      // get statusOfAppointment from the result
      statusOfAppointment = result[0].Status;
      // calculating diffInDates
      diffInDates = moment(bookingDate).diff(moment(currentDate), 'days');
      // calculating diffInHours
      diffInHours = moment(bookingDate).diff(moment(currentDate), 'hours');

      // check if status of appointment is cancelled and send result as already cancelled
      if (statusOfAppointment === 'Cancelled') {
        console.log('Already cancelled');
        res.status(200).send('Already cancelled');
      } else if (diffInDates === 0) {
        // check if diffInDates equals to 0
        // check if diffInHours equals to 0 and send result Cannot cancel as appointment is today
        if (diffInHours === 0) {
          console.log('Cannot cancel as appointment is today');
          res.status(200).send('Cannot cancel as appointment is today');
        } else {
          // else send result Cannot cancel as appointment is tmr
          console.log('Cannot cancel as appointment is tmr');
          res.status(200).send('Cannot cancel as appointment is tmr');
        }
      } else if (diffInDates < 0) {
        // check if diffInDates less than 0 and send result Cannot cancel as appointment is finished
        console.log('Cannot cancel as appointment is finished');
        res.status(200).send('Cannot cancel as appointment is finished');
      } else {
        // else call the cancelBooking() function with it's id
        console.log('Cancel');
        cancelBooking(bookingId);
      }
    } else if (err.code === 'ER_TRUNCATED_WRONG_VALUE_FOR_FIELD') {
      // if err.code === ER_TRUNCATED_WRONG_VALUE_FOR_FIELD
      // send Inappropriate value as return message
      res.status(406).send('Inappropriate value');
    } else if (err.code === 'ER_BAD_NULL_ERROR') {
      // if err.code === ER_BAD_NULL_ERROR send Null value not allowed as return message
      res.status(400).send('Null value not allowed');
    } else {
      // else if there is a server error return message
      res.status(500).send('Internal Server Error');
    }
  });
});
// Get all contracts
app.get('/contracts', printDebugInfo, verifyToken, async (req, res) => {
  if (req.role == null) {
    res.status(403).send();
    return;
  }
  // calling getAllContracts method from admin model
  Admin.getAllContracts((err, result) => {
    // if no error send result
    if (!err) {
      res.status(200).send(result);
    } else {
      // if error send error message
      res.status(500).send('Some error');
    }
  });
});

app.get('/cancelledBookingAbnormality', printDebugInfo, verifyToken, async (req, res) => {
  if (req.role == null) {
    res.status(403).send();
    return;
  }
  // array to push customerIds that are allready abnormal
  const customerIds = [];
  let customerIdsU;
  // final output
  function finalOp() {
    // call getCancellationAbnormailtyDisplay mthod
    Admin.getCancellationAbnormailtyDisplay((err, result) => {
      if (!err) {
        res.status(200).send(result);
      } else {
        res.status(500).send('Some error');
      }
    });
  }
  // insert abnormaly to insert abnormal ids and data
  function insertCancelAbnormaly(customerID) {
    Admin.insertCancelAbnormality(customerID, (err, result) => {
      // if no error send results as positive
      if (!err) {
        console.log('inserted');
      } else if (err.code === 'ER_TRUNCATED_WRONG_VALUE_FOR_FIELD') {
        // if err.code === ER_TRUNCATED_WRONG_VALUE_FOR_FIELD
        // send Inappropriate value as return message
        res.status(406).send('Inappropriate value');
      } else if (err.code === 'ER_BAD_NULL_ERROR') {
        // if err.code === ER_BAD_NULL_ERROR send Null value not allowed as return message
        res.status(400).send('Null value not allowed');
      } else {
        // else if there is a server error return message
        res.status(500).send('Internal Server Error');
      }
    });
  }
  // get all the abnormalities to be cancelled
  function getCancellationAbnormalyDetails() {
    // call getCancellationAbnormailtyDetails method
    Admin.getCancellationAbnormailtyDetails((err, result) => {
      let customerID;
      // push cutomer id
      const c = [];
      // unique customer id
      let uc;
      if (!err) {
        for (i = 0; i < result.length; i++) {
          // retrieve customer id
          customerID = result[i].Customer;
          // push the customer id into the array
          c.push(customerID);
          // getting unique customer id
          customerIdsU = [...new Set(customerIds)];
          // check if customer ids to be inserted is in the array
          if ((customerIds.includes(customerID))) {
            console.log(`${customerID}is already inserted cutomerID`);
          } else {
            // insert the customer id as abnormally
            insertCancelAbnormaly(customerID);
          }
        }
        // call finalop method
        finalOp();
      } else {
        res.status(500).send('Some error');
      }
    });
  }
  // get all the cancel abnormaly in the database
  function getAllCancelAbnormaly() {
    // call the getAllCancelAbnormalities method
    Admin.getAllCancelAbnormalities((err, result) => {
      let customerID;
      if (!err) {
        for (i = 0; i < result.length; i++) {
          // push customerIds into array
          customerIds.push(result[i].CustomerID);
        }
      } else {
        res.status(500).send('Some error');
      }
    });
  }
  // get all the cancel abnormaly in the database
  getAllCancelAbnormaly();

  // get cancel abooking details
  getCancellationAbnormalyDetails();
});

app.put('/updateCancelAbnormality/:id', printDebugInfo, verifyToken, (req, res) => {
  if (req.role == null) {
    res.status(403).send();
    return;
  }
  // extract id from params
  const customerId = req.params.id;

  // calling updateCustProfile method from customer model
  // eslint-disable-next-line max-len
  Admin.updateCancelAbnormaityStatus(customerId, (err, result) => {
    // if there is no errorsend the following as result
    if (!err) {
      console.log(`result ${result.affectedRows}`);

      res.status(202).send(result);
    } else if (err.code === 'ER_TRUNCATED_WRONG_VALUE_FOR_FIELD') {
      // if err.code === ER_TRUNCATED_WRONG_VALUE_FOR_FIELD
      // send Inappropriate value as return message
      res.status(406).send('Inappropriate value');
    } else if (err.code === 'ER_BAD_NULL_ERROR') {
      // if err.code === ER_BAD_NULL_ERROR send Null value not allowed as return message
      res.status(400).send('Null value not allowed');
    } else {
      // else if there is a server error return message
      res.status(500).send('Internal Server Error');
    }
  });
});

app.put('/updateCustomerStatus/:id', printDebugInfo, verifyToken, (req, res) => {
  // extract id from params
  const customerId = req.params.id;

  // calling updateCustProfile method from customer model
  // eslint-disable-next-line max-len
  Admin.updateCustomerStatus(customerId, (err, result) => {
    // if there is no errorsend the following as result
    if (!err) {
      console.log(`result ${result.affectedRows}`);

      res.status(202).send(result);
    } else if (err.code === 'ER_TRUNCATED_WRONG_VALUE_FOR_FIELD') {
      // if err.code === ER_TRUNCATED_WRONG_VALUE_FOR_FIELD
      // send Inappropriate value as return message
      res.status(406).send('Inappropriate value');
    } else if (err.code === 'ER_BAD_NULL_ERROR') {
      // if err.code === ER_BAD_NULL_ERROR send Null value not allowed as return message
      res.status(400).send('Null value not allowed');
    } else {
      // else if there is a server error return message
      res.status(500).send('Internal Server Error');
    }
  });
});

// ====================== Super Admin Section ======================
// get all admin
app.get('/admin', printDebugInfo, verifyToken, async (req, res) => {
  if (req.role == null) {
    res.status(403).send();
    return;
  }

  if (req.role !== 'Super Admin') {
    res.status(403).send();
    return;
  }
  // calling getAllAdmins method from SuperAdmin model
  SuperAdmin.getAllAdmins((err, result) => {
    // if no error send result
    if (!err) {
      // if id not found detect and return error message
      if (result.length === 0) {
        const output = {
          Error: 'Id not found',
        };
        res.status(404).send(output);
      } else {
        // output
        res.status(200).send(result);
      }
    } else {
      // if error send error message
      res.status(500).send('Some error');
    }
  });
});

// get an admin
app.get('/oneadmin/:id', printDebugInfo, verifyToken, async (req, res) => {
  if (req.role == null) {
    res.status(403).send();
    return;
  }

  if (req.role !== 'Super Admin') {
    res.status(403).send();
    return;
  }
  // extract id from params
  const adminId = req.params.id;

  // calling getAdmin method from SuperAdmin model
  SuperAdmin.getAdmin(adminId, (err, result) => {
    if (!err) {
      // if id not found detect and return error message
      if (result.length === 0) {
        const output = {
          Error: 'Id not found',
        };
        res.status(404).send(output);
      } else {
        // output
        res.status(200).send(result);
      }
    } else {
      // sending output as error message if there is any server issues
      const output = {
        Error: 'Internal sever issues',
      };
      res.status(500).send(output);
    }
  });
});

// update admin
app.put('/admin/:id', printDebugInfo, verifyToken, (req, res) => {
  if (req.role == null) {
    res.status(403).send();
    return;
  }

  if (req.role !== 'Super Admin') {
    res.status(403).send();
    return;
  }
  // extract id from params
  const AdminID = req.params.id;
  // extract all details needed
  const { AdminPwd } = req.body;
  const { AdminType } = req.body;

  // calling updateSuperAdmin method from SuperAdmin model
  SuperAdmin.updateAdmin(AdminPwd, AdminType, AdminID, (err, result) => {
    // if there is no errorsend the following as result
    if (!err) {
      const output = {
        AdminId: result.insertId,
      };
      console.log(`result ${output.AdminId}`);
      res.status(201).send(result);
    } else if (err.code === 'ER_TRUNCATED_WRONG_VALUE_FOR_FIELD') {
      // if err.code === ER_TRUNCATED_WRONG_VALUE_FOR_FIELD send
      // Inappropriate value as return message
      res.status(406).send('Inappropriate value');
    } else if (err.code === 'ER_BAD_NULL_ERROR') {
      // if err.code === ER_BAD_NULL_ERROR send Null value not allowed as return message
      res.status(400).send('Null value not allowed');
    } else {
      // else if there is a server error return message
      res.status(500).send('Internal Server Error');
    }
  });
});

// delete admin
app.delete('/admin/:id', printDebugInfo, verifyToken, (req, res) => {
  if (req.role == null) {
    res.status(403).send();
    return;
  }

  if (req.role !== 'Super Admin') {
    res.status(403).send();
    return;
  }
  // extract id from params
  const { id } = req.params;

  // calling deleteAdmin method from SuperAdmin model
  SuperAdmin.deleteAdmin(id, (err, result) => {
    if (!err) {
      // result.affectedRows indicates that id to be deleted
      // cannot be found hence send as error message
      if (result.affectedRows === 0) {
        res.status(404).send('Item cannot be deleted');
      } else {
        // else a postitve result
        res.status(200).send(result);
      }
    } else {
      // sever error
      const output = {
        Error: 'Internal sever issues',
      };
      res.status(500).send(output);
    }
  });
});

// add an admin
app.post('/addAdmin', printDebugInfo, verifyToken, (req, res) => {
  if (req.role == null) {
    res.status(403).send();
    return;
  }

  if (req.role !== 'Super Admin') {
    res.status(403).send();
    return;
  }
  // extract all details needed
  const { LastName } = req.body;
  const { FirstName } = req.body;
  const { AdminPwd } = req.body;
  const { AdminEmail } = req.body;
  const { AdminType } = req.body;

  // calling addAdmin method from SuperAdmin model
  SuperAdmin.addAdmin(LastName, FirstName, AdminPwd, AdminEmail, AdminType, (err, result) => {
    if (!err) {
      const output = {
        AdminId: result.insertId,
      };
      console.log(`result ${output.AdminId}`);
      res.status(201).send(result);
    } else if (err.code === 'ER_TRUNCATED_WRONG_VALUE_FOR_FIELD') {
      // if err.code === ER_TRUNCATED_WRONG_VALUE_FOR_FIELD send
      // Inappropriate value as return message
      res.status(406).send('Inappropriate value');
    } else if (err.code === 'ER_BAD_NULL_ERROR') {
      // if err.code === ER_BAD_NULL_ERROR send Null value not allowed as return message
      res.status(400).send('Null value not allowed');
    } else {
      // else if there is a server error return message
      res.status(500).send('Internal Server Error');
    }
  });
});

app.post('/autoBooking', printDebugInfo, verifyToken, async (req, res) => {
  if (req.role == null) {
    res.status(403).send();
    return;
  }

  if (req.role !== 'Super Admin') {
    res.status(403).send();
    return;
  }
  // array that will store all contracts already booked with duplicates
  const contractsAlreadyBooked = [];
  // array that will store all contracts already booked without duplicates
  let contractsAlreadyBookedNoDuplicate = [];
  // array that will store all valid contracts
  const allValidContracts = [];
  // array that will store contracts already booked with duplicates
  const contractsYetToBeBooked = [];

  // // add new booking function that takes two parameters ContractID and ScheduleDate
  function AddBooking(ContractID, ScheduleDate) {
    // invokes addBooking method created at superAdmin file in app.js
    SuperAdmin.addBooking(ContractID, ScheduleDate, (err, result) => {
      if (err) {
        res.status(500).send('Some error');
      }
    });
  }
  // select schedule date based on day of service
  function dateSelection(ContractID, DayOfService) {
    if (DayOfService.includes('Mon')) {
      // find all dates of monday in the month using moment
      const MondaysInMonth = moment().weekdaysInMonth('Monday');

      // loop through the mondays and extract the date
      for (x = 0; x < MondaysInMonth.length; x++) {
        // format date in YYYY-MM-DD format
        ScheduleDate = MondaysInMonth[x].format('YYYY-MM-DD');
        // call addbooking function
        AddBooking(ContractID, ScheduleDate);
      }
    } else if (DayOfService.includes('Tue')) {
      // find all dates of wednesday in the month using moment
      const TuesdaysInMonth = moment().weekdaysInMonth('Tuesday');
      // loop through the mondays and extract the date
      for (x = 0; x < TuesdaysInMonth.length; x++) {
        // format date in YYYY-MM-DD format
        ScheduleDate = TuesdaysInMonth[x].format('YYYY-MM-DD');
        // call addbooking function
        AddBooking(ContractID, ScheduleDate);
      }
    } else if (DayOfService.includes('Wed')) {
      // find all dates of wednesday in the month using moment
      const WednesdayInMonth = moment().weekdaysInMonth('Wednesday');
      // loop through the mondays and extract the date
      for (x = 0; x < WednesdayInMonth.length; x++) {
        // format date in YYYY-MM-DD format
        ScheduleDate = WednesdayInMonth[x].format('YYYY-MM-DD');
        // call addbooking function
        AddBooking(ContractID, ScheduleDate);
      }
    } else if (DayOfService.includes('Thu')) {
      // find all dates of wednesday in the month using moment
      const ThudaysInMonth = moment().weekdaysInMonth('Thursday');
      // loop through the mondays and extract the date
      for (x = 0; x < ThudaysInMonth.length; x++) {
        // format date in YYYY-MM-DD format
        ScheduleDate = ThudaysInMonth[x].format('YYYY-MM-DD');
        // call addbooking function
        AddBooking(ContractID, ScheduleDate);
      }
    } else if (DayOfService.includes('Fri')) {
      // find all dates of wednesday in the month using moment
      const FridayInMonth = moment().weekdaysInMonth('Friday');
      // loop through the mondays and extract the date
      for (x = 0; x < FridayInMonth.length; x++) {
        // format date in YYYY-MM-DD format
        ScheduleDate = FridayInMonth[x].format('YYYY-MM-DD');
        // call addbooking function
        AddBooking(ContractID, ScheduleDate);
      }
    } else if (DayOfService.includes('Sat')) {
      // find all dates of wednesday in the month using moment
      const SaturdaysInMonth = moment().weekdaysInMonth('Saturday');
      // loop through the mondays and extract the date
      for (x = 0; x < SaturdaysInMonth.length; x++) {
        // format date in YYYY-MM-DD format
        ScheduleDate = SaturdaysInMonth[x].format('YYYY-MM-DD');
        // call addbooking function
        AddBooking(ContractID, ScheduleDate);
      }
    } else if (DayOfService.includes('Sun')) {
      // find all dates of wednesday in the month using moment
      const SundaysInMonth = moment().weekdaysInMonth('Sunday');
      // loop through the mondays and extract the date
      for (x = 0; x < SundaysInMonth.length; x++) {
        // format date in YYYY-MM-DD format
        ScheduleDate = SundaysInMonth[x].format('YYYY-MM-DD');
        // call addbooking function
        AddBooking(ContractID, ScheduleDate);
      }
    }
  }
  // getAllValideContracts
  function getAllValidContacts() {
    // gets all valid contracts including the booked ones
    SuperAdmin.getAutoBookingValidContracts((err, result1) => {
      if (!err) {
        // use for loop to extract it's contractId and push it to the array of allValidContracts
        for (x = 0; x < result1.length; x++) {
          const contracId = result1[x].ContractID;
          allValidContracts.push(contracId);
        }
        // for loop to check if contractId that is already booked is part of the valid contracts
        for (y = 0; y < allValidContracts.length; y++) {
          // extracting contract
          const contractId = allValidContracts[y];
          // check if contractId is in the array of already booked contract
          // if it is not push it to the array of contractsYetToBeBooked
          if (!(contractsAlreadyBookedNoDuplicate.includes(contractId))) {
            contractsYetToBeBooked.push(contractId);
            // console.log(`Booked already: ${contractId}`);
          }
        }
        // loop through contractsYetToBeBooked
        for (z = 0; z < contractsYetToBeBooked.length; z++) {
          // get the contractId
          ContractId = contractsYetToBeBooked[z];
          // get all fileds related to the contractId
          SuperAdmin.getAContract(ContractId, (err, result55) => {
            // if no error send result
            if (!err) {
              // extract ContractID
              const { ContractID } = result55[0];
              // extract Package
              const { Package } = result55[0];
              // extract DayOfService
              const { DayOfService } = result55[0];
              // extract DayOfService2
              const { DayOfService2 } = result55[0];

              // call dateSelection and pass ContractID and DayOfService as params
              dateSelection(ContractID, DayOfService);
              // check if Package ==2
              if (Package === 2) {
                // call dateSelection and pass ContractID and DayOfService2 as params
                dateSelection(ContractID, DayOfService2);
              }
            } else {
              // if error send error message
              res.status(500).send('Some error');
            }
          });
        }
        res.status(200).send('done');
      } else {
        res.status(500).send('Some error');
      }
    });
  }
  // getAllBookingForAutoBookingFunction
  SuperAdmin.getAllBookingForAutoBookingFunc((err, result) => {
    if (!err) {
      // checks if there is booking made for a contract already
      for (i = 0; i < result.length; i++) {
        // get value of current year
        const currentYear = moment().year();
        // get value of current month
        const currentMonth = moment().month();
        // get scheduleDateOfBooking
        const scheduleDate = moment(result[i].ScheduleDate);
        // get value of scheduleDate month
        const scheduleMonth = scheduleDate.month();
        // get value of scheduleDate year
        const scheduleYear = scheduleDate.year();
        // get booking id
        const bookingId = result[i].BookingID;
        // get contract id
        const contractId = result[i].ContractId;
        // check if currentYear equals to scheduleYear and if
        // current month equals to scheduleMonth if yes push the contract id as already booked
        if ((currentYear === scheduleYear) && (currentMonth === scheduleMonth)) {
          contractsAlreadyBooked.push(contractId);
        }
      }
      // remove duplicate bookings
      contractsAlreadyBookedNoDuplicate = [...new Set(contractsAlreadyBooked)];
      // call getAllValidContacts()
      getAllValidContacts();
    } else {
      res.status(500).send('Some error');
    }
  });
});

app.post('/autoBookingNextMonth', printDebugInfo, verifyToken, async (req, res) => {
  if (req.role == null) {
    res.status(403).send();
    return;
  }
  if (req.role !== 'Super Admin') {
    res.status(403).send();
    return;
  }
  // array that will store all contracts already booked with duplicates
  const contractsAlreadyBooked = [];
  // array that will store all contracts already booked without duplicates
  let contractsAlreadyBookedNoDuplicate = [];
  // array that will store all valid contracts
  const allValidContracts = [];
  // array that will store contracts already booked with duplicates
  const contractsYetToBeBooked = [];
  // // add new booking function that takes two parameters ContractID and ScheduleDate
  function AddBooking(ContractID, ScheduleDate) {
    // invokes addBooking method created at superAdmin file in app.js
    SuperAdmin.addBooking(ContractID, ScheduleDate, (err, result) => {
      if (err) {
        res.status(500).send('Some error');
      }
    });
  }
  // select schedule date based on day of service
  function dateSelection(ContractID, DayOfService) {
    if (DayOfService.includes('Mon')) {
      // find all dates of monday in the month using moment
      const MondaysInMonth = moment().add(1, 'months').weekdaysInMonth('Monday');
      // loop through the mondays and extract the date
      for (x = 0; x < MondaysInMonth.length; x++) {
        // format date in YYYY-MM-DD format
        ScheduleDate = MondaysInMonth[x].format('YYYY-MM-DD');
        // call addbooking function
        AddBooking(ContractID, ScheduleDate);
      }
    } else if (DayOfService.includes('Tue')) {
      // find all dates of wednesday in the month using moment
      const TuesdaysInMonth = moment().add(1, 'months').weekdaysInMonth('Tuesday');
      // loop through the mondays and extract the date
      for (x = 0; x < TuesdaysInMonth.length; x++) {
        // format date in YYYY-MM-DD format
        ScheduleDate = TuesdaysInMonth[x].format('YYYY-MM-DD');
        // call addbooking function
        AddBooking(ContractID, ScheduleDate);
      }
    } else if (DayOfService.includes('Wed')) {
      // find all dates of wednesday in the month using moment
      const WednesdayInMonth = moment().add(1, 'months').weekdaysInMonth('Wednesday');
      // loop through the mondays and extract the date
      for (x = 0; x < WednesdayInMonth.length; x++) {
        // format date in YYYY-MM-DD format
        ScheduleDate = WednesdayInMonth[x].format('YYYY-MM-DD');
        // call addbooking function
        AddBooking(ContractID, ScheduleDate);
      }
    } else if (DayOfService.includes('Thu')) {
      // find all dates of wednesday in the month using moment
      const ThudaysInMonth = moment().add(1, 'months').weekdaysInMonth('Thursday');
      // loop through the mondays and extract the date
      for (x = 0; x < ThudaysInMonth.length; x++) {
        // format date in YYYY-MM-DD format
        ScheduleDate = ThudaysInMonth[x].format('YYYY-MM-DD');
        // call addbooking function
        AddBooking(ContractID, ScheduleDate);
      }
    } else if (DayOfService.includes('Fri')) {
      // find all dates of wednesday in the month using moment
      const FridayInMonth = moment().add(1, 'months').weekdaysInMonth('Friday');
      // loop through the mondays and extract the date
      for (x = 0; x < FridayInMonth.length; x++) {
        // format date in YYYY-MM-DD format
        ScheduleDate = FridayInMonth[x].format('YYYY-MM-DD');
        // call addbooking function
        AddBooking(ContractID, ScheduleDate);
      }
    } else if (DayOfService.includes('Sat')) {
      // find all dates of wednesday in the month using moment
      const SaturdaysInMonth = moment().add(1, 'months').weekdaysInMonth('Saturday');
      // loop through the mondays and extract the date
      for (x = 0; x < SaturdaysInMonth.length; x++) {
        // format date in YYYY-MM-DD format
        ScheduleDate = SaturdaysInMonth[x].format('YYYY-MM-DD');
        // call addbooking function
        AddBooking(ContractID, ScheduleDate);
      }
    } else if (DayOfService.includes('Sun')) {
      // find all dates of wednesday in the month using moment
      const SundaysInMonth = moment().add(1, 'months').weekdaysInMonth('Sunday');
      // loop through the mondays and extract the date
      for (x = 0; x < SundaysInMonth.length; x++) {
        // format date in YYYY-MM-DD format
        ScheduleDate = SundaysInMonth[x].format('YYYY-MM-DD');
        // call addbooking function
        AddBooking(ContractID, ScheduleDate);
      }
    }
  }
  // getAllValideContracts
  function getAllValidContacts() {
    // gets all valid contracts including the booked ones
    SuperAdmin.getAutoBookingValidContracts((err, result1) => {
      if (!err) {
        // use for loop to extract it's contractId and push it to the array of allValidContracts
        for (x = 0; x < result1.length; x++) {
          const contracId = result1[x].ContractID;
          allValidContracts.push(contracId);
        }
        // for loop to check if contractId that is already booked is part of the valid contracts
        for (y = 0; y < allValidContracts.length; y++) {
          // extracting contract
          const contractId = allValidContracts[y];
          // check if contractId is in the array of already booked contract
          // if it is not push it to the array of contractsYetToBeBooked
          if (!(contractsAlreadyBookedNoDuplicate.includes(contractId))) {
            contractsYetToBeBooked.push(contractId);
            // console.log(`Booked already: ${contractId}`);
          }
        }
        // loop through contractsYetToBeBooked
        for (z = 0; z < contractsYetToBeBooked.length; z++) {
          // get the contractId
          ContractId = contractsYetToBeBooked[z];
          // get all fileds related to the contractId
          SuperAdmin.getAContract(ContractId, (err, result55) => {
            // if no error send result
            if (!err) {
              // extract ContractID
              const { ContractID } = result55[0];
              // extract Package
              const { Package } = result55[0];
              // extract DayOfService
              const { DayOfService } = result55[0];
              // extract DayOfService2
              const { DayOfService2 } = result55[0];

              // call dateSelection and pass ContractID and DayOfService as params
              dateSelection(ContractID, DayOfService);
              // check if Package ==2
              if (Package === 2) {
                // call dateSelection and pass ContractID and DayOfService2 as params
                dateSelection(ContractID, DayOfService2);
              }
            } else {
              // if error send error message
              res.status(500).send('Some error');
            }
          });
        }
        res.status(200).send('done');
      } else {
        res.status(500).send('Some error');
      }
    });
  }
  // getAllBookingForAutoBookingFunction
  SuperAdmin.getAllBookingForAutoBookingFunc((err, result) => {
    if (!err) {
      // checks if there is booking made for a contract already
      for (i = 0; i < result.length; i++) {
        // get value of current year
        const currentYear = moment().year();
        // get value of current month
        const nextMonth = moment().month() + 1;

        // get scheduleDateOfBooking
        const scheduleDate = moment(result[i].ScheduleDate);
        // get value of scheduleDate month
        const scheduleMonth = scheduleDate.month();
        // get value of scheduleDate year
        const scheduleYear = scheduleDate.year();
        // get booking id
        const bookingId = result[i].BookingID;
        // get contract id
        const contractId = result[i].ContractId;
        // check if currentYear equals to scheduleYear and if
        // current month equals to scheduleMonth if yes push the contract id as already booked
        if ((currentYear === scheduleYear) && (nextMonth === scheduleMonth)) {
          contractsAlreadyBooked.push(contractId);
        }
      }
      // remove duplicate bookings
      contractsAlreadyBookedNoDuplicate = [...new Set(contractsAlreadyBooked)];
      // call getAllValidContacts()
      getAllValidContacts();
    } else {
      res.status(500).send('Some error');
    }
  });
});

// ====================== InActive Customer ======================
// Get admin profile by AdminID
app.get('/inactiveCustomers', printDebugInfo, verifyToken, async (req, res) => {
  if (req.role == null) {
    res.status(403).send();
    return;
  }
  // extract id from params
  const adminID = req.params.id;

  // calling getAdminById method from Admin model
  Admin.getAllInActiveCustomer((err, result) => {
    if (!err) {
      for (i = 0; i < result.length; i++) {
        const CustomerId = result[i].CustomerID;
        // calling updateSuperAdmin method from SuperAdmin model
        Admin.updateCustomerStatusInactive(CustomerId, (err, result) => {
          // if there is no errorsend the following as result

          if (err) {
            if (err.code === 'ER_TRUNCATED_WRONG_VALUE_FOR_FIELD') {
              // if err.code === ER_TRUNCATED_WRONG_VALUE_FOR_FIELD send
              // Inappropriate value as return message
              res.status(406).send('Inappropriate value');
            } else if (err.code === 'ER_BAD_NULL_ERROR') {
              // if err.code === ER_BAD_NULL_ERROR send Null value not allowed as return message
              res.status(400).send('Null value not allowed');
            } else {
              // else if there is a server error return message
              res.status(500).send('Internal Server Error');
            }
          }
        });
      }

      res.status(200).send(result);
    } else {
      // sending output as error message if there is any server issues
      const output = {
        Error: 'Internal sever issues',
      };
      res.status(500).send(output);
    }
  });
});

// get Contracts per page
app.get('/inactiveCustomers/:pageNumber', printDebugInfo, verifyToken, async (req, res) => {
  if (req.role == null) {
    res.status(403).send();
    return;
  }
  // extract pageNumber from parameter
  const { pageNumber } = req.params;

  // calling pageContract method from admin model
  Admin.pageInactiveCustomers(pageNumber, (err, result) => {
    // if no error send result
    if (!err) {
      res.status(200).send(result);
    } else {
      // if error send error message
      const output = {
        Error: 'Internal sever issues',
      };
      res.status(500).send(output);
    }
  });
});

app.put('/activateCustomer/:id', printDebugInfo, verifyToken, (req, res) => {
  // extract id from params
  if (req.role == null) {
    res.status(403).send();
    return;
  }
  const CustomerId = req.params.id;

  // calling updateSuperAdmin method from SuperAdmin model
  Admin.updateCustomerStatusActive(CustomerId, (err, result) => {
    // if there is no errorsend the following as result
    if (!err) {
      res.status(201).send(result);
    } else if (err.code === 'ER_TRUNCATED_WRONG_VALUE_FOR_FIELD') {
      // if err.code === ER_TRUNCATED_WRONG_VALUE_FOR_FIELD send
      // Inappropriate value as return message
      res.status(406).send('Inappropriate value');
    } else if (err.code === 'ER_BAD_NULL_ERROR') {
      // if err.code === ER_BAD_NULL_ERROR send Null value not allowed as return message
      res.status(400).send('Null value not allowed');
    } else {
      // else if there is a server error return message
      res.status(500).send('Internal Server Error');
    }
  });
});

// delete admin
app.delete('/inActiveCustomer/:id', printDebugInfo, verifyToken, (req, res) => {
  if (req.role == null) {
    res.status(403).send();
    return;
  }
  // extract id from params
  const customerId = req.params.id;

  // calling deleteAdmin method from SuperAdmin model
  Admin.deleteInactiveCustomer(customerId, (req, result) => {
    if (!err) {
      // result.affectedRows indicates that id to be deleted
      // cannot be found hence send as error message
      if (result.affectedRows === 0) {
        res.status(404).send('Item cannot be deleted');
      } else {
        // else a postitve result
        res.status(200).send(result);
      }
    } else {
      // sever error
      const output = {
        Error: 'Internal sever issues',
      };
      res.status(500).send(output);
    }
  });
});

app.put('/updateBooking/:bookingIDs', printDebugInfo, verifyToken, (req, res) => {
  if (req.role == null) {
    res.status(403).send();
    return;
  }
  // extract id from params
  const BookingID = req.params.bookingIDs;
  // extract all details needed
  const { ScheduleDate } = req.body;
  console.log('Im HERE');
  // check if class pricing is float value and execute code

  // calling updateClass method from admin model
  Admin.updateBooking(ScheduleDate, BookingID, (err, result) => {
    // if there is no errorsend the following as result
    if (!err) {
      res.status(201).send(result);
    } else if (err.code === 'ER_TRUNCATED_WRONG_VALUE_FOR_FIELD') {
      // if err.code === ER_TRUNCATED_WRONG_VALUE_FOR_FIELD
      // send Inappropriate value as return message
      res.status(406).send('Inappropriate value');
    } else if (err.code === 'ER_BAD_NULL_ERROR') {
      // if err.code === ER_BAD_NULL_ERROR send Null value not allowed as return message
      res.status(400).send('Null value not allowed');
    } else {
      // else if there is a server error return message
      res.status(500).send('Internal Server Error');
    }
  });
});

app.get('/oneContract/:contractId', printDebugInfo, verifyToken, async (req, res) => {
  if (req.role == null) {
    res.status(403).send();
    return;
  }
  // extract contractId from parameter
  const { contractId } = req.params;

  // calling getAContractByID method from admin model line 1349
  Admin.getAContractByID(contractId, (err, result) => {
    // if no error send result
    if (!err) {
      res.status(200).send(result);
    } else {
    // if error send error message
      const output = {
        Error: 'Internal sever issues',
      };
      res.status(500).send(output);
    }
  });
});

app.put('/updateContract/:contractId', printDebugInfo, verifyToken, (req, res) => {
  if (req.role == null) {
    res.status(403).send();
    return;
  }
  // extract contractid from params
  const { contractId } = req.params;
  // extract all details needed
  const { dayOfService1 } = req.body;
  const { dayOfService2 } = req.body;
  const { estimatedPricing } = req.body;

  // calling editContractInfo method from admin model
  // eslint-disable-next-line max-len
  Admin.editContractInfo(dayOfService1, dayOfService2, estimatedPricing, contractId, (err, result) => {
    // Send affected rows if no error
    if (!err) {
      console.log(`result ${result.affectedRows}`);
      res.status(202).send(result);
    } else {
      res.status(500).send('Internal Server Error');
    }
  });
});

app.put('/customer/password/:id', printDebugInfo, verifyTokenCustomer, async (req, res) => {
  if (req.id == null) {
    res.status(403).send();
    return;
  }
  // extract id from params
  const customerId = req.params.id;
  const { currentPassword } = req.body;
  // calling checkCustomerPassword method from Customer model
  Customer.checkCustomerPassword(customerId, currentPassword, (err, result) => {
    if (!err) {
      // output
      res.status(200).send(result);
    } else if (err.message === 'No result') {
      // if customer id is not found detect and return error message
      const output = {
        Error: 'Wrong password',
      };
      res.status(404).send(output);
    } else {
      // sending output as error message if there is any server issues
      const output = {
        Error: 'Internal sever issues',
      };
      res.status(500).send(output);
    }
  });
});

app.put('/customer/editPassword/:id', printDebugInfo, verifyTokenCustomer, async (req, res) => {
  console.log(req.id);
  if (req.id == null) {
    res.status(403).send();
    return;
  }
  // extract id from params
  const customerId = req.params.id;
  const { confirmPassword } = req.body;
  // calling updateCustomerPassword method from Customer model
  Customer.updateCustomerPassword(confirmPassword, customerId, (err, result) => {
    if (!err) {
      // if Customer id is not found detect and return error message
      if (result.length === 0) {
        const output = {
          Error: 'Id not found',
        };
        res.status(404).send(output);
      } else {
        // output
        res.status(200).send(result);
      }
    } else {
      // sending output as error message if there is any server issues
      const output = {
        Error: 'Internal sever issues',
      };
      res.status(500).send(output);
    }
  });
});
// ====================== Module Exports ======================
module.exports = app;
