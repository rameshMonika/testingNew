/* eslint-disable linebreak-style */
/* eslint-disable func-names */
/* eslint-disable no-plusplus */
/* eslint-disable no-undef */
/* eslint-disable no-console */

const frontEndUrl = 'http://localhost:3001';
const backEndUrl = 'http://localhost:5000';
// const frontEndUrl = 'https://moc-fa.herokuapp.com';
// const backEndUrl = 'https://moc-ba.herokuapp.com';
const type = JSON.parse(localStorage.getItem('AdminID'));

if (type === null) {
  window.location.replace(`${frontEndUrl}/unAuthorize`);
}
const tmpToken = JSON.parse(localStorage.getItem('token'));
// errorToast method display the error
function errorToast(msg) {
  // error alert div
  diverror = `
<div class="alert alert-danger alert-dismissible fade show">
<strong>Error!</strong>${msg}
<button type="button" class="btn-close" data-bs-dismiss="alert"></button>
</div>

`;
  // return error alert div
  return diverror;
}

// confirmToast method display confiramtion
function confirmToast(msg) {
  // confiramtion alert div
  divConfirmation = `
<div class="alert alert-success alert-dismissible fade show">
<strong>${msg}</strong>
<button type="button" class="btn-close" data-bs-dismiss="alert"></button>
</div>

`;
  // return confirmation alert div
  return divConfirmation;
}
// createTable method is to create the table rows
function createTable(cardInfo) {
  console.log(cardInfo);
  // card html with values to extract when displaying
  const card = `
  <tr>
  <td>${cardInfo.classId}</td>
  <td>${cardInfo.className}</td>
  <td>$${cardInfo.classPricing}</td>
  <td>${cardInfo.classDes}</td>
  <td>
  <button type="button" class="btn btn-warning" data-toggle="modal" data-target="#EditClassModal" onClick="loadAClassOfService(${cardInfo.classId})" data-whatever="@mdo"><i class="fa fa-pencil" aria-hidden="true"></i></button>
  </td>
  <td> <button type="button" id="deleteClassServiceBtn" class="btn btn-info"  onClick="deleteClassOfService(${cardInfo.classId})"><i class="fa-regular fa-trash-can"></i></button></td>
  </tr>
  `;

  // returning card
  return card;
}

// createExtraServicesTable method is to create the table rows
function createExtraServicesTable(cardInfo) {
  console.log(cardInfo);
  // card html with values to extract when displaying
  const card = `
                  <tr>
                  <td>${cardInfo.extraServiceId}</td>
                  <td>${cardInfo.extraServiceName}</td>
                  <td>$${cardInfo.extraServicePrice}</td>
                  <td>
                  <button type="button" class="btn btn-warning" data-toggle="modal" data-target="#EditExtraServiceModal" onClick="loadAnExtraService(${cardInfo.extraServiceId})" data-whatever="@mdo"><i class="fa fa-pencil" aria-hidden="true"></i></button>
                  </td>
                  <td> <button type="button" id="deleteExtraServiceBtn" class="btn btn-info"  onClick="deleteExtraService(${cardInfo.extraServiceId})"><i class="fa-regular fa-trash-can"></i></button></td>
                  </tr>
                  `;
  // returning card
  return card;
}

// createRateTable method is to create the table rows
function createRateTable(cardInfo) {
  console.log(cardInfo);
  // card html with values to extract when displaying
  const card = `
                  <tr>
                  <td>${cardInfo.ratesId}</td>
                  <td>${cardInfo.rateName}</td>
                  <td>$${cardInfo.ratePrice}</td>
                  <td>${cardInfo.package}</td>
                  <td>
                  <button type="button" class="btn btn-warning" data-toggle="modal" data-target="#EditRateModal" onClick="loadARate(${cardInfo.ratesId})" data-whatever="@mdo"><i class="fa fa-pencil" aria-hidden="true"></i></button>
                  </td>
                  <td> <button type="button" id="deleteRateBtn" class="btn btn-info"  onClick="deleteRate(${cardInfo.ratesId})"><i class="fa-regular fa-trash-can"></i></button></td>
                  </tr>
                  `;
  // returning card
  return card;
}
// loadAllClassOfServices gets all class of services
function loadAllClassOfServices() {
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/classes`,
    type: 'GET',
    contentType: 'application/json; charset=utf-8',
    success(data) {
      console.log('-------response data------');
      console.log(data);
      console.log(`LENGTH OF DATA:${data.length}`);

      for (let i = 0; i < data.length; i++) {
        // assigning variable for classOfService
        const classOfService = data[i];
        // extracting information
        const RowInfo = {
          classId: classOfService.ClassID,
          className: classOfService.ClassName,
          classPricing: classOfService.ClassPricing,
          classDes: classOfService.ClassDes,
        };
        console.log('---------Card INfo data pack------------');
        console.log(RowInfo);
        // calling createTable to display values row by row
        const newRow = createTable(RowInfo);
        // appeding row to classTable
        $('#classServiceTableBody').append(newRow);
      }
    },
    error(xhr, textStatus, errorThrown) {
      if (errorThrown === 'Forbidden') {
        window.location.replace(`${frontEndUrl}/unAuthorize`);
      }
      // print error
      console.log('Error in Operation');
      console.log(xhr);
      console.log(textStatus);
      console.log(errorThrown);
    },
  });
}

// deleteClassOfService method delete class of service
// eslint-disable-next-line no-unused-vars
function deleteClassOfService(id) {
  // call the web service endpoint for deleting class of service by id
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/class/${id}`,
    type: 'DELETE',
    contentType: 'application/json; charset=utf-8',
    // if data inserted
    success(data, textStatus, xhr) {
      // if id in the params not valid show error
      if (xhr.status === 404) {
        // set and call error message
        let errMsg = '';
        errMsg = 'Not valid id';
        $('#errMsgNotificaton').html(errorToast(errMsg)).fadeOut(2500);
        // to refresh
        $('#classServiceTableBody').html('');
        loadAllClassOfServices();
      } else if (xhr.status === 200) {
      // if the params id is valid and
        // set and call confirmation message
        msg = 'Successfully deleted!';

        $('#confirmationMsg').html(confirmToast(`${msg} ${xhr.status}`)).fadeOut(2500);
        // to refresh
        $('#classServiceTableBody').html('');
        loadAllClassOfServices();
      }
    },

    error(xhr, textStatus, errorThrown) {
      // set and call error message
      console.log(xhr);
      console.log(textStatus);
      console.log(errorThrown);
      let errMsg = '';
      if (xhr.status === 500) {
        console.log('error');
        errMsg = 'Server Issues';
      } else {
        errMsg = 'There is some other issues here';
      }
      $('#errMsgNotificaton').html(errorToast(errMsg)).fadeOut(2500);
    },

  });
}

// updateClassOfService method update class of service
// eslint-disable-next-line no-unused-vars
function updateClassOfService() {
  // extarct values from pop-up
  const classId = $('#class-id-update').val();
  const ClassName = $('#class-name-update').val();
  const ClassPricing = $('#class-pricing-update').val();
  const ClassDescription = $('#class-description-update').val();
  // set value to empty after getting value
  $('#class_name_add').val('');
  $('#class_pricing_add').val('');
  $('#class_description__add').val('');

  // put all data inserted into data2 so that it can be used to parse as json data in the api
  const data2 = {
    ClassName,
    ClassPricing,
    ClassDes: ClassDescription,
  };
  // ajax method to call the method
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/class/${classId}`,
    type: 'PUT',
    // data extractex
    data: JSON.stringify(data2),
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success(data) {
      // set and call confirmation message
      console.log(data);
      msg = 'Successfully updated!';
      $('#confirmationMsg').html(confirmToast(msg)).fadeOut(2500);
      // refresh
      $('#classServiceTableBody').html('');
      loadAllClassOfServices();
    },
    error(xhr, textStatus, errorThrown) {
      // set and call error message
      console.log(xhr);
      console.log(textStatus);
      console.log(errorThrown);
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
      loadAllClassOfServices();
      $('#errMsgNotificaton').html(errorToast(errMsg)).fadeOut(2500);
    },
  });
}

// loadAClassOfService gets a class of services
// eslint-disable-next-line no-unused-vars
function loadAClassOfService(id) {
  // gets a class of service based on id
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/classes/${id}`,
    type: 'GET',
    contentType: 'application/json; charset=utf-8',
    success(data) {
      // if the code works
      console.log('-------response data------');
      console.log(data);
      console.log(`LENGTH OF DATA:${data.length}`);
      // extract data information
      const RowInfo = {
        classId: data[0].ClassID,
        className: data[0].ClassName,
        classPricing: data[0].ClassPricing,
        classDescription: data[0].ClassDes,
      };
      console.log('---------Card INfo data pack------------');
      console.log(RowInfo);
      console.log('---------------------');
      // updating extracted values to update pop up
      $('#class-id-update').val(RowInfo.classId);
      $('#class-name-update').val(RowInfo.className);
      $('#class-pricing-update').val(RowInfo.classPricing);
      $('#class-description-update').val(RowInfo.classDescription);
    },
    error(xhr, textStatus, errorThrown) {
      console.log(xhr);
      console.log(textStatus);
      console.log(errorThrown);
      // set and call error message
      errMsg = ' ';
      if (xhr.status === 201) {
        errMsg = "The id doesn't exist ";
      }
      $('#errMsgNotificaton').html(errorToast(errMsg)).fadeOut(2500);
    },
  });
}

// addClassOfService to add new class of service
// eslint-disable-next-line no-unused-vars
function addClassOfService() {
  // extract values for add pop-up
  const name = $('#class_name_add').val();
  const classPricing = $('#class_pricing_add').val();
  const classDescription = $('#class_description__add').val();
  // setting empty string to the fields after adding
  $('#class_name_add').val('');
  $('#class_pricing_add').val('');
  $('#class_description__add').val('');
  // store all extracted info into requestBody
  const requestBody = {
    ClassName: name,
    ClassPricing: classPricing,
    ClassDes: classDescription,
  };
  console.log(`request body: ${requestBody}`);
  // stringify reqBody
  const reqBody = JSON.stringify(requestBody);
  console.log(reqBody);
  // call the method to post data
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/class`,
    type: 'POST',
    data: reqBody,
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success(data) {
      const post = data;
      console.log(post);
      // set and call confirmation message
      $('#classServiceTableBody').html('');
      loadAllClassOfServices();
      msg = 'Successfully added!';
      $('#confirmationMsg').html(confirmToast(msg)).fadeOut(2500);
    },
    error(xhr, textStatus, errorThrown) {
      console.log(xhr);
      console.log(textStatus);
      console.log(errorThrown);
      // set and call error message
      let errMsg = '';
      if (xhr.status === 500) {
        console.log('error');
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
      loadAllClassOfServices();
    },
  });
}

// loadAllExtraServices gets all extra services
function loadAllExtraServices() {
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/extraServices`,
    type: 'GET',
    contentType: 'application/json; charset=utf-8',
    success(data) {
      console.log('-------response data------');
      console.log(data);
      console.log(`LENGTH OF DATA:${data.length}`);

      for (let i = 0; i < data.length; i++) {
        // assigning variable for extraServices
        const extraServices = data[i];
        // extracting information
        const RowInfo = {
          extraServiceId: extraServices.ExtraServiceID,
          extraServiceName: extraServices.ExtraServiceName,
          extraServicePrice: extraServices.ExtraServicePrice,
        };
        console.log('---------Card INfo data pack------------');
        console.log(RowInfo);
        // calling createExtraServicesTable to display values row by row
        const newRow = createExtraServicesTable(RowInfo);
        // appeding row to extraServicesTable
        $('#extraServiceTableBody').append(newRow);
      }
    },
    error(xhr, textStatus, errorThrown) {
      // print error
      console.log(xhr);
      console.log(textStatus);
      console.log(errorThrown);
      console.log('Error in Operation');
    },
  });
}

// loadAnExtraService gets an extra service
// eslint-disable-next-line no-unused-vars
function loadAnExtraService(id) {
  // gets a class of service based on id
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/extraServices/${id}`,
    type: 'GET',
    contentType: 'application/json; charset=utf-8',
    success(data) {
      // if the code works
      console.log('-------response data------');
      console.log(data);
      console.log(`LENGTH OF DATA:${data.length}`);
      // extract data information
      const RowInfo = {
        extraServiceId: data[0].ExtraServiceID,
        extraServiceName: data[0].ExtraServiceName,
        extraServicePrice: data[0].ExtraServicePrice,
      };
      console.log('---------Card INfo data pack------------');
      console.log(RowInfo);
      console.log('---------------------');
      // updating extracted values to update pop up
      $('#extra-service-id-update').val(RowInfo.extraServiceId);
      $('#extra-service-name-update').val(RowInfo.extraServiceName);
      $('#extra-service-pricing-update').val(RowInfo.extraServicePrice);
    },
    error(xhr, textStatus, errorThrown) {
      // set and call error message
      console.log(xhr);
      console.log(textStatus);
      console.log(errorThrown);
      errMsg = ' ';
      if (xhr.status === 201) {
        errMsg = "The id doesn't exist ";
      }
      $('#errMsgNotificaton').html(errorToast(errMsg)).fadeOut(2500);
    },
  });
}

// addExtraService to add new extra service
// eslint-disable-next-line no-unused-vars
function addExtraService() {
  // extract values for add pop-up
  const extraServiceName = $('#extra_service_add').val();
  const extraServicePrice = $('#extra_service_pricing_add').val();

  // setting empty string to the fields after adding
  $('#class_name_add').val('');
  $('#class_pricing_add').val('');
  $('#class_description__add').val('');

  // store all extracted info into requestBody
  const requestBody = {
    ExtraServiceName: extraServiceName,
    ExtraServicePrice: extraServicePrice,
  };
  console.log(`request body: ${requestBody}`);
  // stringify reqBody
  const reqBody = JSON.stringify(requestBody);
  console.log(reqBody);
  // call the method to post data
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/extraService`,
    type: 'POST',
    data: reqBody,
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success(data) {
      // set and call confirmation message
      msg = 'Successfully added!';
      $('#confirmationMsg').html(confirmToast(msg)).fadeOut(2500);
      const post = data;
      console.log(post);
      $('#extraServiceTableBody').html('');
      loadAllExtraServices();
    },
    error(xhr, textStatus, errorThrown) {
      console.log(xhr);
      console.log(textStatus);
      console.log(errorThrown);
      // set and call error message
      let errMsg = '';
      if (xhr.status === 500) {
        console.log('error');
        errMsg = 'Server Issues';
      } else if (xhr.status === 400) {
        errMsg = ' Input not accepted';
      } else if (xhr.status === 406) {
        errMsg = ' Input not accepted';
      } else {
        errMsg = 'There is some other issues here';
      }
      $('#errMsgNotificaton').html(errorToast(errMsg)).fadeOut(10000);
      $('#extraServiceTableBody').html('');
    },
  });
}

// updateExtraService to update existing extra service
// eslint-disable-next-line no-unused-vars
function updateExtraService() {
  // extract values from pop-up
  const extraServiceId = $('#extra-service-id-update').val();
  const extraServiceName = $('#extra-service-name-update').val();
  const extraServicePrice = $('#extra-service-pricing-update').val();

  // set value to empty after getting value
  $('#class_name_add').val('');
  $('#class_pricing_add').val('');

  // put all data inserted into data2 so that it can be used to parse as json data in the api
  const data2 = {
    ExtraServiceName: extraServiceName,
    ExtraServicePrice: extraServicePrice,
  };
  // ajax method to call the method
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/extraService/${extraServiceId}`,
    type: 'PUT',
    // data extracted
    data: JSON.stringify(data2),
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success(data, textStatus, xhr) {
      console.log(data);
      console.log(textStatus);
      console.log(xhr);
      // set and call confirmation message
      msg = 'Successfully updated!';
      $('#confirmationMsg').html(confirmToast(msg)).fadeOut(2500);
      // refresh
      $('#extraServiceTableBody').html('');
      loadAllExtraServices();
    },
    error(xhr, textStatus, errorThrown) {
      // set and call error message
      console.log(xhr);
      console.log(textStatus);
      console.log(errorThrown);
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
      $('#extraServiceTableBody').html('');
      // loadAllClassOfServices()
      // loadAllExtraServices()
      $('#errMsgNotificaton').html(errorToast(errMsg)).fadeOut(2500);
    },
  });
}

// deleteExtraService to delete existing extra service
// eslint-disable-next-line no-unused-vars
function deleteExtraService(id) {
  // call the web service endpoint for deleting class of service by id
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/extraService/${id}`,
    type: 'DELETE',
    contentType: 'application/json; charset=utf-8',
    // if data inserted
    success(data, textStatus, xhr) {
      // if id in the params not valid show error
      if (xhr.status === 404) {
        // set and call error message
        let errMsg = '';
        errMsg = 'Not valid id';
        $('#errMsgNotificaton').html(errorToast(errMsg)).fadeOut(2500);
        // to refresh
        $('#extraServiceTableBody').html('');
      } else if (xhr.status === 200) {
      // if the params id is valid and
        // set and call confirmation message
        msg = 'Successfully deleted!';

        $('#confirmationMsg').html(confirmToast(`${msg} ${xhr.status}`)).fadeOut(2500);
        // to refresh
        $('#extraServiceTableBody').html('');
        loadAllExtraServices();
      }
    },
    error(xhr, textStatus, errorThrown) {
      // set and call error message
      console.log(xhr);
      console.log(textStatus);
      console.log(errorThrown);
      let errMsg = '';
      if (xhr.status === 500) {
        console.log('error');
        errMsg = 'Server Issues';
      } else {
        errMsg = 'There is some other issues here';
      }
      $('#errMsgNotificaton').html(errorToast(errMsg)).fadeOut(2500);
    },
  });
}

// loadAllRates gets all rates
function loadAllRates() {
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/rates`,
    type: 'GET',
    contentType: 'application/json; charset=utf-8',
    success(data, textStatus, xhr) {
      console.log(xhr);
      console.log(textStatus);
      console.log('-------response data------');
      console.log(data);
      console.log(`LENGTH OF DATA:${data.length}`);

      for (let i = 0; i < data.length; i++) {
        // assigning variable for extraServices
        const rates = data[i];
        // extracting information
        const RowInfo = {
          ratesId: rates.RatesID,
          rateName: rates.RateName,
          ratePrice: rates.RatePrice,
          package: rates.PackageName,
        };
        console.log('---------Card INfo data pack------------');
        console.log(RowInfo);
        // calling createRateTable to display values row by row
        const newRow = createRateTable(RowInfo);
        // appeding row to ratesTable
        $('#rateTableBody').append(newRow);
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

// loadARate gets a rate
// eslint-disable-next-line no-unused-vars
function loadARate(id) {
  // gets a class of service based on id
  $.ajax({
    url: `${backEndUrl}/rates/${id}`,
    type: 'GET',
    contentType: 'application/json; charset=utf-8',
    success(data, textStatus, xhr) {
      console.log(xhr);
      console.log(textStatus);

      // if the code works
      console.log('-------response data------');
      console.log(data);
      console.log(`LENGTH OF DATA:${data.length}`);
      // extract data information
      const RowInfo = {
        ratesId: data[0].RatesID,
        rateName: data[0].RateName,
        ratePrice: data[0].RatePrice,
        package: data[0].Package,
      };
      console.log('---------Card INfo data pack------------');
      console.log(RowInfo);
      console.log('---------------------');
      // updating extracted values to update pop up
      $('#rate-id-update').val(RowInfo.ratesId);
      $('#rate-name-update').val(RowInfo.rateName);
      $('#rate-pricing-update').val(RowInfo.ratePrice);
      $('#package-update').val(RowInfo.package);
    },
    error(xhr, textStatus, errorThrown) {
      console.log(xhr);
      console.log(textStatus);
      console.log(errorThrown);
      // set and call error message
      errMsg = ' ';
      if (xhr.status === 201) {
        errMsg = "The id doesn't exist ";
      }
      $('#errMsgNotificaton').html(errorToast(errMsg)).fadeOut(2500);
    },
  });
}

// addRate to add new rate
// eslint-disable-next-line no-unused-vars
function addRate() {
  // extract values for add pop-up
  const rateName = $('#rate_add').val();
  const ratePrice = $('#rate_pricing_add').val();
  const packages = $('#package_add').val();

  // setting empty string to the fields after adding
  $('#class_name_add').val('');
  $('#class_pricing_add').val('');
  $('#class_description__add').val('');

  // store all extracted info into requestBody
  const requestBody = {
    RateName: rateName,
    RatePrice: ratePrice,
    Package: packages,
  };
  console.log(`request body: ${requestBody}`);
  // stringify reqBody
  const reqBody = JSON.stringify(requestBody);
  console.log(reqBody);
  // call the method to post data
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/rate`,
    type: 'POST',
    data: reqBody,
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success(data) {
      $('#rateTableBody').html('');
      loadAllRates();
      // set and call confirmation message

      msg = 'Successfully added!';
      $('#confirmationMsg').html(confirmToast(msg)).fadeOut(2500);
      console.log(data);
    },
    error(xhr, textStatus, errorThrown) {
      console.log(xhr);
      console.log(textStatus);
      console.log(errorThrown);
      // set and call error message
      let errMsg = '';
      if (xhr.status === 500) {
        console.log('error');
        errMsg = 'Server Issues';
      } else if (xhr.status === 400) {
        errMsg = ' Input not accepted';
      } else if (xhr.status === 406) {
        errMsg = ' Input not accepted';
      } else {
        errMsg = 'There is some other issues here';
      }
      $('#errMsgNotificaton').html(errorToast(errMsg)).fadeOut(10000);
      $('#rateTableBody').html('');
    },
  });
}

// updateRate to update existing rate
// eslint-disable-next-line no-unused-vars
function updateRate() {
  // extract values from pop-up
  const rateId = $('#rate-id-update').val();
  const rateName = $('#rate-name-update').val();
  const ratePrice = $('#rate-pricing-update').val();
  const packages = $('#package-update').val();

  // set value to empty after getting value
  $('#class_name_add').val('');
  $('#class_pricing_add').val('');

  // put all data inserted into data2 so that it can be used to parse as json data in the api
  const data2 = {
    RateName: rateName,
    RatePrice: ratePrice,
    Package: packages,
  };
  // ajax method to call the method
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/rate/${rateId}`,
    type: 'PUT',
    // data extracted
    data: JSON.stringify(data2),
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success(data, textStatus, xhr) {
      console.log(data);
      console.log(textStatus);
      console.log(xhr);
      // set and call confirmation message
      msg = 'Successfully updated!';
      $('#confirmationMsg').html(confirmToast(msg)).fadeOut(2500);
      // refresh
      $('#rateTableBody').html('');
      loadAllRates();
      // loadAllClassOfServices()
      // loadAllExtraServices()
    },
    error(xhr, textStatus, errorThrown) {
      console.log(xhr);
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
      $('#rateTableBody').html('');
      // loadAllClassOfServices()
      // loadAllExtraServices()
      $('#errMsgNotificaton').html(errorToast(errMsg)).fadeOut(2500);
    },
  });
}

// deleteRate to delete existing rate
// eslint-disable-next-line no-unused-vars
function deleteRate(id) {
  // call the web service endpoint for deleting class of service by id
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/rate/${id}`,
    type: 'DELETE',
    contentType: 'application/json; charset=utf-8',
    // if data inserted
    success(data, textStatus, xhr) {
      // if id in the params not valid show error
      if (xhr.status === 404) {
        // set and call error message
        let errMsg = '';
        errMsg = 'Not valid id';
        $('#errMsgNotificaton').html(errorToast(errMsg)).fadeOut(2500);
        // to refresh
        $('#rateTableBody').html('');
      } else if (xhr.status === 200) {
      // if the params id is valid and
        // set and call confirmation message
        msg = 'Successfully deleted!';

        $('#confirmationMsg').html(confirmToast(`${msg} ${xhr.status}`)).fadeOut(2500);
        // to refresh
        // to refresh
        $('#rateTableBody').html('');
        loadAllRates();
      }
    },
    error(xhr, textStatus, errorThrown) {
      // set and call error message
      console.log(xhr);
      console.log(textStatus);
      console.log(errorThrown);
      let errMsg = '';
      if (xhr.status === 500) {
        console.log('error');
        errMsg = 'Server Issues';
      } else {
        errMsg = 'There is some other issues here';
      }
      $('#errMsgNotificaton').html(errorToast(errMsg)).fadeOut(2500);
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
  loadAllClassOfServices();
  loadAllExtraServices();
  loadAllRates();
});
