/* eslint-disable linebreak-style */
/* eslint-disable no-undef */

const frontEndUrl = 'http://localhost:3001';
const backEndUrl = 'http://localhost:5000';
// const frontEndUrl = 'https://moc-fa.herokuapp.com';
// const backEndUrl = 'https://moc-ba.herokuapp.com';
const tempAdminID = JSON.parse(localStorage.getItem('AdminID'));
const tmpToken = JSON.parse(localStorage.getItem('token'));
if (tmpToken === null || tempAdminID === null) {
  window.location.replace(`${frontEndUrl}/unAuthorize`);
}

function storeContractAbnormality() {
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/abnormality/contracts/checks`,
    type: 'GET',
    contentType: 'application/json; charset=utf-8',

    success(data) {
      console.log(data);
      window.location.replace(`${frontEndUrl}/admin/abnormality/contract`);
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

$(document).ready(() => {
  // list contract abnormalities button
  $('#contractAbnormality').click(() => {
    storeContractAbnormality();
  });
});
