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

      $('#cUserNameInfo').html(userInfo.userNameInfo);
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

  $('#serviceClass').html(servicePrefString);
  $('#address').html(customerAddress);
  $('#postalCode').html(custPostalCode);
  $('#servicePackage').html(servicePackagesString);
  $('#noOfRooms').html(roomNo);
  $('#noOfBath').html(bathRoomNo);
  $('#sizeRatings').html(ratesString);

  if (additionalService === '') {
    $('#extraServices').html('No');
  } else {
    $('#extraServices').html(additionalService);
  }
  $('#startDate').html(contractStartDate);
  $('#serviceDay').html(day1);

  // Check package to display second service date
  if (servicePackagesId === '2') {
    $('#serviceDay2').html(day2);
  } else {
    $('#serviceDay2').html('-');
  }
  $('#serviceTiming').html(time);

  if (additionalInfo === '') {
    $('#additionalInfo').html('-');
  } else {
    $('#additionalInfo').html(additionalInfo);
  }

  if (excludedAdditionalService !== '') {
    additionalInfo += `<br> Exclude Additional Services: ${excludedAdditionalService}`;
    $('#additionalInfo').html(additionalInfo);
  }

  $('#estimatedTotalCost').html(`$ ${totalEstCost}`);
  $('#estimatedTotal').val(totalEstCost);
}

// Customer Auto booking function
function customerAutobooking() {
  // Extracts the value from the inputs and values
  const ServiceClass = $('#serviceClassId').val();
  const ServicePackage = $('#servicePackageId').val();
  const NoOfRooms = $('#noOfRooms').html();
  const NoOfBathrooms = $('#noOfBath').html();
  const Address = $('#address').html();
  const PostalCode = $('#postalCode').html();
  const StartDate = $('#startDate').html();
  const ServiceDay = $('#serviceDay').html();
  const ServiceDay2 = $('#serviceDay2').html();
  const ServiceTiming = $('#serviceTiming').html();
  const SizeRating = $('#sizeRatingsId').val();
  const ExtraServices = $('#extraServices').html();
  const AdditionalInfo = $('#additionalInfo').html();
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
    success(data) {
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
      console.log(data);
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
      $('#errMsgNotificaton').html(errorToast(errMsg)).fadeOut(10000);
      $('#classServiceTableBody').html('');
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
