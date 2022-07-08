/* eslint-disable linebreak-style */
/* eslint-disable no-shadow */
/* eslint-disable no-plusplus */
/* eslint-disable no-undef */
/* eslint-disable no-console */
/* eslint-disable no-nested-ternary */

const frontEndUrl = 'http://localhost:3001';
const backEndUrl = 'http://localhost:5000';
// const frontEndUrl = 'https://moc-fa.herokuapp.com';
// const backEndUrl = 'https://moc-ba.herokuapp.com';
const tmpToken = JSON.parse(localStorage.getItem('token'));
const tempAdminID = JSON.parse(localStorage.getItem('AdminID'));
if (tmpToken === null || tempAdminID === null) {
  window.location.replace(`${frontEndUrl}/unAuthorize`);
}

// Create a new card for Contracts
function createRow(cardInfo) {
  // cardInfo data is place in each respective place
  const card = `
      <tr>
  
        <td>${cardInfo.CustomerID}</td>
        <td>${cardInfo.FirstName}</td>
        <td> ${cardInfo.LastName}</td>
        <td>${cardInfo.PhoneNumber}</td>
        <td><button onClick="deleteCustomer(${cardInfo.CustomerID})" class="btn btn-danger">Delete</button></td>
        <td><button onClick="activateUser(${cardInfo.CustomerID})" class="btn btn-success">Activate</button></td>
       
      </tr>
      `;
  return card;
}
// Create pagination numbering
function pageBtnCreate(totalNumberOfPages) {
  // Remove any pagination
  $('#pagination').html('');
  // for loop to the button based on totalNumberOfPages
  for (i = 1; i <= totalNumberOfPages; i++) {
    divPaginBtn = `<button type="button" onClick="loadAllContractByLimit(${i})">${i}</button>`;
    $('#pagination').append(divPaginBtn);
  }
}
// Load all contracts to allow for pagination numbering
function loadAllInactiveCustomers() {
  // call the web service endpoint
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/inactiveCustomers`,
    type: 'GET',
    contentType: 'application/json; charset=utf-8',
    // when successful, divide the number of result by 6 to determine
    // number of pages needed
    success(data) {
      const totalNumberOfPages = Math.ceil(data.length / 6);
      pageBtnCreate(totalNumberOfPages);
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
// Load contracts restricted to 6 row per page
function loadAllInactiveCustomerByLimit(pageNumber) {
  // call the web service endpoint
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/inactiveCustomers/${pageNumber}`,
    type: 'GET',
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success(data) {
      if (data != null) {
        $('#customerTableBody').html('');
        // for loop to generate each row of result
        for (let i = 0; i < data.length; i++) {
          const inactiveCustomer = data[i];

          console.log(inactiveCustomer);
          // compile the data that the card needs for its creation
          const contractstbl = {
            CustomerID: inactiveCustomer.CustomerID,
            FirstName: inactiveCustomer.FirstName,
            LastName: inactiveCustomer.LastName,
            PhoneNumber: inactiveCustomer.PhoneNumber,
          };
          const newRow = createRow(contractstbl);
          $('#customerTableBody').append(newRow);
        }
      }
    },
    error(xhr, textStatus, errorThrown) {
      console.log('Error in Operation');
      console.log('-----------------------');
      console.log(xhr);
      console.log(textStatus);
      console.log(errorThrown);

      console.log(xhr.status);
      console.log(xhr.responseText);
    },
  });
}

// eslint-disable-next-line no-unused-vars
function activateUser(id) {
  console.log(`Booking id to cancel ${id}`);
  // ajax method to call the method
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/activateCustomer/${id}`,
    type: 'PUT',
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success(data, textStatus, xhr) {
      console.log(xhr);
      console.log(textStatus);
      console.log(data);
      // set and call confirmation message
      $('#customerTableBody').html('');
      loadAllInactiveCustomerByLimit(1);
      msg = 'Successfully updated!';
      new Noty({
        timeout: '5000',
        type: 'success',
        layout: 'topCenter',
        theme: 'sunset',
        text: msg,
      }).show();
      $('#confirmationMsg').html(confirmToast(msg)).fadeOut(2500);
    },
    error(xhr, textStatus, errorThrown) {
      console.log(textStatus);
      console.log(errorThrown);
      // set and call error message
      let errMsg = '';
      if (xhr.status === 500) {
        console.log('error');
        errMsg = 'Please ensure that your values are accurate';
      } else if (xhr.status === 400) {
        errMsg = ' Invalid input ';
      } else if (xhr.status === 406) {
        errMsg = ' Invalid input';
      } else {
        errMsg = 'There is some other issues here ';
      }
      new Noty({
        timeout: '5000',
        type: 'error',
        layout: 'topCenter',
        theme: 'sunset',
        text: errMsg,
      }).show();
      $('#customerTableBody').html('');
      $('#errMsgNotificaton').html(errorToast(errMsg)).fadeOut(2500);
    },
  });
}

// eslint-disable-next-line no-unused-vars
function deleteCustomer(id) {
  console.log(`Booking id to cancel ${id}`);
  // ajax method to call the method
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/inActiveCustomer/${id}`,
    type: 'DELETE',
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success(data, textStatus, xhr) {
      console.log(xhr);
      console.log(textStatus);
      console.log(data);
      // set and call confirmation message
      $('#customerTableBody').html('');
      loadAllInactiveCustomerByLimit(1);
      msg = 'Successfully updated!';
      new Noty({
        timeout: '5000',
        type: 'success',
        layout: 'topCenter',
        theme: 'sunset',
        text: msg,
      }).show();
      $('#confirmationMsg').html(confirmToast(msg)).fadeOut(2500);
    },
    error(xhr, textStatus, errorThrown) {
      console.log(textStatus);
      console.log(errorThrown);
      // set and call error message
      let errMsg = '';
      if (xhr.status === 500) {
        console.log('error');
        errMsg = 'Please ensure that your values are accurate';
      } else if (xhr.status === 400) {
        errMsg = ' Invalid input ';
      } else if (xhr.status === 406) {
        errMsg = ' Invalid input';
      } else {
        errMsg = 'There is some other issues here ';
      }
      new Noty({
        timeout: '5000',
        type: 'error',
        layout: 'topCenter',
        theme: 'sunset',
        text: errMsg,
      }).show();
      $('#customerTableBody').html('');
      $('#errMsgNotificaton').html(errorToast(errMsg)).fadeOut(2500);
    },
  });
}
$(document).ready(() => {
  const queryParams = new URLSearchParams(window.location.search);
  console.log('--------Query Params----------');
  console.log(`Query Param (source): ${window.location.search}`);
  console.log(`Query Param (extraction): ${queryParams}`);

  loadAllInactiveCustomerByLimit('1');
  loadAllInactiveCustomers();
});
