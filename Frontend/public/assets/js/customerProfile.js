/* eslint-disable linebreak-style */
/* eslint-disable no-plusplus */
/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

const frontEndUrl = 'http://localhost:3001';
const backEndUrl = 'http://localhost:5000';
// const frontEndUrl = 'https://moc-fa.herokuapp.com';
// const backEndUrl = 'https://moc-ba.herokuapp.com';
const tmpToken = JSON.parse(localStorage.getItem('token'));
const tempCustomerID = JSON.parse(localStorage.getItem('customerID'));
if (tmpToken === null || tempCustomerID === null) {
  window.location.replace(`${frontEndUrl}/unAuthorize`);
}
function loadProfileDetails() {
  const customerId = localStorage.getItem('customerID');
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/user/customer/${customerId}`,
    type: 'GET',
    contentType: 'application/json; charset=utf-8',

    success(data) {
      console.log('-------response data------');
      console.log(data.Email);
      console.log(`LENGTH OF DATA:${data.length}`);

      const custDetail = data[0];
      $('#firstName').val(custDetail.FirstName);
      $('#lastName').val(custDetail.LastName);
      $('#address').val(custDetail.Address);
      $('#postal').val(custDetail.PostalCode);
      $('#phone').val(custDetail.PhoneNumber);
      $('#email').val(custDetail.Email);
    },

    error(xhr, textStatus, errorThrown) {
      console.log('Error in Operation');

      console.log(xhr);
      console.log(textStatus);
      console.log(errorThrown);

      console.log(xhr.responseText);
      console.log(xhr.status);
    },
  });
}

$('#updateProfile').click(() => {
  // data extraction
  const firstName = $('#firstName').val();
  const lastName = $('#lastName').val();
  const address = $('#address').val();
  const postal = $('#postal').val();
  const phoneNumber = $('#phone').val();
  const email = $('#email').val();
  const customerId = localStorage.getItem('customerID');
  // data compilation
  const info = {
    firstName,
    lastName,
    address,
    postal,
    phoneNumber,
    email,
  };

  // call web service endpoint
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/update/customer/${customerId}`,
    type: 'PUT',
    data: JSON.stringify(info),
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success(data) {
      if (data != null) {
        new Noty({
          timeout: '5000',
          type: 'success',
          layout: 'topCenter',
          theme: 'sunset',
          text: 'Added successfully',
        }).show();
      } else {
        console.log('Error');
      }
    },
    error(xhr, textStatus, errorThrown) {
      console.log('Error in Operation');
      console.log(`XHR: ${JSON.stringify(xhr)}`);
      console.log(`Textstatus: ${textStatus}`);
      console.log(`Errorthorwn${errorThrown}`);
      new Noty({
        timeout: '5000',
        type: 'error',
        layout: 'topCenter',
        theme: 'sunset',
        text: 'Please check your the date and ID',
      }).show();
    },
  });
});
$(document).ready(() => {
  const queryParams = new URLSearchParams(window.location.search);
  console.log('--------Query Params----------');
  console.log(`Query Param (source): ${window.location.search}`);
  console.log(`Query Param (extraction): ${queryParams}`);

  loadProfileDetails();
});
