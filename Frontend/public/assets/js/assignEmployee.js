/* eslint-disable linebreak-style */
/* eslint-disable func-names */
/* eslint-disable no-plusplus */
/* eslint-disable no-undef */
/* eslint-disable no-console */
/* eslint-disable no-else-return */
/* eslint-disable no-nested-ternary */

const frontEndUrl = 'http://localhost:3001';
const backEndUrl = 'http://localhost:5000';
// const frontEndUrl = 'https://moc-fa.herokuapp.com';
// const backEndUrl = 'https://moc-ba.herokuapp.com';
const type = JSON.parse(localStorage.getItem('AdminID'));
const tmpToken = JSON.parse(localStorage.getItem('token'));
if (type === null) {
  window.location.replace(`${frontEndUrl}/unAuthorize`);
}

// eslint-disable-next-line no-unused-vars
function selectEmployee(employee) {
  document.getElementById('assign').value = employee;
}
function createRow(cardInfo) {
//   console.log(cardInfo);
  if (cardInfo.EmployeeStatus === 'Assigned') {
    const card = `
    <div class="card mb-3" style="max-width: 93%;">
    <div class="row no-gutters ">
    <button type="button" class="btn bg-danger" onclick="selectEmployee(${cardInfo.EmployeeID})">
        <div class="col-sm-3">
            <img src="${cardInfo.EmployeeImg}" class="card-img rounded-circle " alt="...">
        </div>
        <div class="col-sm-9 ">
            <div class="card-body">
                <h6 class="card-title">${cardInfo.Employee}</h6>
                <p class="card-text">
                ${cardInfo.EmployeeDes}
                </p>
            </div>
        </div>
    </button>
    </div>
</div>
  `;
    return card;
  } else {
    const card = `
    <div class="card mb-3" style="max-width: 93%;">
    <div class="row no-gutters ">
    <button type="button" class="btn " onclick="selectEmployee(${cardInfo.EmployeeID})">
        <div class="col-sm-3">
            <img src="${cardInfo.EmployeeImg}" class="card-img rounded-circle " alt="...">
        </div>
        <div class="col-sm-9 ">
            <div class="card-body">
                <h6 class="card-title">${cardInfo.Employee}</h6>
                <p class="card-text">
                ${cardInfo.EmployeeDes}
                </p>
            </div>
        </div>
    </button>
    </div>
</div>
  `;
    return card;
  }
}

function loadAvailableEmployee(bookingDate) {
  // console.log("DATESSSSSSSSSSSSSSS  "+ bookingDate)
  const details = {
    bookingDates: bookingDate,
  };

  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/employeeList`,
    type: 'POST',
    data: JSON.stringify(details),
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success(data) {
      if (data != null) {
        console.log('-------response data------');
        console.log(`LENGTH OF DATA:${data.length}`);
        for (let i = 0; i < data.length; i++) {
          const booking = data[i];
          // compile the data that the card needs for its creation
          const employeeDetails = {
            Employee: booking.EmployeeName,
            EmployeeDes: booking.EmployeeDes,
            EmployeeImg: booking.EmployeeImgUrl,
            EmployeeStatus: booking.Status,
            EmployeeID: booking.EmployeeID,
          };
          console.log('---------Card INfo data pack------------');
          const newRow = createRow(employeeDetails);
          $('#employeeList').append(newRow);
        }
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
function loadBookingDetails(bookingid) {
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/contract/${bookingid}`,
    type: 'GET',
    contentType: 'application/json; charset=utf-8',

    success(data) {
      console.log('-------response data------');
      console.log(data);
      console.log(`LENGTH OF DATA:${data.length}`);

      const bookingDetails = data[0];

      const RowInfo = {
        customerFirstName: bookingDetails.FirstName,
        customerLastName: bookingDetails.LastName,
        contractAddress: bookingDetails.Address,
        contractRoom: bookingDetails.NoOfRooms,
        contractBathroom: bookingDetails.NoOfBathrooms,
        contractSizing: bookingDetails.RateName,
        contractPricing: bookingDetails.EstimatedPricing,
        contractEmployee: bookingDetails.EmployeeName,
        contractExtraNotes: bookingDetails.ExtraNotes,
        bookingDate: bookingDetails.ScheduleDate,
      };

      console.log('---------Card INfo data pack------------');
      console.log(RowInfo);

      $('#firstName').val(RowInfo.customerFirstName);
      $('#lastName').val(RowInfo.customerLastName);
      $('#address').val(RowInfo.contractAddress);
      $('#noOfRoom').val(RowInfo.contractRoom);
      $('#noOfBathroom').val(RowInfo.contractBathroom);
      $('#sizing').val(RowInfo.contractSizing);
      $('#pricing').val(RowInfo.contractPricing);
      $('#assign').val(RowInfo.EmployeeName);
      $('#extraNotes').val(RowInfo.ExtraNotes);
      loadAvailableEmployee(RowInfo.bookingDate);
    },

    error(xhr, textStatus, errorThrown) {
      console.log('Error in Operation');
      console.log(xhr);
      console.log(textStatus);
      console.log(errorThrown);
      // if (xhr.status == 201) {
      //     errMsg = "The id doesn't exist "
      // }
      // $('#errMsgNotificaton').html(errorToast(errMsg)).fadeOut(2500);
    },
  });
}
// eslint-disable-next-line no-unused-vars
function assignBookingSchedule() {
  // data extraction
  const queryParams = new URLSearchParams(window.location.search);
  const bookingid = queryParams.get('bookingid');
  const employeeID = $('#assign').val();
  const data = {
    EmployeeID: employeeID,
  };
  // call the web service endpoint
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/assignBooking/${bookingid}`,
    type: 'PUT',
    data: JSON.stringify(data),
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    // eslint-disable-next-line no-shadow
    success(data, xhr) {
      if (xhr.status === 200) {
        console.log('Update Successful');
        msg = 'Successfully updated!';
        $('#confirmationMsg').html(confirmToast(msg)).fadeOut(2500);
        console.log(data);
      }
    },
    error(xhr, textStatus, errorThrown) {
      if (xhr.status === 400) {
        console.log('Error in Operation');
        console.log('-----------------------');
        console.log(xhr);
        console.log(textStatus);
        console.log(errorThrown);

        console.log(xhr.status);
        console.log(xhr.responseText);
      }
    },
  });
}
$(document).ready(() => {
  const queryParams = new URLSearchParams(window.location.search);
  console.log('--------Query Params----------');
  console.log(`Query Param (source): ${window.location.search}`);
  console.log(`Query Param (extraction): ${queryParams}`);

  const bookingid = queryParams.get('bookingid');
  console.log(bookingid);
  loadBookingDetails(bookingid);
});
