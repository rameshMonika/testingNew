/* eslint-disable linebreak-style */
/* eslint-disable no-shadow */
/* eslint-disable no-plusplus */
/* eslint-disable no-undef */
/* eslint-disable no-console */

const frontEndUrl = 'http://localhost:3001';
const backEndUrl = 'http://localhost:5000';
// const frontEndUrl = 'https://moc-fa.herokuapp.com';
// const backEndUrl = 'https://moc-ba.herokuapp.com';
const tmpToken = JSON.parse(localStorage.getItem('token'));
const tempAdminID = JSON.parse(localStorage.getItem('AdminID'));
if (tmpToken === null || tempAdminID === null) {
  window.localStorage.clear();
  window.location.replace(`${frontEndUrl}/unAuthorize`);
}
function createRow(cardInfo) {
  const card = `
        <tr>
            <th scope="row">${cardInfo.FirstName} ${cardInfo.LastName}</th>
            <td>${cardInfo.Email}</td>
            <td>${cardInfo.Password}</td>
            <td class="status"><div class="status-color ${cardInfo.Status}"></div>${cardInfo.Status}</td>
            <td>
                <button type="button" data-toggle="modal" data-target="#editModal" onclick="loadACustomer(${cardInfo.CustomerID})">
                <i class="fa-solid fa-pen"></i>
                </button>
            </td>
            <td>
                <button type="button" id="deleteCustomerBtn" onClick="deleteCustomer(${cardInfo.CustomerID})"><i class="fa-solid fa-trash-can"></i></button>
            </td>
        </tr>
    `;
  return card;
}

function loadAllCustomers() {
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/customer`,
    type: 'GET',
    contentType: 'application/json; charset=utf-8',

    success(data) {
      for (let i = 0; i < data.length; i++) {
        const customer = data[i];

        const RowInfo = {
          CustomerID: customer.CustomerID,
          FirstName: customer.FirstName,
          LastName: customer.LastName,
          Email: customer.Email,
          Password: customer.Password,
          Status: customer.Status,
        };

        const newCard = createRow(RowInfo);
        $('#customer-list').append(newCard);
      }
    },

    error(xhr, textStatus, errorThrown) {
      if (errorThrown === 'Forbidden') {
        window.location.replace(`${frontEndUrl}/unAuthorize`);
      }
      console.log('Error in Operation');

      console.log(xhr);
      console.log(textStatus);
      console.log(errorThrown);

      console.log(xhr.responseText);
      console.log(xhr.status);
    },
  });
}

// eslint-disable-next-line no-unused-vars
function loadACustomer(id) {
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/onecustomer/${id}`,
    type: 'GET',
    contentType: 'application/json; charset=utf-8',

    success(data) {
      const customer = data[0];

      const RowInfo = {
        CustomerID: customer.CustomerID,
        FirstName: customer.FirstName,
        LastName: customer.LastName,
        Password: customer.Password,
        Status: customer.Status,
      };

      $('#editCustomerID').val(RowInfo.CustomerID);
      $('#firstName').append(RowInfo.FirstName);
      $('#lastName').append(RowInfo.LastName);
      $('#customerPwdInput').val(RowInfo.Password);
      $('#customerStatusInput').val(RowInfo.Status);
    },

    error(xhr, textStatus, errorThrown) {
      console.log(xhr);
      console.log(textStatus);
      console.log(errorThrown);
      console.log('Error in Operation');

      // if (xhr.status == 201) {
      //     errMsg = "The id doesn't exist "
      // }
      // $('#errMsgNotificaton').html(errorToast(errMsg)).fadeOut(2500);
    },
  });
}

function updateCustomer() {
  // data extraction
  const id = $('#editCustomerID').val();
  const customerPwd = $('#customerPwdInput').val();
  const customerStatus = $('#customerStatusInput').val();

  // get item from local storage
  const data = {
    CustomerPassword: customerPwd,
    CustomerStatus: customerStatus,
  };

  // call the web service endpoint
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/customer/${id}`,
    type: 'PUT',
    data: JSON.stringify(data),
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success(data) {
      console.log(data);
      const msg = 'Update Successful';
      new Noty({
        timeout: '5000',
        type: 'success',
        layout: 'topCenter',
        theme: 'sunset',
        text: msg,
      }).show();
      console.log('Update Successful');
      $('#customer-list').html('');
      loadAllCustomers();
    },
    error(xhr, textStatus, errorThrown) {
      msg = 'Update Unsuccessful';
      new Noty({
        timeout: '5000',
        type: 'error',
        layout: 'topCenter',
        theme: 'sunset',
        text: msg,
      }).show();
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

function deleteCustomer(id) {
  // call the web service endpoint for deleting customer by id
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/customer/${id}`,
    type: 'DELETE',
    contentType: 'application/json; charset=utf-8',
    // if data inserted
    success(data, textStatus, xhr) {
      // if id in the params not valid show error
      console.log('Delete Successful');
      $('#customer-list').html('');
      loadAllCustomers();
      if (xhr.status === 404) {
        // set and call error message
        // eslint-disable-next-line no-use-before-define
        errMsg = 'Not valid id';
      } else if (xhr.status === 200) {
      // if the params id is valid and
        // set and call confirmation message
        msg = 'Successfully deleted!';
        new Noty({
          timeout: '5000',
          type: 'success',
          layout: 'topCenter',
          theme: 'sunset',
          text: msg,
        }).show();

        $('#confirmationMsg').html(confirmToast(`${msg} ${xhr.status}`)).fadeOut(2500);
      }
    },

    error(xhr, textStatus, errorThrown) {
      console.log(textStatus);
      console.log(errorThrown);
      // set and call error message
      let errMsg = '';
      if (xhr.status === 500) {
        console.log('error');
        errMsg = 'Server Issues';
      } else {
        errMsg = 'There is some other issues here';
      }
      new Noty({
        timeout: '5000',
        type: 'error',
        layout: 'topCenter',
        theme: 'sunset',
        text: errMsg,
      }).show();
      $('#errMsgNotificaton').html(errorToast(errMsg)).fadeOut(2500);
    },
  });
}

$(document).ready(() => {
  loadAllCustomers();

  // update button
  $('#editCustomerBtn').click(() => {
    updateCustomer();
  });
  // delete button
  $('#deleteCustomerBtn').click(() => {
    deleteCustomer();
  });
});
