/* eslint-disable linebreak-style */
/* eslint-disable no-console */
const express = require('express');
// eslint-disable-next-line import/no-extraneous-dependencies
const serveStatic = require('serve-static');

// set hostname and portnumber
const hostname = '0.0.0.0';
const port = process.env.PORT || 3001;

const app = express();

app.use((req, res, next) => {
  console.log(req.url);
  console.log(req.method);
  console.log(req.path);
  console.log(req.query.id);

  if (req.method !== 'GET') {
    res.type('.html');
    const msg = '<html><body>This server only serves web pages with GET!</body></html>';
    res.end(msg);
  } else {
    next();
  }
});

//= ======================================================
//                   User
//= ======================================================

// go to homepage
app.get('/', (req, res) => {
  res.sendFile('/public/assets/html/homepage.html', { root: __dirname });
});

app.get('/academy', (req, res) => {
  res.sendFile('/public/assets/html/academy.html', { root: __dirname });
});

// go to homepage
app.get('/homepage', (req, res) => {
  res.sendFile('/public/assets/html/homepage.html', { root: __dirname });
});

// go to login
app.get('/login', (req, res) => {
  res.sendFile('/public/assets/html/login.html', { root: __dirname });
});
// go to Register
app.get('/register', (req, res) => {
  res.sendFile('/public/assets/html/customerRegister.html', { root: __dirname });
});
// go to forget password
app.get('/forgetPassword', (req, res) => {
  res.sendFile('/public/assets/html/forgetPassword.html', { root: __dirname });
});
app.get('/resetPassword', (req, res) => {
  res.sendFile('/public/assets/html/resetPassword.html', { root: __dirname });
});
// go to Register
app.get('/service', (req, res) => {
  res.sendFile('/public/assets/html/vSerivce.html', { root: __dirname });
});

// go to Register
app.get('/contractService', (req, res) => {
  res.sendFile('/public/assets/html/viewContractRates.html', { root: __dirname });
});
// Go to Gallery
app.get('/gallery', (req, res) => {
  res.sendFile('/public/assets/html/gallery.html', { root: __dirname });
});
// Go to Story
app.get('/story', (req, res) => {
  res.sendFile('/public/assets/html/story.html', { root: __dirname });
});
// Go to contact
app.get('/contact', (req, res) => {
  res.sendFile('/public/assets/html/contact.html', { root: __dirname });
});
//= ======================================================
//                   Admin
//= ======================================================
app.get('/admin/inactiveCustomer', (req, res) => {
  res.sendFile('/public/assets/html/adminViewInactiveCustomer.html', { root: __dirname });
});

// go to admin Employee
app.get('/admin/employee', (req, res) => {
  res.sendFile('/public/assets/html/adminEmployee.html', { root: __dirname });
});

// go to admin Schedule
app.get('/admin/schedule', (req, res) => {
  res.sendFile('/public/assets/html/adminSchedule.html', { root: __dirname });
});
// go to booking
app.get('/admin/booking', (req, res) => {
  res.sendFile('/public/assets/html/adminBooking.html', { root: __dirname });
});
// go to AssignEmployeePage
app.get('/admin/assign', (req, res) => {
  res.sendFile('/public/assets/html/adminAssignEmployee.html', { root: __dirname });
});

// go to admin Customer
app.get('/admin/customer', (req, res) => {
  res.sendFile('/public/assets/html/adminCustomer.html', { root: __dirname });
});

// go to admin Cancel Booking
app.get('/admin/cancelBooking', (req, res) => {
  res.sendFile('/public/assets/html/adminCancelBooking.html', { root: __dirname });
});

// go to admin Cancel Booking
app.get('/admin/pricing', (req, res) => {
  res.sendFile('/public/assets/html/adminPricing.html', { root: __dirname });
});

// go to admin Profile
app.get('/admin/profile', (req, res) => {
  res.sendFile('/public/assets/html/adminProfile.html', { root: __dirname });
});

app.get('/admin/contract', (req, res) => {
  res.sendFile('/public/assets/html/adminViewContract.html', { root: __dirname });
});

// go to admin dashboard
app.get('/admin/dashboard', (req, res) => {
  res.sendFile('/public/assets/html/adminDashboard.html', { root: __dirname });
});

// go to admin dashboard
app.get('/admin/cancelAbnormality', (req, res) => {
  res.sendFile('/public/assets/html/adminCancelAbnormalityMain.html', { root: __dirname });
});

// go to admin contract abnormality
app.get('/user/verified/', (req, res) => {
  res.sendFile('/public/assets/html/verifyEmail.html', { root: __dirname });
});

// go to admin contract abnormality
app.get('/admin/abnormality/contract', (req, res) => {
  res.sendFile('/public/assets/html/AbnCustomerContracts.html', { root: __dirname });
});

// go to admin contract abnormality
app.get('/abnormality/contract', (req, res) => {
  res.sendFile('/public/assets/html/contractAbnormality.html', { root: __dirname });
});

// go to admin contract abnormality
app.get('/admin/abnormality', (req, res) => {
  res.sendFile('/public/assets/html/adminAbnormalityDashboard.html', { root: __dirname });
});

//= ======================================================
//                   Customer
//= ======================================================
// go to  Booking
app.get('/customer/booking', (req, res) => {
  res.sendFile('/public/assets/html/customerBooking.html', { root: __dirname });
});

// go to customer profile
app.get('/customer/profile', (req, res) => {
  res.sendFile('/public/assets/html/customerProfile.html', { root: __dirname });
});

// go to customer booking history
app.get('/customer/history', (req, res) => {
  res.sendFile('/public/assets/html/viewBooking.html', { root: __dirname });
});

// List of possible Employees
app.get('/customer/helpers', (req, res) => {
  res.sendFile('/public/assets/html/customerHelpers.html', { root: __dirname });
});

// Confirmation Booking Card
app.get('/customer/confirm', (req, res) => {
  res.sendFile('/public/assets/html/customerConfirmation.html', { root: __dirname });
});
// Confirmation Booking Card
app.get('/unAuthorize', (req, res) => {
  res.sendFile('/public/assets/html/unauthorized.html', { root: __dirname });
});
// Customer Change Password
app.get('/customer/change', (req, res) => {
  res.sendFile('/public/assets/html/customerPassword.html', { root: __dirname });
});
//= ======================================================
//                   Super Admin
//= ======================================================
// go to admin management
app.get('/superadmin/admin', (req, res) => {
  res.sendFile('/public/assets/html/adminManagement.html', { root: __dirname });
});

app.get('/admin/superBooking', (req, res) => {
  res.sendFile('/public/assets/html/superAdminBooking.html', { root: __dirname });
});
app.get('/admin/adminAbnormalityDashboard', (req, res) => {
  res.sendFile('/public/assets/html/adminAbnormalityDashboard.html', { root: __dirname });
});

// retrieve from public folder
app.use(serveStatic(`${__dirname}/public`));

// listen to hostname and port

app.listen(port, hostname, () => {
  console.log(`Server hosted at http://${hostname}:${port}`);
});
