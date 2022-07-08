/* eslint-disable linebreak-style */
/* eslint-disable no-plusplus */
/* eslint-disable no-console */
/* eslint-disable no-undef */
/* eslint-disable prefer-regex-literals */
/* eslint-disable no-lonely-if */
// const res = require("express/lib/response");
/* eslint-disable no-useless-escape */

const frontEndUrl = 'http://localhost:3001';
const backEndUrl = 'http://localhost:5000';
// const frontEndUrl = 'https://moc-fa.herokuapp.com';
// const backEndUrl = 'https://moc-ba.herokuapp.com';

const togglePassword = document.querySelector('#togglePassword');
  const password = document.querySelector('#customerPasswordInput');

  togglePassword.addEventListener('click', function (e) {
    // toggle the type attribute
    const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
    password.setAttribute('type', type);
    // toggle the eye slash icon
    this.classList.toggle('fa-eye-slash');
});
$(document).ready(() => {
  // When sign up button is clicked
  $('#SignUp').click(() => {
    // == data extraction ==
    // get customer email from html
    const customerEmail = $('#customerEmailInput').val();
    // get customer password from html
    const customerPassword = $('#customerPasswordInput').val();
    // get customer first name from html
    const customerFirstName = $('#firstNameInput').val();
    // get customer last name from html
    const customerLastName = $('#lastNameInput').val();
    // get customer number from html
    const customerNumber = $('#numberInput').val();
    // get customer address from html
    const customerAddress = $('#addressInput').val();
    // get customer postal code from html
    const customerPostalCode = $('#postalCodeInput').val();
    //  pattern for email
    const emailPattern = new RegExp('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$');
    //  pattern for pasword
    const pwdPattern = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})');
    // pattern for postal code
    const postalCodePattern = new RegExp('[0-9]{6}');

    // check if the value is empty
    if (customerFirstName === '' && customerAddress === '' && customerEmail === '' && customerPassword === '' && customerNumber === '' && customerPostalCode === '') {
      // show error
      new Noty({
        timeout: '5000',
        type: 'error',
        layout: 'topCenter',
        theme: 'sunset',
        text: 'Please fill up the particular',
      }).show();
    } else {
      // check if email and password match with the pattern
      if (emailPattern.test(customerEmail) && pwdPattern.test(customerPassword)) {
        // check if postal code match with the pattern
        if (postalCodePattern.test(customerPostalCode)) {
          // compile all the infomation together
          const info = {
            FirstName: customerFirstName,
            LastName: customerLastName,
            Password: customerPassword,
            Email: customerEmail,
            Address: customerAddress,
            PhoneNumber: customerNumber,
            PostalCode: customerPostalCode,

          };
          // call web service endpoint
          $.ajax({
            url: `${backEndUrl}/registerCustomer`,
            type: 'POST',
            data: JSON.stringify(info),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success(data) {
              if (data != null) {
                // no error move the user to login page
                window.location.replace(`${frontEndUrl}/login`);
              } else {
                // error
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
                text: 'Invalid Input',
              }).show();
            },
          });
        } else {
          // error if postal code doesn't match with pattern
          new Noty({
            timeout: '5000',
            type: 'error',
            layout: 'topCenter',
            theme: 'sunset',
            text: 'Please use valid Postal code ',
          }).show();
        }
      } else {
        // error if password doesn't match with pattern
        new Noty({
          timeout: '5000',
          type: 'error',
          layout: 'topCenter',
          theme: 'sunset',
          text: 'Please use valid Email or Please use more Secure password. Ensure that it is 8 character, 1 Caps, 1 small and 1 Special character ',
        }).show();
      }
    }
    // data compilation

    return false;
  });
});
