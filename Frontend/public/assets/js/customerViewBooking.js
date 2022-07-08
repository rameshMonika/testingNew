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

function createRow(cardInfo) {
  console.log('*********inside card*********');
  const { bookingID } = cardInfo;
  const scheduleDate = new Date(cardInfo.scheduleDate);
  let showBtn = 1;
  const statusOfAppointment = cardInfo.status;
  const dateToBeChecked = new Date();

  console.log(`Booking id: ${bookingID}`);
  console.log(`Booking status: ${statusOfAppointment}`);

  // add a day
  dateToBeChecked.setDate(dateToBeChecked.getDate() + 1);

  if (scheduleDate < dateToBeChecked) {
    showBtn = 0;
  } else if (statusOfAppointment === 'Cancelled') {
    showBtn = 0;
  } else {
    showBtn = 1;
  }
  console.log('*************************');

  let card;
  if (showBtn) {
    card = `
        <div class="card">
                        <div class="card-header bg-white"># Booking ${cardInfo.bookingID}</div>
                        <div class="row">
                            <div class="col-md-5 mx-auto py-1">
                                Service : ${cardInfo.className}
                            </div>
                            <div class="col-md-5 mx-auto py-1">
                                Pricing : $${cardInfo.estimatePricing}
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-5 mx-auto py-1">
                                Package : ${cardInfo.packageName}
                            </div>
                            <div class="col-md-5 mx-auto py-1">
                                Day : ${cardInfo.dayOfService} ${(cardInfo.dayOfService2) === null ? '' : `,${cardInfo.dayOfService2}`}
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-5 mx-auto py-1">
                                Number of Room : ${cardInfo.noOfRooms}
                            </div>
                            <div class="col-md-5 mx-auto py-1">
                                Address : ${cardInfo.address}
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-5 mx-auto py-1">
                                Number of Bathroom : ${cardInfo.noOfBathrooms}
                            </div>
                            <div class="col-md-5 mx-auto py-1">
                                Status of appointment : ${cardInfo.status}
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-5 mx-auto py-1">
                                Date of appointment : ${cardInfo.scheduleDate}
                            </div>
                            <div class="col-md-5 mx-auto py-1">
                                Name of helper : ${(cardInfo.employee === null ? 'No assigned employee' : cardInfo.employee)}
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-5 mx-auto py-1">
                                Extra Notes : ${(cardInfo.extraNotes) === null ? 'No Extra notes' : cardInfo.extraNotes}
                            </div>
                            <div class="col-md-5 mx-auto py-1">
                            ${showBtn ? `<button class="btn btn-danger" type="button"  onClick=cancelBooking(${cardInfo.bookingID}) $("#idBooking").val("${cardInfo.bookingID}");>
                                Cancel
                            </button>` : ''}
                             
                            </div>
                        </div>
                    </div>
      `;
  } else {
    card = `
        <div class="card">
                        <div class="card-header bg-white"># Booking ${cardInfo.bookingID}</div>
                        <div class="row">
                            <div class="col-md-5 mx-auto py-1">
                                Service : ${cardInfo.className}
                            </div>
                            <div class="col-md-5 mx-auto py-1">
                                Pricing : $${cardInfo.estimatePricing}
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-5 mx-auto py-1">
                                Package : ${cardInfo.packageName}
                            </div>
                            <div class="col-md-5 mx-auto py-1">
                                Day : ${cardInfo.dayOfService} ${(cardInfo.dayOfService2) === null ? '' : `,${cardInfo.dayOfService2}`}
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-5 mx-auto py-1">
                                Number of Room : ${cardInfo.noOfRooms}
                            </div>
                            <div class="col-md-5 mx-auto py-1">
                                Address : ${cardInfo.address}
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-5 mx-auto py-1">
                                Number of Bathroom : ${cardInfo.noOfBathrooms}
                            </div>
                            <div class="col-md-5 mx-auto py-1">
                                Status of appointment : ${cardInfo.status}
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-5 mx-auto py-1">
                                Date of appointment : ${cardInfo.scheduleDate}
                            </div>
                            <div class="col-md-5 mx-auto py-1">
                                Name of helper : ${(cardInfo.employee === null ? 'No assigned employee' : cardInfo.employee)}
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-5 mx-auto py-1">
                                Extra Notes : ${(cardInfo.extraNotes) === null ? 'No Extra notes' : cardInfo.extraNotes}
                            </div>
                            <div class="col-md-5 mx-auto py-1">
                             <h1></h1>
                             
                            </div>
                        </div>
                    </div>
      `;
  }

  return card;
}

// updateExtraService to update existing extra service
function cancelBooking(bookingId) {
  // ajax method to call the method
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/update/customerBooking/${bookingId}`,
    type: 'PUT',

    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success(data, textStatus, xhr) {
      console.log('updated');
      Email.send({
        Host: 'smtp.elasticemail.com',
        Username: 'farhanmashudi@gmail.com',
        Password: '2F86A2CBC29B22A70B627E953FB42FD7CBB1',
        To: 'mnurfarhan13.20@ichat.sp.edu.sg',
        From: 'farhanmashudi@gmail.com',
        Subject: 'Cancel Booking',
        Body: `<h3>booking ID:${bookingId} </h3>`,
      }).then(
        (message) => alert('Email sent'),
      );
    },
    error(xhr, textStatus, errorThrown) {
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
    },
  });
}

function loadAllBooking() {
  const customerId = localStorage.getItem('customerID');
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/show/bookings/${customerId}`,
    type: 'GET',
    contentType: 'application/json; charset=utf-8',

    success(data) {
      console.log('-------response data------');
      console.log(data);
      console.log(`LENGTH OF DATA:${data.length}`);

      for (let i = 0; i < data.length; i++) {
        const booking = data[i];
        const bookingDetails = {
          bookingID: booking.BookingID,
          packageName: booking.PackageName,
          className: booking.ClassName,
          scheduleDate: booking.ScheduleDate,
          timeOfService: booking.TimeOfService,
          noOfRooms: booking.NoOfRooms,
          noOfBathrooms: booking.NoOfBathrooms,
          rateName: booking.Rate,
          estimatePricing: booking.EstimatedPricing,
          address: booking.Address,
          employee: booking.EmployeeName,
          status: booking.Status,
          extraNotes: booking.ExtraNotes,
          dayOfService: booking.DayOfService,
          dayOfService2: booking.DayOfService2,
        };
        const newRow = createRow(bookingDetails);
        $('#bookingSection').append(newRow);
      }
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
  const queryParams = new URLSearchParams(window.location.search);
  console.log('--------Query Params----------');
  console.log(`Query Param (source): ${window.location.search}`);
  console.log(`Query Param (extraction): ${queryParams}`);

  loadAllBooking();
});
