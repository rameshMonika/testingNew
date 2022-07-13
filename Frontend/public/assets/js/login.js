/* eslint-disable linebreak-style */
/* eslint-disable no-use-before-define */
/* eslint-disable no-plusplus */
/* eslint-disable no-console */
/* eslint-disable no-shadow */
/* eslint-disable no-undef */

// const res = require("express/lib/response");

const frontEndUrl = 'http://localhost:3001';
const backEndUrl = 'http://localhost:5000';
// const frontEndUrl = 'https://moc-fa.herokuapp.com';
// const backEndUrl = 'https://moc-ba.herokuapp.com';

$(document).ready(() => {
  const togglePassword = document.querySelector('#togglePassword');
  const password = document.querySelector('#pwdInput');

  togglePassword.addEventListener('click', function () {
    // toggle the type attribute
    const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
    password.setAttribute('type', type);
    // toggle the eye slash icon
    this.classList.toggle('fa-eye-slash');
  });

  // Login
  $('#Login').click(() => {
    // data extraction
    const emails = $('#emailInput').val();
    const pwd = $('#pwdInput').val();

    // data compilation
    const info = {
      email: emails,
      password: pwd,
    };
    // call web service endpoint
    $.ajax({
      url: `${backEndUrl}/login`,
      type: 'POST',
      data: JSON.stringify(info),
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',

      success(data) {
        if (data != null) {
          if (data.CustomerID != null) {
            localStorage.setItem('token', JSON.stringify(data.token));
            localStorage.setItem('customerID', JSON.stringify(data.CustomerID));
            window.location.replace(`${frontEndUrl}/customer/profile`);
          } else if (data.AdminType === 'Admin') {
            localStorage.setItem('AdminID', JSON.stringify(data.AdminID));
            localStorage.setItem('adminType', JSON.stringify(data.AdminType));
            localStorage.setItem('token', JSON.stringify(data.token));
            window.location.replace(`${frontEndUrl}/admin/dashboard`);
          } else {
            localStorage.setItem('AdminID', JSON.stringify(data.AdminID));
            localStorage.setItem('adminType', JSON.stringify(data.AdminType));
            localStorage.setItem('token', JSON.stringify(data.token));
            window.location.replace(`${frontEndUrl}/admin/dashboard`);
          }
        }
      },
      error(xhr) {
        new Noty({
          timeout: '5000',
          type: 'error',
          layout: 'topCenter',
          theme: 'sunset',
          text: xhr.responseText,
        }).show();
      },
    });
    return false;
  });
});
