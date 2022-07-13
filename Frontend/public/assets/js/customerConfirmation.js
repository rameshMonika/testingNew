/* eslint-disable linebreak-style */
/* eslint-disable no-plusplus */
/* eslint-disable no-undef */

const frontEndUrl = 'http://localhost:3001';
const backEndUrl = 'http://localhost:5000';
// const frontEndUrl = 'https://moc-fa.herokuapp.com';
// const backEndUrl = 'https://moc-ba.herokuapp.com';
const CustomerID = localStorage.getItem('customerID');
const tmpToken = JSON.parse(localStorage.getItem('token'));
if (tmpToken === null) {
  window.location.replace(`${frontEndUrl}/unAuthorize`);
}
const tempCustomerID = JSON.parse(localStorage.getItem('customerID'));
if (tempCustomerID === null) {
  window.localStorage.clear();
  window.location.replace(`${frontEndUrl}/unAuthorize`);
}
function loadUserDetails(id) {
  let userInfo;
  // call the web service endpoint
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/customerAddBooking/${id}`,
    type: 'GET',
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success(data) {
      for (let i = 0; i < data.length; i++) {
        const user = data[i];

        // compile the data that the card needs for its creation
        userInfo = {
          userNameInfo: user.FirstName,
        };
      }
      $('#cUserNameInfo').text(userInfo.userNameInfo);
    },
  });
}

// Function will fill up the confirm card
function fillUpConfirmationCard() {
  // Retrieves the necessary details from the localstorage
  // Stores the values into their respective contant variables
  const servicePreference = localStorage.getItem('servicePref');
  const customerAddress = localStorage.getItem('address');
  const servicePackages = localStorage.getItem('servicePackage');
  const roomNo = localStorage.getItem('rooms');
  const bathRoomNo = localStorage.getItem('bathRooms');
  const rates = localStorage.getItem('serviceRates');
  const additionalService = localStorage.getItem('addService');
  const excludedAdditionalService = localStorage.getItem('excludedAddService');
  const contractStartDate = localStorage.getItem('contractStart');
  const day1 = localStorage.getItem('serviceDay1');
  const day2 = localStorage.getItem('serviceDay2');
  const time = localStorage.getItem('serviceTime');
  let additionalInfo = localStorage.getItem('addInfo');
  const totalEstCost = localStorage.getItem('totalCost');
  const custPostalCode = localStorage.getItem('postalCode');

  // Some of the values will need to seperate
  // To get the value and its id
  const servicePrefId = servicePreference.substring(servicePreference.indexOf('#') + 1);
  const ratesId = rates.substring(rates.indexOf('#') + 1);
  const servicePackagesId = servicePackages.substring(servicePackages.indexOf('#') + 1);

  const servicePrefString = servicePreference.substring(0, servicePreference.indexOf('#'));
  const ratesString = rates.substring(0, rates.indexOf('#'));
  const servicePackagesString = servicePackages.substring(0, servicePackages.indexOf('#'));

  // Fills their respective inputs
  $('#serviceClassId').val(servicePrefId);
  $('#servicePackageId').val(servicePackagesId);
  $('#sizeRatingsId').val(ratesId);

  $('#serviceClass').text(servicePrefString);
  $('#address').text(customerAddress);
  $('#postalCode').text(custPostalCode);
  $('#servicePackage').text(servicePackagesString);
  $('#noOfRooms').text(roomNo);
  $('#noOfBath').text(bathRoomNo);
  $('#sizeRatings').text(ratesString);

  if (additionalService === '') {
    $('#extraServices').text('No');
  } else {
    $('#extraServices').text(additionalService);
  }
  $('#startDate').text(contractStartDate);
  $('#serviceDay').text(day1);

  // Check package to display second service date
  if (servicePackagesId === '2') {
    $('#serviceDay2').text(day2);
  } else {
    $('#serviceDay2').text('-');
  }
  $('#serviceTiming').text(time);

  if (additionalInfo === '') {
    $('#additionalInfo').text('-');
  } else {
    $('#additionalInfo').text(additionalInfo);
  }

  if (excludedAdditionalService !== '') {
    additionalInfo += `Exclude Additional Services: ${excludedAdditionalService}`;
    $('#additionalInfo').text(additionalInfo);
  }

  $('#estimatedTotalCost').text(`$ ${totalEstCost}`);
  $('#estimatedTotal').val(totalEstCost);
}

// Customer Auto booking function
function customerAutobooking() {
  // Extracts the value from the inputs and values
  const ServiceClass = $('#serviceClassId').val();
  const ServicePackage = $('#servicePackageId').val();
  const NoOfRooms = $('#noOfRooms').text();
  const NoOfBathrooms = $('#noOfBath').text();
  const Address = $('#address').text();
  const PostalCode = $('#postalCode').text();
  const StartDate = $('#startDate').text();
  const ServiceDay = $('#serviceDay').text();
  const ServiceDay2 = $('#serviceDay2').text();
  const ServiceTiming = $('#serviceTiming').text();
  const SizeRating = $('#sizeRatingsId').val();
  const ExtraServices = $('#extraServices').text();
  const AdditionalInfo = $('#additionalInfo').text();
  const EstimatedTotal = $('#estimatedTotal').val();

  // Compiles the extracted values into an object
  const requestBody = {
    customer: CustomerID,
    StartDate,
    Package: ServicePackage,
    DayOfService: ServiceDay,
    DayOfService2: ServiceDay2,
    TimeOfService: ServiceTiming,
    EstimatedPricing: EstimatedTotal,
    ExtraNotes: AdditionalInfo,
    NoOfRooms,
    NoOfBathrooms,
    Address,
    Class: ServiceClass,
    Rate: SizeRating,
    ExtraService: ExtraServices,
    PostalCode,
  };

  // Stringifies object
  const reqBody = JSON.stringify(requestBody);

  // Ajax function to call web service function
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/customer/autobooking`,
    type: 'POST',
    data: reqBody,
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success() {
      // If successful remove localstorage items
      localStorage.removeItem('servicePref');
      localStorage.removeItem('address');
      localStorage.removeItem('servicePackage');
      localStorage.removeItem('rooms');
      localStorage.removeItem('bathRooms');
      localStorage.removeItem('serviceRates');
      localStorage.removeItem('addService');
      localStorage.removeItem('serviceDay1');
      localStorage.removeItem('serviceDay2');
      localStorage.removeItem('serviceTime');
      localStorage.removeItem('addInfo');
      localStorage.removeItem('totalCost');
      localStorage.removeItem('postalCode');
      // Brings customer to the possible list of helpers
      window.location.replace(`${frontEndUrl}/customer/helpers`);
    },
    error(xhr) {
      // set and call error message
      let errMsg = '';
      if (xhr.status === 500) {
        errMsg = 'Server Issues';
      } else if (xhr.status === 400) {
        errMsg = ' Input not accepted';
      } else if (xhr.status === 406) {
        errMsg = ' Input not accepted';
      } else {
        errMsg = 'There is some other issues here';
      }
      new Noty({
        timeout: '3000',
        type: 'error',
        layout: 'topCenter',
        theme: 'sunset',
        text: errMsg,
      }).show();
    },
  });
}

$(document).ready(() => {
  fillUpConfirmationCard();
  loadUserDetails(CustomerID);

  // Confirm button to trigger customer auto-booking
  $('#confirmBookingBtn').click(() => {
    customerAutobooking();
  });
});
