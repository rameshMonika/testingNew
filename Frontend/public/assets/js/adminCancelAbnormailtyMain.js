/* eslint-disable linebreak-style */
/* eslint-disable func-names */
/* eslint-disable no-plusplus */
/* eslint-disable no-undef */
/* eslint-disable no-console */

const frontEndUrl = 'http://localhost:3001';
const backEndUrl = 'http://localhost:5000';
// const frontEndUrl = 'https://moc-fa.herokuapp.com';
// const backEndUrl = 'https://moc-ba.herokuapp.com';
const tmpToken = JSON.parse(localStorage.getItem('token'));
// errorToast method display the error
function errorToast(msg) {
  // error alert div
  diverror = `
<div class="alert alert-danger alert-dismissible fade show">
<strong>Error!</strong>${msg}
<button type="button" class="btn-close" data-bs-dismiss="alert"></button>
</div>

`;
  // return error alert div
  return diverror;
}

// confirmToast method display confiramtion
function confirmToast(msg) {
  // confiramtion alert div
  divConfirmation = `
<div class="alert alert-success alert-dismissible fade show">
<strong>${msg}</strong>
<button type="button" class="btn-close" data-bs-dismiss="alert"></button>
</div>

`;
  // return confirmation alert div
  return divConfirmation;
}
// createTable method is to create the table rows
function createTable(cardInfo) {
  console.log(cardInfo);
  // card html with values to extract when displaying
  const card = `
  <tr>
  <td>${cardInfo.CancelBookingAbn}</td>
  <td>${cardInfo.Customer}</td>
  <td>${cardInfo.FirstName}</td>
  <td>${cardInfo.LastName}</td>
  <td>
  <button type="button" class="btn btn-warning"  onClick="loadAClassOfService(${cardInfo.classId})" >View</button>
  </td>
  <td> <button type="button" id="deleteClassServiceBtn" class="btn btn-info"  onClick="suspendUser(${cardInfo.Customer})">Suspend</button></td>
  <td> <button type="button" id="deleteClassServiceBtn" class="btn btn-info"  onClick="resolveIssue(${cardInfo.Customer})">Resolve</button></td>
  </tr>
  `;

  // returning card
  return card;
}

// loadAllClassOfServices gets all class of services
function loadAllClassOfServices() {
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/cancelledBookingAbnormality`,
    type: 'GET',
    contentType: 'application/json; charset=utf-8',
    success(data) {
      console.log('-------response data------');
      console.log(data);
      console.log(`LENGTH OF DATA:${data.length}`);

      for (let i = 0; i < data.length; i++) {
        // assigning variable for classOfService
        const cancelAbnormalityInfo = data[i];
        // extracting information
        const RowInfo = {
          CancelBookingAbn: cancelAbnormalityInfo.CancelBookingAbn,
          Customer: cancelAbnormalityInfo.Customer,
          FirstName: cancelAbnormalityInfo.FirstName,
          LastName: cancelAbnormalityInfo.LastName,
        };
        console.log('---------Card INfo data pack------------');
        console.log(RowInfo);
        // calling createTable to display values row by row
        const newRow = createTable(RowInfo);
        // appeding row to classTable
        $('#classServiceTableBody').append(newRow);
      }
    },
    error(xhr, textStatus, errorThrown) {
      if (errorThrown === 'Forbidden') {
        window.location.replace(`${frontEndUrl}/unAuthorize`);
      }
      // print error
      console.log('Error in Operation');
      console.log(xhr);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
}

// eslint-disable-next-line no-unused-vars
function resolveIssue(id) {
  // call the web service endpoint for deleting class of service by id
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/updateCancelAbnormality/${id}`,
    type: 'PUT',
    contentType: 'application/json; charset=utf-8',
    // if data inserted
    success(data, textStatus, xhr) {
      // if id in the params not valid show error
      if (xhr.status === 404) {
        // set and call error message
        let errMsg = '';
        errMsg = 'Not valid id';
        $('#errMsgNotificaton').html(errorToast(errMsg)).fadeOut(2500);
        // to refresh
        $('#classServiceTableBody').html('');
      } else if (xhr.status === 200) {
      // if the params id is valid and
        // set and call confirmation message
        msg = 'Successfully deleted!';

        $('#confirmationMsg').html(confirmToast(`${msg} ${xhr.status}`)).fadeOut(2500);
        // to refresh
        // to refresh
        $('#classServiceTableBody').html('');
        loadAllClassOfServices();
      }
    },
    error(xhr, textStatus, errorThrown) {
      // set and call error message
      console.log(xhr);
      console.log(textStatus);
      console.log(errorThrown);
      let errMsg = '';
      if (xhr.status === 500) {
        console.log('error');
        errMsg = 'Server Issues';
      } else {
        errMsg = 'There is some other issues here';
      }
      $('#errMsgNotificaton').html(errorToast(errMsg)).fadeOut(2500);
    },
  });
}

// eslint-disable-next-line no-unused-vars
function suspendUser(id) {
  // call the web service endpoint for deleting class of service by id
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/updateCustomerStatus/${id}`,
    type: 'PUT',
    contentType: 'application/json; charset=utf-8',
    // if data inserted
    success(data, textStatus, xhr) {
      // if id in the params not valid show error
      if (xhr.status === 404) {
        // set and call error message
        let errMsg = '';
        errMsg = 'Not valid id';
        $('#errMsgNotificaton').html(errorToast(errMsg)).fadeOut(2500);
        // to refresh
        $('#classServiceTableBody').html('');
      } else if (xhr.status === 200) {
      // if the params id is valid and
        // set and call confirmation message
        msg = 'Successfully deleted!';

        $('#confirmationMsg').html(confirmToast(`${msg} ${xhr.status}`)).fadeOut(2500);
        // to refresh
        // to refresh
        $('#classServiceTableBody').html('');
        loadAllClassOfServices();
      }
    },
    error(xhr, textStatus, errorThrown) {
      // set and call error message
      console.log(xhr);
      console.log(textStatus);
      console.log(errorThrown);
      let errMsg = '';
      if (xhr.status === 500) {
        console.log('error');
        errMsg = 'Server Issues';
      } else {
        errMsg = 'There is some other issues here';
      }
      $('#errMsgNotificaton').html(errorToast(errMsg)).fadeOut(2500);
    },
  });
}

// to load datas when page refresh or loads for the first time
$(document).ready(() => {
  // to debug
  const queryParams = new URLSearchParams(window.location.search);
  console.log('--------Query Params----------');
  console.log(`Query Param (source): ${window.location.search}`);
  console.log(`Query Param (extraction): ${queryParams}`);
  // load
  loadAllClassOfServices();
});
