/* eslint-disable linebreak-style */
/* eslint-disable no-use-before-define */
/* eslint-disable no-plusplus */
/* eslint-disable no-console */
/* eslint-disable no-shadow */
/* eslint-disable no-undef */

// const res = require("express/lib/response");
const backEndUrl = 'http://localhost:5000';
// const frontEndUrl = 'https://moc-fa.herokuapp.com';
// const backEndUrl = 'https://moc-ba.herokuapp.com';

$(document).ready(() => {
  // Login
  $('#confirmEmail').click(() => {
    // data extraction
    const emails = $('#emailInput').val();

    // data compilation
    const info = {
      email: emails,
    };
    // call web service endpoint
    $.ajax({
      url: `${backEndUrl}/forgetPassword`,
      type: 'POST',
      data: JSON.stringify(info),
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success(data) {
        if (data != null) {
          console.log('Data');
          console.log(data);
          new Noty({
            timeout: '5000',
            type: 'success',
            layout: 'topCenter',
            theme: 'sunset',
            text: 'Email Sent',
          }).show();
        } else {
          console.log('Error');
        }
      },
      error(xhr, textStatus, errorThrown) {
        console.log('Frontend error');
        console.log('Error in Operation');
        console.log(`XHR: ${JSON.stringify(xhr)}`);
        console.log(`Textstatus: ${textStatus}`);
        console.log(`Errorthorwn${errorThrown}`);
        new Noty({
          timeout: '5000',
          type: 'error',
          layout: 'topCenter',
          theme: 'sunset',
          text: 'Please check your Email',
        }).show();
      },
    });
    return false;
  });
});
