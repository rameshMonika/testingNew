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
          const userLink = data.link;
          const name = data.firstName;
          console.log('Data');
          console.log(data);
          Email.send({
            Host: 'smtp.elasticemail.com',
            Username: 'farhanmashudi@gmail.com',
            Password: '2F86A2CBC29B22A70B627E953FB42FD7CBB1',
            To: emails,
            From: 'farhanmashudi@gmail.com',
            Subject: 'Reset Password: MOC',
            Body: `
            <h1>Hi ${name},</h1>
            <h2>Your link will expire in 15 min* </h2>
            <p> To reset your Password, Please <a href='${userLink}' class="nav-item nav-link">Click here</a> </p>
            <p> Or copy and paste the URL below into your browser: </p>
            <p> ${userLink}</p>
            `,
          }).then(
            new Noty({
              timeout: '5000',
              type: 'success',
              layout: 'topCenter',
              theme: 'sunset',
              text: 'Email Sent',
            }).show(),
          );
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
