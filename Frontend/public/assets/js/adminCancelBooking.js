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
  window.localStorage.clear();
  window.location.replace(`${frontEndUrl}/unAuthorize`);
}
const userSearchChar = [];
const userSearch = document.getElementById('searchCancelledBookingByCustomer');

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
    <td>${cardInfo.StartDate}</td>
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
    <td><button onClick="cancelBooking(${cardInfo.bookingID})" class="btn btn-danger">Cancel</button></td>
    </tr>
    `;
  return card;
}

function pageBtnCreate(totalNumberOfPages, activePage) {
  $('#paginationCancel').html('');
  let maxLeft = (activePage - Math.floor(5 / 2));
  let maxRight = (activePage + Math.floor(5 / 2));

  if (maxLeft < 1) {
    maxLeft = 1;
    maxRight = 5;
  }

  if (maxRight > totalNumberOfPages) {
    maxLeft = totalNumberOfPages - (5 - 1);
    maxRight = totalNumberOfPages;

    if (maxLeft < 1) {
      maxLeft = 1;
    }
  }

  if (activePage !== 1) {
    divPaginBtn = `<button type="button" onClick="loadAllBookingToBeCancelledByLimit(${1})"><<</button>`;
    $('#paginationCancel').append(divPaginBtn);
  }

  for (i = maxLeft; i <= maxRight; i++) {
    if (i === activePage) {
      divPaginBtn = `<button type="button" class="active" onClick="loadAllBookingToBeCancelledByLimit(${i})">${i}</button>`;
      $('#paginationCancel').append(divPaginBtn);
    } else {
      divPaginBtn = `<button type="button" onClick="loadAllBookingToBeCancelledByLimit(${i})">${i}</button>`;
      $('#paginationCancel').append(divPaginBtn);
    }
  }

  if (activePage !== totalNumberOfPages) {
    divPaginBtn = `<button type="button" onClick="loadAllBookingToBeCancelledByLimit(${totalNumberOfPages})">>></button>`;
    $('#paginationCancel').append(divPaginBtn);
  }
}

function loadAllBookingToBeCancelled(activePage) {
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/bookingCancel`,
    type: 'GET',
    contentType: 'application/json; charset=utf-8',
    success(data) {
      console.log('-------response data------');
      console.log(data);
      console.log(`LENGTH OF DATA:${data.length}`);

      for (let i = 0; i < data.length; i++) {
        const cancelledBooking = data[i];

        const Customer = {
          CustomerName: `${cancelledBooking.FirstName} ${cancelledBooking.LastName}`,
          Address: cancelledBooking.Address,
          ClassName: cancelledBooking.ClassName,
          EmployeeName: cancelledBooking.EmployeeName,
          EstimatedPricing: cancelledBooking.EstimatedPricing,
          FirstName: cancelledBooking.FirstName,
          LastName: cancelledBooking.LastName,
          NoOfBathrooms: cancelledBooking.NoOfBathrooms,
          NoOfRooms: cancelledBooking.NoOfRooms,
          PackageName: cancelledBooking.PackageName,
          Rate: cancelledBooking.Rate,
          ScheduleDate: cancelledBooking.ScheduleDate,
          Status: cancelledBooking.Status,
          TimeOfService: cancelledBooking.TimeOfService,
          BookingID: cancelledBooking.BookingID,
        };
        userSearchChar.push(Customer);
      }

      const totalNumberOfPages = Math.ceil(data.length / 6);
      pageBtnCreate(totalNumberOfPages, activePage);
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

function loadAllBookingToBeCancelledByLimit(pageNumber) {
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
        $('#bookingCancelTableBody').html('');
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
          $('#bookingCancelTableBody').append(newRow);
        }
        loadAllBookingToBeCancelled(pageNumber);
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
function cancelBooking(id) {
  console.log(`Booking id to cancel ${id}`);
  // ajax method to call the method
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/cancelBooking/${id}`,
    type: 'PUT',
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success(data, textStatus, xhr) {
      console.log(xhr);
      console.log(textStatus);
      console.log(data);
      // set and call confirmation message
      $('#bookingCancelTableBody').html('');
      loadAllBookingToBeCancelledByLimit(1);
      msg = 'Successfully updated!';
      new Noty({
        timeout: '5000',
        type: 'success',
        layout: 'topCenter',
        theme: 'sunset',
        text: msg,
      }).show();
      $('#confirmationMsg').html(confirmToast(msg)).fadeOut(2500);

      // refresh
      // $('#classServiceTableBody').html('')
      // loadAllClassOfServices()
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
      $('#classServiceTableBody').html('');
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

function levenshtein(a, b) {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  const matrix = [];

  // increment along the first column of each row
  let i;
  for (i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  // increment each column in the first row
  let j;
  for (j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  // Fill in the rest of the matrix
  for (i = 1; i <= b.length; i++) {
    for (j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          Math.min(
            matrix[i][j - 1] + 1, // insertion
            matrix[i - 1][j] + 1, // deletion
          ),
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

// Search for cancelled booking with event listener
userSearch.addEventListener('keyup', (e) => {
  // Declare RowInfo Object
  let RowInfo = {};
  // Declare similarResults array
  const similarResults = [];
  // Declare constant variable to store the user input
  // Input is converted to lowercases
  const searchString = e.target.value.toLowerCase();
  // Clear the pagination buttons
  $('#paginationCancel').html('');

  // If statement to run the loadAllBookingBtLimit function
  // if there are no inputs
  if (searchString === '') {
    console.log('if');
    $('#bookingCancelTableBody').html('');
    loadAllBookingByLimit(1);
  }

  // eslint-disable-next-line arrow-body-style
  // Filter in the wanted ones and push in to filterBookings array
  const filterBookings = userSearchChar.filter((customer) => (
    customer.CustomerName.toLowerCase().includes(searchString)
  ));

  // Clear the previous returned results in the containers
  $('#similarSearch').html('');
  $('#bookingCancelTableBody').html('');

  // Check if filterBookings is not empty
  if (filterBookings.length !== 0) {
    // For loop to display the table rows
    for (let i = 0; i < filterBookings.length; i++) {
      const cancelledBooking = filterBookings[i];

      // compile the data that the card needs for its creation
      RowInfo = {
        bookingID: cancelledBooking.BookingID,
        FirstName: cancelledBooking.FirstName,
        LastName: cancelledBooking.LastName,
        Package: cancelledBooking.PackageName,
        ClassName: cancelledBooking.ClassName,
        StartDate: cancelledBooking.ScheduleDate,
        TimeOfService: cancelledBooking.TimeOfService,
        NoOfRooms: cancelledBooking.NoOfRooms,
        NoOfBathrooms: cancelledBooking.NoOfBathrooms,
        RateName: cancelledBooking.Rate,
        EstimatePricing: cancelledBooking.EstimatedPricing,
        Address: cancelledBooking.Address,
        Employee: cancelledBooking.EmployeeName,
        Status: cancelledBooking.Status,
      };

      const newCard = createRow(RowInfo);
      $('#bookingCancelTableBody').append(newCard);
    }
  } else {
    // If filterBookings is empty
    for (let i = 0; i < userSearchChar.length; i++) {
      // Store the value been compared to, in compared constant
      const compared = userSearchChar[i].CustomerName;
      // Find the levenshtein distance between the compared word and input word
      const distance = levenshtein(searchString, compared.toLowerCase()); // Levenshtein Distance
      const cancelledBooking = userSearchChar[i];

      // compile the data that the card needs for its creation
      RowInfo = {
        bookingID: cancelledBooking.BookingID,
        FirstName: cancelledBooking.FirstName,
        LastName: cancelledBooking.LastName,
        Package: cancelledBooking.PackageName,
        ClassName: cancelledBooking.ClassName,
        StartDate: cancelledBooking.ScheduleDate,
        TimeOfService: cancelledBooking.TimeOfService,
        NoOfRooms: cancelledBooking.NoOfRooms,
        NoOfBathrooms: cancelledBooking.NoOfBathrooms,
        RateName: cancelledBooking.Rate,
        EstimatePricing: cancelledBooking.EstimatedPricing,
        Address: cancelledBooking.Address,
        Employee: cancelledBooking.EmployeeName,
        Status: cancelledBooking.Status,
      };

      // If levenshtein distance is smalle or equals to 4
      // push result into similarResults array
      if (distance <= 4) {
        similarResults.push(RowInfo);
      }
    }

    // For loop to display the result rows
    for (let j = 0; j < similarResults.length; j++) {
      const newCard = createRow(similarResults[j]);
      $('#bookingCancelTableBody').append(newCard);
    }
    // Display when no results found
    $('#similarSearch').html(`<p><b>${searchString}</b> not found, do you mean...</p><br>`);
  }
});

$(document).ready(() => {
  const queryParams = new URLSearchParams(window.location.search);
  console.log('--------Query Params----------');
  console.log(`Query Param (source): ${window.location.search}`);
  console.log(`Query Param (extraction): ${queryParams}`);
  loadAllBookingToBeCancelledByLimit(1);
});
