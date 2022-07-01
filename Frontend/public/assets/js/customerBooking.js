/* eslint-disable linebreak-style */
/* eslint-disable no-plusplus */
/* eslint-disable no-console */
/* eslint-disable no-undef */
/* eslint-disable prefer-regex-literals */
/* eslint-disable no-useless-escape */

const frontEndUrl = 'http://localhost:3001';
const backEndUrl = 'http://localhost:5000';
// const frontEndUrl = 'https://moc-fa.herokuapp.com';
// const backEndUrl = 'https://moc-ba.herokuapp.com';
// const CustomerID = localStorage.getItem('customerID');
const tmpToken = JSON.parse(localStorage.getItem('token'));
let estService = 0;
let estRate = 0;
const estAdd = 0;
let estTotal = 0;

function createCard(cardInfo) {
  const card = `
    <div class="col-md-4">
        <div class="card">

            <div id="service${cardInfo.ClassID}" class="container-class"  border-radius: 10px;">
                <h4 style="text-align:center;"><b>${cardInfo.ClassName}</b></h4> 
                <p style="text-align:center;"><b>$${cardInfo.ClassPricing} per hour</b></p>
                <p>Include:</p>
                <p>${cardInfo.ClassDes}</p>
             
                <input type="checkbox" id="classNameButton${cardInfo.ClassID}" value="${cardInfo.ClassName} $${cardInfo.ClassPricing} #${cardInfo.ClassID}" onchange="updatedService" disabled hidden>
    
                <button class="confirm-btn" onclick=updatedService(${cardInfo.ClassID})>
                    Select
                </button>
            </div>
        </div>
     
    </div>
    `;

  return card;
}

function populateBathroomsRooms() {
  const bathroomss = document.getElementById('bathRooms').value;
  document.getElementById('listBathrooms').innerHTML = bathroomss;
  const roomss = document.getElementById('rooms').value;
  document.getElementById('listRooms').innerHTML = roomss;
}

function loadUserDetails() {
  // extract user details from local storage
  const CustomerIDs = localStorage.getItem('customerID');
  console.log(CustomerIDs);
  let userInfo;
  populateBathroomsRooms();
  // call the web service endpoint
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/customerAddBooking/${CustomerIDs}`,
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
          userAddress: user.Address,
          userPostalCode: user.PostalCode,
          userNameInfo: user.FirstName,
        };
      }
      console.log(userInfo.userNameInfo);
      $('#cUserNameInfo').val(userInfo.userNameInfo);
      $('#cAddress').val(userInfo.userAddress);
      $('#cPostalCode').val(userInfo.userPostalCode);
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

// function to display all class of services by card
function populateClass() {
  // call the web service endpoint
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/classOfService/`,
    type: 'GET',
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success(data) {
      console.log('-------- response data --------');
      console.log(data);

      for (let i = 0; i < data.length; i++) {
        const classOfService = data[i];

        // compile the data that the card needs for its creation
        const cardInfo = {
          ClassID: classOfService.ClassID,
          ClassName: classOfService.ClassName,
          ClassPricing: classOfService.ClassPricing,
          ClassDes: classOfService.ClassDes,
        };

        console.log('-------- Card Info data pack --------');
        console.log(cardInfo);

        const newCard = createCard(cardInfo);

        $('#class-container').append(newCard);

        if (i === 0) {
          const serviceID = `#service${cardInfo.ClassID}`;
          $(serviceID).addClass('active');

          const serviceNameID = `classNameButton${cardInfo.ClassID}`;
          const services = document.getElementById(serviceNameID).value;
          const serviceValue = services.substring(0, services.indexOf('#'));

          $('#listServiceInput').val(services);
          document.getElementById('listService').innerHTML = serviceValue;

          estService = cardInfo.ClassPricing * 4;

          // console.log(typeof(estService));
          estTotal += estService;
        }
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

// function to display all packages in a drop down list
function populatePackage() {
  // call the web service endpoint
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/package/`,
    type: 'GET',
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success(data) {
      console.log('-------- response data --------');
      console.log(data);

      for (let i = 0; i < data.length; i++) {
        const packages = data[i];

        if (i === 0) {
          $('#listPackage').html(`${packages.PackageName} (${packages.PackageDes})`);
        }

        // for loop to generate every data from the database and append to the drop down list
        $('#package').append(`<option value="${packages.PackageName} (${packages.PackageDes}) #${packages.PackageID}">${packages.PackageName} (${packages.PackageDes})</option>`);
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

// function to display all rates in a drop down list
function populateRates() {
  // call the web service endpoint
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/rates/`,
    type: 'GET',
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success(data) {
      console.log('-------- response data --------');
      console.log(data);

      for (let i = 0; i < data.length; i++) {
        const rates = data[i];

        if (i === 0) {
          $('#listRates').html(`${rates.RateName}sqft (From S$${rates.RatePrice})`);
          estRate = rates.RatePrice;
          console.log(`HIIIII${typeof (estRate)}`);
          estTotal += estRate;

          console.log(estTotal);
          document.getElementById('estAmount').innerHTML = estTotal;
        }

        // for loop to generate every data from the database and append to the drop down list
        $('#rates').append(`<option value="${rates.RateName}sqft (From S$${rates.RatePrice}) #${rates.RatesID}">${rates.RateName}sqft (From S$${rates.RatePrice})</option>`);
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

// function to display all extra services in a drop down list
function populateAdditonalService() {
  // call the web service endpoint
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/additionalService/`,
    type: 'GET',
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success(data) {
      console.log('-------- response data --------');
      console.log(data);

      // for loop to generate every data from the database and append to the drop down list
      for (let i = 0; i < data.length; i++) {
        const extraservice = data[i];

        $('#additionalService').append(`<br>${extraservice.ExtraServiceName
        }<input class="col-md-1" id="${i}" type="checkbox" onchange="updatedAddServices(${i})" name="${extraservice.ExtraServiceName}" value="${extraservice.ExtraServiceName} (Additonal S$${extraservice.ExtraServicePrice}   ) #${extraservice.ExtraServiceID}">`
                    + ` (Additonal S$${extraservice.ExtraServicePrice})`);
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

function updatedAmt() {
  document.getElementById('estAmount').innerHTML = estTotal;
}

function updatedService(i) {
  estTotal -= estService;

  $('.container-class').removeClass('active');
  const serviceID = `#service${i}`;
  $(serviceID).addClass('active');

  const serviceNameID = `classNameButton${i}`;
  const services = document.getElementById(serviceNameID).value;
  const servicesValue = services.substring(0, services.indexOf('#'));
  document.getElementById('listService').innerHTML = servicesValue;
  $('#listServiceInput').val(services);
  // get name
  const servicePrice = services.substring((services.indexOf('$') + 1));
  // regex to get amount
  const ratePattern = new RegExp('^\d{1,6}');
  const final = servicePrice.substring(ratePattern, 3);
  estService = parseInt(final, 10) * 4;
  console.log(`hjdfssss${estService}`);

  estTotal += estService;
  // get amoutnt
  updatedAmt();
}

function updatedPackage() {
  const packages = document.getElementById('package').value;
  const packagesValue = packages.substring(0, packages.indexOf('#'));
  document.getElementById('listPackage').innerHTML = packagesValue;
}

function updatedRooms() {
  const roomss = document.getElementById('rooms').value;
  document.getElementById('listRooms').innerHTML = roomss;
}

function updatedBathrooms() {
  const bathroomss = document.getElementById('bathRooms').value;
  document.getElementById('listBathrooms').innerHTML = bathroomss;
}

function updatedRates() {
  estTotal -= estRate;
  const ratess = document.getElementById('rates').value;
  const ratessValue = ratess.substring(0, ratess.indexOf('#'));
  document.getElementById('listRates').innerHTML = ratessValue;
  // substring to get name
  const ratesPrice = ratess.substring((ratess.indexOf('$') + 1));
  // regex to get amount
  const ratePattern = new RegExp('^\d{1,6}');
  const final = ratesPrice.substring(ratePattern, 3);
  estRate = parseInt(final, 10);
  estTotal += estRate;
  // update amunt in receipt
  updatedAmt();
}

function updatedAddServices(i) {
  const additionalServices = document.getElementById(i).value;
  $('#listAddServiceInput').val(additionalServices);
  // substring to get name
  const additionalServicesValue = additionalServices.substring(0, additionalServices.indexOf('#'));
  // regex to get amount
  const currentServices = document.getElementById('listAddService');

  // get rids of the dash if its the only one
  if (currentServices.innerHTML === '-') {
    currentServices.innerHTML = '';
  }

  // if service found, take the current innerHTML, replace it with blank, then set it back
  if (currentServices.innerHTML.indexOf(additionalServicesValue) !== -1) {
    let currentServicesList = currentServices.innerHTML;
    currentServicesList = currentServicesList.replace(additionalServicesValue, '');
    currentServices.innerHTML = currentServicesList;
    // substring to get name
    const addServicePrice = additionalServicesValue.substring((additionalServicesValue.indexOf('$') + 1));
    // regex to get amount
    const addServicePattern = new RegExp('^\d{1,5}(\.\d{0,2})?');
    console.log(addServicePrice);
    const finalprice = addServicePrice.substring(addServicePattern, 5);
    console.log(finalprice);
    const estConvert = parseInt(finalprice, 10);
    console.log(estConvert);
    estTotal -= estConvert;
    console.log(estAdd);
    // update amount in receipt
    updatedAmt();
  } else {
    currentServices.innerHTML += ` ${additionalServicesValue} `;

    const addServicePrice = additionalServicesValue.substring((additionalServicesValue.indexOf('$') + 1));
    const addServicePattern = new RegExp('^\d{1,5}(\.\d{0,2})?');
    console.log(addServicePrice);
    const finalprice = addServicePrice.substring(addServicePattern, 5);
    console.log(finalprice);
    const estConvert = parseInt(finalprice, 10);
    console.log(estConvert);
    estTotal += estConvert;
    console.log(estAdd);
    updatedAmt();
  }

  // adds the dash back if empty again
  if (currentServices.innerHTML === '') {
    currentServices.innerHTML = '-';
  }
}

function incrementR() {
  document.getElementById('rooms').stepUp();
  updatedRooms();
}

function decrementR() {
  document.getElementById('rooms').stepDown();
  updatedRooms();
}

function incrementBR() {
  document.getElementById('bathRooms').stepUp();
  updatedBathrooms();
}

function decrementBR() {
  document.getElementById('bathRooms').stepDown();
  updatedBathrooms();
}

function updatedDate() {
  const date = document.getElementById('startDate').value;
  document.getElementById('listDate').innerHTML = date;
}

function updatedDay1() {
  const day1 = document.getElementById('dayOfService1').value;
  document.getElementById('listDay1').innerHTML = day1;
}

function updatedDay2() {
  const day2 = document.getElementById('dayOfService2').value;
  document.getElementById('listDay2').innerHTML = day2;
}

function updatedTime() {
  const time = document.getElementById('timeOfService').value;
  document.getElementById('listTime').innerHTML = time;
}

$(document).ready(() => {
  // code added start---------------------------------------------
  $('.btn-numberRR').click(function (e) {
    e.preventDefault();

    fieldName = $(this).attr('data-field');
    type = $(this).attr('data-type');
    const input = $(`input[name='${fieldName}']`);
    const currentVal = parseInt(input.val(), 10);
    // eslint-disable-next-line no-restricted-globals
    if (!isNaN(currentVal)) {
      if (type === 'minus') {
        if (currentVal > input.attr('min')) {
          input.val(currentVal - 1).change();
        }
        if (parseInt(input.val(), 10) === input.attr('min')) {
          $(this).attr('disabled', true);
        }
      } else if (type === 'plus') {
        if (currentVal < input.attr('max')) {
          input.val(currentVal + 1).change();
        }
        if (parseInt(input.val(), 10) === input.attr('max')) {
          $(this).attr('disabled', true);
        }
      }
    } else {
      input.val(0);
    }
  });
  $('.input-numberRR').focusin(function () {
    $(this).data('oldValue', $(this).val());
  });
  $('.input-numberRR').change(function () {
    minValue = parseInt($(this).attr('min'), 10);
    maxValue = parseInt($(this).attr('max'), 10);
    valueCurrent = parseInt($(this).val(), 10);

    // eslint-disable-next-line no-restricted-globals
    // eslint-disable-next-line no-global-assign
    names = $(this).attr('name');
    if (valueCurrent >= minValue) {
      $(`.btn-number[data-type='minus'][data-field='${names}']`).removeAttr('disabled');
    } else {
      alert('Sorry, the minimum value was reached');
      $(this).val($(this).data('oldValue'));
    }
    if (valueCurrent <= maxValue) {
      $(`.btn-number[data-type='plus'][data-field='${names}']`).removeAttr('disabled');
    } else {
      alert('Sorry, the maximum value was reached');
      $(this).val($(this).data('oldValue'));
    }
  });
  $('.input-numberBR').keydown((e) => {
    // Allow: backspace, delete, tab, escape, enter and .
    if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 190]) !== -1
    // Allow: Ctrl+A
            || (e.keyCode === 65 && e.ctrlKey === true)
    // Allow: home, end, left, right
            || (e.keyCode >= 35 && e.keyCode <= 39)) {
      // let it happen, don't do anything
      return;
    }
    // Ensure that it is a number and stop the keypress
    if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
      e.preventDefault();
    }
  });
  $('.btn-numberBR').click(function (e) {
    e.preventDefault();

    fieldName = $(this).attr('data-field');
    type = $(this).attr('data-type');
    const input = $(`input[name='${fieldName}']`);
    const currentVal = parseInt(input.val(), 10);
    // eslint-disable-next-line no-restricted-globals
    if (!isNaN(currentVal)) {
      if (type === 'minus') {
        if (currentVal > input.attr('min')) {
          input.val(currentVal - 1).change();
        }
        if (parseInt(input.val(), 10) === input.attr('min')) {
          $(this).attr('disabled', true);
        }
      } else if (type === 'plus') {
        if (currentVal < input.attr('max')) {
          input.val(currentVal + 1).change();
        }
        if (parseInt(input.val(), 10) === input.attr('max')) {
          $(this).attr('disabled', true);
        }
      }
    } else {
      input.val(0);
    }
  });
  $('.input-numberBR').focusin(function () {
    $(this).data('oldValue', $(this).val());
  });
  $('.input-numberBR').change(function () {
    minValue = parseInt($(this).attr('min'), 10);
    maxValue = parseInt($(this).attr('max'), 10);
    valueCurrent = parseInt($(this).val(), 10);

    // eslint-disable-next-line no-restricted-globals
    // eslint-disable-next-line no-global-assign
    names = $(this).attr('name');
    if (valueCurrent >= minValue) {
      $(`.btn-number[data-type='minus'][data-field='${names}']`).removeAttr('disabled');
    } else {
      alert('Sorry, the minimum value was reached');
      $(this).val($(this).data('oldValue'));
    }
    if (valueCurrent <= maxValue) {
      $(`.btn-number[data-type='plus'][data-field='${names}']`).removeAttr('disabled');
    } else {
      alert('Sorry, the maximum value was reached');
      $(this).val($(this).data('oldValue'));
    }
  });
  $('.input-numberBR').keydown((e) => {
    // Allow: backspace, delete, tab, escape, enter and .
    if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 190]) !== -1
    // Allow: Ctrl+A
            || (e.keyCode === 65 && e.ctrlKey === true)
    // Allow: home, end, left, right
            || (e.keyCode >= 35 && e.keyCode <= 39)) {
      // let it happen, don't do anything
      return;
    }
    // Ensure that it is a number and stop the keypress
    if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
      e.preventDefault();
    }
  });
  // code added end ---------------------------------------------
  loadUserDetails();
  populateClass();
  populatePackage();
  populateRates();
  populateAdditonalService();

  incrementR();
  decrementR();
  incrementBR();
  decrementBR();
  updatedTime();
  updatedDay1();
  updatedDay2();
  updatedDate();
  updatedAddServices();
  updatedRates();
  updatedService();
  updatedPackage();
  updatedAmt();
  populateBathroomsRooms();
});

$(document).ready(() => {
  $('#day2').hide();
  $('#day22').hide();

  // confirma contract button
  // Brings contract details to confirmation page
  $('#confirmContract').click(() => {
    // Extracts the respective values and inputs
    // Stores them into their respective constants
    const servicePref = $('#listServiceInput').val();
    const address = $('#cAddress').val();
    const servicePackage = $('#package').val();
    const roooms = $('#rooms').val();
    const bathRooms = $('#bathRooms').val();
    const serviceRates = $('#rates').val();
    const addService = $('#listAddServiceInput').val();
    const contractStart = $('#startDate').val();
    const serviceDay1 = $('#dayOfService1').val();
    const serviceDay2 = $('#dayOfService2').val();
    const serviceTime = $('#timeOfService').val();
    const addInfo = $('#additionalInfo').val();
    const totalCost = $('#estAmount').html();

    // Stores the constants into localstorage
    localStorage.setItem('servicePref', servicePref);
    localStorage.setItem('address', address);
    localStorage.setItem('servicePackage', servicePackage);
    localStorage.setItem('rooms', roooms);
    localStorage.setItem('bathRooms', bathRooms);
    localStorage.setItem('serviceRates', serviceRates);
    localStorage.setItem('addService', addService);
    localStorage.setItem('contractStart', contractStart);
    localStorage.setItem('serviceDay1', serviceDay1);
    localStorage.setItem('serviceDay2', serviceDay2);
    localStorage.setItem('serviceTime', serviceTime);
    localStorage.setItem('addInfo', addInfo);
    localStorage.setItem('totalCost', totalCost);

    // Brings users to the confirmation page
    window.location.replace(`${frontEndUrl}/customer/confirm`);
  });
});

$(document).on('change', '#package', function () {
  if ($(this).val() === 'Sassafras (Twice a week, 8 times a month) #2') {
    $('#day2').show();
    $('#day22').show();
  } else {
    $('#day2').hide();
    $('#day22').hide();
  }
});

// Day drop down function to prevent both having the same day
// Select Elements
const first = document.getElementById('dayOfService1');
const second = document.getElementById('dayOfService2');

// Option Elements
const one = document.getElementById('monday');
const two = document.getElementById('tuesday');
const three = document.getElementById('wednesday');
const four = document.getElementById('thursday');
const five = document.getElementById('friday');
const six = document.getElementById('saturday');
const seven = document.getElementById('sunday');

const one2 = document.getElementById('monday2');
const two2 = document.getElementById('tuesday2');
const three2 = document.getElementById('wednesday2');
const four2 = document.getElementById('thursday2');
const five2 = document.getElementById('friday2');
const six2 = document.getElementById('saturday2');
const seven2 = document.getElementById('sunday2');

// Runs whenever first select has changed
first.onchange = () => {
  // Checks First Selects Value
  if (first.value === 'Mon') {
    one2.hidden = true;
    two2.hidden = false;
    three2.hidden = false;
    four2.hidden = false;
    five2.hidden = false;
    six2.hidden = false;
    seven2.hidden = false;
    updatedDay1();
  } else if (first.value === 'Tue') {
    one2.hidden = false;
    two2.hidden = true;
    three2.hidden = false;
    four2.hidden = false;
    five2.hidden = false;
    six2.hidden = false;
    seven2.hidden = false;
    updatedDay1();
  } else if (first.value === 'Wed') {
    one2.hidden = false;
    two2.hidden = false;
    three2.hidden = true;
    four2.hidden = false;
    five2.hidden = false;
    six2.hidden = false;
    seven2.hidden = false;
    updatedDay1();
  } else if (first.value === 'Thu') {
    one2.hidden = false;
    two2.hidden = false;
    three2.hidden = false;
    four2.hidden = true;
    five2.hidden = false;
    six2.hidden = false;
    seven2.hidden = false;
    updatedDay1();
  } else if (first.value === 'Fri') {
    one2.hidden = false;
    two2.hidden = false;
    three2.hidden = false;
    four2.hidden = false;
    five2.hidden = true;
    six2.hidden = false;
    seven2.hidden = false;
    updatedDay1();
  } else if (first.value === 'Sat') {
    one2.hidden = false;
    two2.hidden = false;
    three2.hidden = false;
    four2.hidden = false;
    five2.hidden = false;
    six2.hidden = true;
    seven2.hidden = false;
    updatedDay1();
  } else if (first.value === 'Sun') {
    one2.hidden = false;
    two2.hidden = false;
    three2.hidden = false;
    four2.hidden = false;
    five2.hidden = false;
    six2.hidden = false;
    seven2.hidden = true;
    updatedDay1();
  }
};

// Runs whenever second select has changed
second.onchange = () => {
  // Checks Second Selects Value
  if (second.value === 'Mon') {
    one.hidden = true;
    two.hidden = false;
    three.hidden = false;
    four.hidden = false;
    five.hidden = false;
    six.hidden = false;
    seven.hidden = false;
    updatedDay2();
  } else if (second.value === 'Tue') {
    one.hidden = false;
    two.hidden = true;
    three.hidden = false;
    four.hidden = false;
    five.hidden = false;
    six.hidden = false;
    seven.hidden = false;
    updatedDay2();
  } else if (second.value === 'Wed') {
    one.hidden = false;
    two.hidden = false;
    three.hidden = true;
    four.hidden = false;
    five.hidden = false;
    six.hidden = false;
    seven.hidden = false;
    updatedDay2();
  } else if (second.value === 'Thu') {
    one.hidden = false;
    two.hidden = false;
    three.hidden = false;
    four.hidden = true;
    five.hidden = false;
    six.hidden = false;
    seven.hidden = false;
    updatedDay2();
  } else if (second.value === 'Fri') {
    one.hidden = false;
    two.hidden = false;
    three.hidden = false;
    four.hidden = false;
    five.hidden = true;
    six.hidden = false;
    seven.hidden = false;
    updatedDay2();
  } else if (second.value === 'Sat') {
    one.hidden = false;
    two.hidden = false;
    three.hidden = false;
    four.hidden = false;
    five.hidden = false;
    six.hidden = true;
    seven.hidden = false;
    updatedDay2();
  } else if (second.value === 'Sun') {
    one.hidden = false;
    two.hidden = false;
    three.hidden = false;
    four.hidden = false;
    five.hidden = false;
    six.hidden = false;
    seven.hidden = true;
    updatedDay2();
  }
};

// cannot select past dates from calendar
const today = new Date().toISOString().split('T')[0];
document.getElementsByName('startDate')[0].setAttribute('min', today);
