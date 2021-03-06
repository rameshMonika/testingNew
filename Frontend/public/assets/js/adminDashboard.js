/* eslint-disable linebreak-style */
/* eslint-disable func-names */
/* eslint-disable no-plusplus */
/* eslint-disable no-undef */
/* eslint-disable no-console */
/* eslint-disable no-new */
// const frontEndUrl = 'http://localhost:3001';
// const backEndUrl = 'http://localhost:5000';
// const frontEndUrl = 'https://moc-fa.herokuapp.com';
// const backEndUrl = 'https://moc-ba.herokuapp.com';
const frontEndUrl = 'http://54.254.150.51:3001';
const backEndUrl = 'http://54.254.150.51:5000';

const tmpToken = JSON.parse(localStorage.getItem('token'));

const tempAdminID = JSON.parse(localStorage.getItem('AdminID'));
if (tmpToken === null || tempAdminID === null) {
  window.localStorage.clear();
  window.location.replace(`${frontEndUrl}/unAuthorize`);
}
function loadUserDetails() {
  // extract user details from local storage
  const tempAdminID = JSON.parse(localStorage.getItem('AdminID'));

  // call the web service endpoint
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/admin/profile/${tempAdminID}`,
    type: 'GET',
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success(data) {
      console.log('back to frontend back with data');
      console.log('---------Response Data ------------');
      console.log(data);
      for (let i = 0; i < data.length; i++) {
        const user = data[i];

        // compile the data that the card needs for its creation
        userInfo = {
          FirstName: user.FirstName,
          LastName: user.LastName,
        };
      }
      
      console.log(userInfo.FirstName);
      $('#adminName').append("<h1>Welcome "+userInfo.FirstName + " "+userInfo.LastName+",</h1>");
      // $('#adminName').val("Welcome "+userInfo.FirstName + " "+userInfo.LastName+",");

    },
    // errorhandling
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

// load number of booking for each month
function loadMonthlyBookingForGraph() {
  $.ajax({
    // calling the backendUrl
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/bookingsByMonth`,
    type: 'GET',
    contentType: 'application/json; charset=utf-8',
    success(data, textStatus, xhr) {
      console.log(xhr);
      console.log(textStatus);
      // storing number of booking for each month respectively
      const numberOfBookingJan = data[0].numberOfBooking;
      const numberOfBookingFeb = data[1].numberOfBooking;
      const numberOfBookingMar = data[2].numberOfBooking;
      const numberOfBookingApr = data[3].numberOfBooking;
      const numberOfBookingMay = data[4].numberOfBooking;
      const numberOfBookingJun = data[5].numberOfBooking;
      const numberOfBookingJul = data[6].numberOfBooking;
      const numberOfBookingAug = data[7].numberOfBooking;
      const numberOfBookingSep = data[8].numberOfBooking;
      const numberOfBookingOct = data[9].numberOfBooking;
      const numberOfBookingNov = data[10].numberOfBooking;
      const numberOfBookingDec = data[11].numberOfBooking;

      // store number of booking made in each month in an array called numberOfBooking
      const numberOfBooking = [
        numberOfBookingJan,
        numberOfBookingFeb,
        numberOfBookingMar,
        numberOfBookingApr,
        numberOfBookingMay,
        numberOfBookingJun,
        numberOfBookingJul,
        numberOfBookingAug,
        numberOfBookingSep,
        numberOfBookingOct,
        numberOfBookingNov,
        numberOfBookingDec,
      ];

      // values on x-axis
      const xValues = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'October', 'Novemeber', 'December'];
      // initialising values on y axis as empty array
      const yValues = [];
      // get currendate
      const currentDate = new Date();
      // get current month
      const currentMonth = currentDate.getMonth();

      // for loop to loop through i and add booking
      // with the index less than or equal to current month
      for (i = 0; i <= currentMonth; i++) {
        yValues[i] = numberOfBooking[i];
      }
      // value of color
      colorVal = 'rgb(255, 99, 132)';
      // styling chart
      new Chart('myChart', {
        type: 'line',
        data: {
          labels: xValues,
          datasets: [{
            fill: true,
            lineTension: 0.2,
            color: '#fff',
            backgroundColor: colorVal,
            borderColor: 'rgb(255,99.132)',
            data: yValues,
          }],
        },
        options: {
          responsive: true,
          legend: { display: false },

          title: {
            display: true,
            text: 'Booking',
          },

          scales: {

            yAxes: [{
              ticks: { min: 0, autoSkip: true },
              scaleLabel: {
                display: true,
                labelString: 'Number of Booking',
              },

            }],
          },
        },
      });
    },
    error(xhr, textStatus, errorThrown) {
      console.log(xhr);
      console.log(textStatus);
      console.log(errorThrown);
      // print error
      console.log('Error in Operation');
    },
  });
}

// get revenue of the mont
function getRevenueOfTheMonth() {
  $.ajax({
    // backend url connection
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/revenueOfTheMonth`,
    type: 'GET',
    contentType: 'application/json; charset=utf-8',
    success(data, textStatus, xhr) {
      console.log(xhr);
      console.log(textStatus);
      console.log('-------response data------');
      console.log(data);
      // get vaule of the total revenue and append it to the html id of revenueOfTheMonth
      $('#revenueOfTheMonth').append(data.totalRevenue);
    },
    // propmpt error
    error(xhr, textStatus, errorThrown) {
      if (errorThrown === 'Forbidden') {
        window.location.replace(`${frontEndUrl}/unAuthorize`);
      }
      // print error
      console.log(xhr);
      console.log(textStatus);
      console.log(errorThrown);
      console.log('Error in Operation');
    },
  });
}

// getting different in month booking
function diffInConsecutiveMonthBooking() {
  $.ajax({
    // get backend url
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/bookingsByMonth`,
    type: 'GET',
    contentType: 'application/json; charset=utf-8',
    success(data, textStatus, xhr) {
      console.log(xhr);
      console.log(textStatus);
      // get currentDate
      const currentDate = new Date();
      // ger current month
      const currentMonth = currentDate.getMonth();
      // get lastMonth
      let lastMonth;
      // if currentMonth==0 take month of 12
      if (currentMonth === 0) {
        lastMonth = 12;
      } else {
      // else lastMonth= currentMonth - 1
        lastMonth = currentMonth - 1;
      }
      // var numberOfBookingLastMonth represents booking made previous month
      // var numberOfBookingCurrenttMonth represets booking made for this month
      const numberOfBookingLastMonth = data[lastMonth].numberOfBooking;
      const numberOfBookingCurrenttMonth = data[currentMonth].numberOfBooking;
      // calculating the differnce in booking
      const diffInBooking = numberOfBookingCurrenttMonth - numberOfBookingLastMonth;
      // if diffInBooking>0 append the difference and show
      // that it is positive by colouring the icon in green
      if (diffInBooking > 0) {
        $('#diffInBooking').append(diffInBooking);
        $('#statusOrder').append('<i class="fa fa-line-chart fa-2xl" id="dollarIcon"></i>');
      } else if (diffInBooking < 0) {
      // if diffInBooking<0 append the difference and show
      // that it is negative by colouring the icon in red
        $('#diffInBooking').append(Math.abs(diffInBooking));
        $('#statusOrder').append('<i class="fa fa-line-chart fa-2xl" id="downTrendIcon" ></i>');
      } else if (diffInBooking === 0) {
      // if diffInBooking==0 append the difference
      // and show that it is neutral by colouring the icon in grey
        $('#diffInBooking').append(diffInBooking);
        $('#statusOrder').append('<i class="fa fa-line-chart fa-2xl" id="chart"></i>');
      }
    },
    error(xhr, textStatus, errorThrown) {
      console.log(xhr);
      console.log(textStatus);
      console.log(errorThrown);
      // print error
      console.log('Error in Operation');
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
  loadUserDetails();
  loadMonthlyBookingForGraph();
  console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
  getRevenueOfTheMonth();
  console.log('+++++++++++++++++++++++++++++++++');
  diffInConsecutiveMonthBooking();
});
