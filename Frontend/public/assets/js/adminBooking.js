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

const userSearchChar = [];
const userSearch = document.getElementById('searchBookingByCustomer');
const tmpToken = JSON.parse(localStorage.getItem('token'));
const tempAdminID = JSON.parse(localStorage.getItem('AdminID'));
if (tmpToken === null || tempAdminID === null) {
  window.location.replace(`${frontEndUrl}/unAuthorize`);
}
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
    <td><a type="button" href="/admin/assign?bookingid=${cardInfo.bookingID}" class="${(cardInfo.Status).includes('Completed') ? 'btn disabled' : (cardInfo.Status).includes('Cancelled') ? 'btn disabled' : 'btn btn-success'} ">Assign</a></td>
    <td>
        <button type="button" class="btn btn-warning" data-toggle="modal" data-target="#editBookingModal" onClick="loadABooking(${cardInfo.bookingID})" data-whatever="@mdo"><i class="fa fa-pencil" aria-hidden="true"  disabled></i></button>
    </td>
    <td> <button type="button" id="deleteClassServiceBtn" class="btn btn-info"  onClick="deleteBooking(${cardInfo.bookingID})"><i class="fa-regular fa-trash-can"></i></button></td>
    <script>   $("button").removeAttr("disabled");</script>
    </tr>

  
    `;
  return card;
}

function pageBtnCreate(totalNumberOfPages, activePage) {
  $('#pagination').html('');
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
    divPaginBtn = `<button type="button" onClick="loadAllBookingByLimit(${1})"><<</button>`;
    $('#pagination').append(divPaginBtn);
  }

  for (i = maxLeft; i <= maxRight; i++) {
    if (i === activePage) {
      divPaginBtn = `<button type="button" class="active" onClick="loadAllBookingByLimit(${i})">${i}</button>`;
      $('#pagination').append(divPaginBtn);
    } else {
      divPaginBtn = `<button type="button" onClick="loadAllBookingByLimit(${i})">${i}</button>`;
      $('#pagination').append(divPaginBtn);
    }
  }

  if (activePage !== totalNumberOfPages) {
    divPaginBtn = `<button type="button" onClick="loadAllBookingByLimit(${totalNumberOfPages})">>></button>`;
    $('#pagination').append(divPaginBtn);
  }
}

function loadAllBooking(activePage) {
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/booking`,
    type: 'GET',
    contentType: 'application/json; charset=utf-8',

    success(data) {
      console.log('-------response data------');

      for (let i = 0; i < data.length; i++) {
        const booking = data[i];

        const Customer = {
          CustomerName: `${booking.FirstName} ${booking.LastName}`,
          Address: booking.Address,
          ClassName: booking.ClassName,
          EmployeeName: booking.EmployeeName,
          EstimatedPricing: booking.EstimatedPricing,
          FirstName: booking.FirstName,
          LastName: booking.LastName,
          NoOfBathrooms: booking.NoOfBathrooms,
          NoOfRooms: booking.NoOfRooms,
          PackageName: booking.PackageName,
          Rate: booking.Rate,
          ScheduleDate: booking.ScheduleDate,
          Status: booking.Status,
          TimeOfService: booking.TimeOfService,
          BookingID: booking.BookingID,
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

          // compile the data that the card needs for its creation
          const bookingstbl = {
            bookingID: booking.BookingID,
            FirstName: booking.FirstName,
            LastName: booking.LastName,
            Package: booking.PackageName,
            ClassName: booking.ClassName,
            ScheduleDate: booking.ScheduleDate,
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
      loadAllBooking(pageNumber);
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

// Search for booking with event listener
userSearch.addEventListener('keyup', (e) => {
  // Declare RowInfo Object
  let RowInfo = {};
  // Declare similarResults array
  const similarResults = [];
  // Declare constant variable to store the user input
  // Input is converted to lowercases
  const searchString = e.target.value.toLowerCase();
  // Clear the pagination buttons
  $('#pagination').html('');

  // If statement to run the loadAllBookingBtLimit function
  // if there are no inputs
  if (searchString === '') {
    console.log('if');
    $('#bookingTableBody').html('');
    loadAllBookingByLimit(1);
  }

  // eslint-disable-next-line arrow-body-style
  // Filter in the wanted ones and push in to filterBookings array
  const filterBookings = userSearchChar.filter((customer) => (
    customer.CustomerName.toLowerCase().includes(searchString)
  ));

  // Clear the previous returned results in the containers
  $('#similarSearch').html('');
  $('#bookingTableBody').html('');

  // Check if filterBookings is not empty
  if (filterBookings.length !== 0) {
    for (let i = 0; i < filterBookings.length; i++) {
      const booking = filterBookings[i];

      // compile the data that the card needs for its creation
      RowInfo = {
        bookingID: booking.BookingID,
        FirstName: booking.FirstName,
        LastName: booking.LastName,
        Package: booking.PackageName,
        ClassName: booking.ClassName,
        ScheduleDate: booking.ScheduleDate,
        TimeOfService: booking.TimeOfService,
        NoOfRooms: booking.NoOfRooms,
        NoOfBathrooms: booking.NoOfBathrooms,
        RateName: booking.Rate,
        EstimatePricing: booking.EstimatedPricing,
        Address: booking.Address,
        Employee: booking.EmployeeName,
        Status: booking.Status,
      };
      const newCard = createRow(RowInfo);
      $('#bookingTableBody').append(newCard);
    }
  } else {
    // If filterBookings is empty
    for (let i = 0; i < userSearchChar.length; i++) {
      // Store the value been compared to, in compared constant
      const compared = userSearchChar[i].CustomerName;
      // Find the levenshtein distance between the compared word and input word
      const distance = levenshtein(searchString, compared.toLowerCase()); // Levenshtein Distance
      const booking = userSearchChar[i];

      // compile the data that the card needs for its creation
      RowInfo = {
        bookingID: booking.BookingID,
        FirstName: booking.FirstName,
        LastName: booking.LastName,
        Package: booking.PackageName,
        ClassName: booking.ClassName,
        ScheduleDate: booking.ScheduleDate,
        TimeOfService: booking.TimeOfService,
        NoOfRooms: booking.NoOfRooms,
        NoOfBathrooms: booking.NoOfBathrooms,
        RateName: booking.Rate,
        EstimatePricing: booking.EstimatedPricing,
        Address: booking.Address,
        Employee: booking.EmployeeName,
        Status: booking.Status,
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
      $('#bookingTableBody').append(newCard);
    }
    // Display when no results found
    $('#similarSearch').html(`<p><b>${searchString}</b> not found, do you mean...</p><br>`);
  }
});

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

  const Employeeid = localStorage.getItem('EmployeeID');
  if (Employeeid != null) {
    const id = $('#addContractID').val();
    const date = $('#datepicker').val();
    const Employeeid = localStorage.getItem('EmployeeID');

    // data compilation
    const info = {
      bookingID: id,
      bookingDate: date,
      AdminId: Employeeid,
    };
    $.ajax({
      headers: { authorization: `Bearer ${tmpToken}` },
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
  } else {
    const id = $('#addContractID').val();
    const date = $('#datepicker').val();
    const SuperAdminID = localStorage.getItem('SuperAdminID');
    const info = {
      bookingID: id,
      bookingDate: date,
      Admin: SuperAdminID,
    };
    $.ajax({
      headers: { authorization: `Bearer ${tmpToken}` },
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
  }
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
