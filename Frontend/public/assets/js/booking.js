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
function createRow(cardInfo) {
  console.log(cardInfo);
  console.log('********');
  console.log(cardInfo.Status);

  const card = `

    <tr>

    <td>${cardInfo.bookingID}</td>
    <td>${cardInfo.FirstName} ${cardInfo.LastName}</td>
    <td>${cardInfo.Package}</td>
    <td>${cardInfo.ClassName}</td>
    <td>${cardInfo.ScheduleDate}</td>
    <td>${cardInfo.TimeOfService}</td>
    <td>${cardInfo.NoOfRooms}</td>
    <td>${cardInfo.NoOfBathrooms}</td>
    <td>${cardInfo.RateName}</td>
    <td>${cardInfo.EstimatePricing}</td>
    <td>${cardInfo.Address}</td>
    <td>
    ${(cardInfo.Employee === null) ? '-' : cardInfo.Employee}
    
  </td>
   <td class="status"> <div class="status-color ${cardInfo.Status}"></div>${cardInfo.Status}</td>
    <td><button type="button" class="${(cardInfo.Status).includes('Completed') ? 'btn disabled' : (cardInfo.Status).includes('Cancelled') ? 'btn disabled' : 'btn btn-success'} ">Assign</button></td>
    <td>
        <button type="button" class="btn btn-warning" data-toggle="modal" data-target="#editBookingModal" onClick="loadABooking(${cardInfo.bookingID})" data-whatever="@mdo"><i class="fa fa-pencil" aria-hidden="true"  disabled></i></button>
    </td>
    <td> <button type="button" id="deleteClassServiceBtn" class="btn btn-info"  onClick="deleteBooking(${cardInfo.bookingID})"><i class="fa-regular fa-trash-can"></i></button></td>
    <script>   $("button").removeAttr("disabled");</script>
    </tr>

  
    `;
  return card;
}
function pageBtnCreate(totalNumberOfPages) {
  $('#pagination').html('');
  for (i = 1; i <= totalNumberOfPages; i++) {
    divPaginBtn = `<button type="button" onClick="loadAllBookingByLimit(${i})">${i}</button>`;
    $('#pagination').append(divPaginBtn);
  }
}

function loadAllBooking() {
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/booking`,
    type: 'GET',
    contentType: 'application/json; charset=utf-8',

    success(data) {
      console.log('-------response data------');
      console.log(data.ScheduleDate);
      console.log(`LENGTH OF DATA:${data.length}`);

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

function loadAllBookingByLimit(pageNumber) {
  // call the web service endpoint
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/booking/${pageNumber}`,
    type: 'GET',
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success(data) {
      if (data != null) {
        console.log('-------response data------');
        console.log(data);
        console.log(`LENGTH OF DATA:${data.length}`);
        $('#bookingTableBody').html('');
        for (let i = 0; i < data.length; i++) {
          const booking = data[i];

          let date = booking.ScheduleDate;
          date = date.replace('T16:00:00.000Z', '');
          // compile the data that the card needs for its creation
          const bookingstbl = {
            bookingID: booking.BookingID,
            FirstName: booking.FirstName,
            LastName: booking.LastName,
            Package: booking.PackageName,
            ClassName: booking.ClassName,
            ScheduleDate: date,
            TimeOfService: booking.TimeOfService,
            NoOfRooms: booking.NoOfRooms,
            NoOfBathrooms: booking.NoOfBathrooms,
            RateName: booking.Rate,
            EstimatePricing: booking.EstimatedPricing,
            Address: booking.Address,
            Employee: booking.EmployeeName,
            Status: booking.Status,
          };
          console.log('---------Card INfo data pack------------');
          console.log(bookingstbl);

          const newRow = createRow(bookingstbl);
          $('#bookingTableBody').append(newRow);
        }
      }
      loadAllBooking();
    },

    error(xhr, textStatus, errorThrown) {
      if (errorThrown === 'Forbidden') {
        window.location.replace(`${frontEndUrl}/unAuthorize`);
      }
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
function loadAllBookingToBECancelledByLimit(pageNumber) {
  // call the web service endpoint
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/bookingCancel/${pageNumber}`,
    type: 'GET',
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success(data) {
      if (data != null) {
        console.log('-------response data------');
        console.log(data);
        console.log(`LENGTH OF DATA:${data.length}`);
        $('#bookingTableBody').html('');
        for (let i = 0; i < data.length; i++) {
          const booking = data[i];
          // compile the data that the card needs for its creation
          const bookingstbl = {
            bookingID: booking.BookingID,
            FirstName: booking.FirstName,
            LastName: booking.LastName,
            Package: booking.PackageName,
            ClassName: booking.ClassName,
            StartDate: booking.StartDate,
            TimeOfService: booking.TimeOfService,
            NoOfRooms: booking.NoOfRooms,
            NoOfBathrooms: booking.NoOfBathrooms,
            RateName: booking.Rate,
            EstimatePricing: booking.EstimatedPricing,
            Address: booking.Address,
            Employee: booking.EmployeeName,
            Status: booking.Status,
          };
          console.log('---------Card INfo data pack------------');
          console.log(bookingstbl);

          const newRow = createRow(bookingstbl);
          $('#bookingTableBody').append(newRow);
        }
      }
      loadAllBooking();
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

// load gets a booking
// eslint-disable-next-line no-unused-vars
function loadABooking(bookingID) {
  // gets a class of service based on id
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/oneBooking/${bookingID}`,
    type: 'GET',
    contentType: 'application/json; charset=utf-8',
    success(data) {
      // if the code works
      console.log('-------response data------');
      console.log(data);
      console.log(`LENGTH OF DATA:${data.length}`);
      const booking = data[0];
      // extract data information
      const RowInfo = {
        bookingID: booking.BookingID,
        ScheduleDate: booking.ScheduleDate,
      };
      console.log('---------Card INfo data pack------------');
      console.log(RowInfo);
      console.log('---------------------');
      // updating extracted values to update pop up
      $('#booking-id-update').val(RowInfo.bookingID);
      $('#datePicker').val(RowInfo.ScheduleDate);
    },
    error(xhr) {
      // set and call error message
      errMsg = ' ';
      if (xhr.status === 201) {
        errMsg = "The id doesn't exist ";
      }
      $('#errMsgNotificaton').html(errorToast(errMsg)).fadeOut(2500);
    },
  });
}
// add new booking
$('#addNewBooking').click(() => {
  // data extraction
  const id = $('#addBookingID').val();
  const date = $('#datepicker').val();
  // data compilation
  const info = {
    bookingID: id,
    bookingDate: date,
  };

  // call web service endpoint
  $.ajax({
    url: `${backEndUrl}/booking`,
    type: 'POST',
    data: JSON.stringify(info),
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success(data) {
      if (data != null) {
        loadAllBookingByLimit(1);
        console.log('Added');
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

// Login
$('#updateBookingDate').click(() => {
  // data extraction
  const bookingIDs = $('#booking-id-update').val();
  const date = $('#datePicker').val();
  // data compilation
  const info = {
    bookingID: bookingIDs,
    ScheduleDate: date,
  };

  // call web service endpoint
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/updateBooking/${bookingIDs}`,
    type: 'PUT',
    data: JSON.stringify(info),
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success(data) {
      if (data != null) {
        new Noty({
          timeout: '5000',
          type: 'sucess',
          layout: 'topCenter',
          theme: 'sunset',
          text: 'added successfully',
        }).show();
        loadAllBookingByLimit(1);
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

  loadAllBookingByLimit(1);
});
