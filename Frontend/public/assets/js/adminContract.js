/* eslint-disable linebreak-style */
/* eslint-disable no-unused-vars */
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
  window.location.replace(`${frontEndUrl}/unAuthorize`);
}
// Create a new card for Contracts
function createRow(cardInfo) {
  // cardInfo data is place in each respective place
  const card = `
      <tr>
  
        <td>${cardInfo.contractID}</td>
        <td>${cardInfo.FirstName} ${cardInfo.LastName}</td>
        <td>${cardInfo.Package}</td>
        <td>${cardInfo.ClassName}</td>
        <td>${cardInfo.StartDate}</td>
        <td>${cardInfo.TimeOfService}</td>
        <td>${cardInfo.NoOfRooms}</td>
        <td>${cardInfo.NoOfBathrooms}</td>
        <td>${cardInfo.RateName}ft</td>
        <td>${cardInfo.DayOfService1} ${(cardInfo.DayOfService2 === null || cardInfo.DayOfService2 === '-' || cardInfo.DayOfService2 === '') ? ' ' : `, ${cardInfo.DayOfService2}`}</td>
        <td>$${cardInfo.EstimatePricing}</td>
        <td>${cardInfo.Address}</td>

        <td>
        <button type="button" class="btn btn-warning" data-toggle="modal" data-target="#editContractModal" onClick="loadAContract(${cardInfo.contractID})" data-whatever="@mdo"><i class="fa fa-pencil" aria-hidden="true"  disabled></i></button>
    </td>
      </tr>
      `;
  return card;
}
// Create pagination numbering
function pageBtnCreate(totalNumberOfPages) {
  // Remove any pagination
  $('#pagination').html('');
  // for loop to the button based on totalNumberOfPages
  for (i = 1; i <= totalNumberOfPages; i++) {
    divPaginBtn = `<button type="button" onClick="loadAllContractByLimit(${i})">${i}</button>`;
    $('#pagination').append(divPaginBtn);
  }
}
// Load all contracts to allow for pagination numbering
function loadAllContracts() {
  // call the web service endpoint
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/contracts`,
    type: 'GET',
    contentType: 'application/json; charset=utf-8',
    // when successful, divide the number of result by 6 to determine
    // number of pages needed
    success(data) {
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
// Load contracts restricted to 6 row per page
function loadAllContractByLimit(pageNumber) {
  // call the web service endpoint

  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/contracts/${pageNumber}`,
    type: 'GET',
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success(data) {
      if (data != null) {
        $('#contractTableBody').html('');
        // for loop to generate each row of result
        for (let i = 0; i < data.length; i++) {
          const contract = data[i];

          let date = contract.StartDate;
          date = date.replace('T16:00:00.000Z', '');
          // compile the data that the card needs for its creation
          const contractstbl = {
            contractID: contract.ContractId,
            FirstName: contract.FirstName,
            LastName: contract.LastName,
            Package: contract.PackageName,
            ClassName: contract.ClassName,
            StartDate: date,
            TimeOfService: contract.TimeOfService,
            NoOfRooms: contract.NoOfRooms,
            NoOfBathrooms: contract.NoOfBathrooms,
            RateName: contract.RateName,
            EstimatePricing: contract.EstimatedPricing,
            Address: contract.Address,
            DayOfService1: contract.DayOfService,
            DayOfService2: contract.DayOfService2,
          };
          const newRow = createRow(contractstbl);
          $('#contractTableBody').append(newRow);
        }
      }
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
// Load the contract based on contractId
function loadAContract(contractId) {
  // gets a class of service based on id
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/oneContract/${contractId}`,
    type: 'GET',
    contentType: 'application/json; charset=utf-8',
    success(data) {
      // if the code works
      console.log('-------response data------');
      console.log(data);
      console.log(`LENGTH OF DATA:${data.length}`);
      const contractZero = data[0];
      // extract data information
      const RowInfo = {
        contractId: contractZero.ContractID,
        DayOfService: contractZero.DayOfService,
        DayOfService2: contractZero.DayOfService2,
        EstimatedPricing: contractZero.EstimatedPricing,
      };
      console.log('---------Card INfo data pack------------');
      console.log(RowInfo);
      console.log('---------------------');
      // updating extracted values to update pop up
      $('#contract-id-update').val(RowInfo.contractId);
      $('#dayOfService1').val(RowInfo.DayOfService);
      $('#dayOfService2').val(RowInfo.DayOfService2);
      $('#estimatedPricing').val(RowInfo.EstimatedPricing);
      const day2 = document.getElementById('day2');
      // Disable day2 of no day2
      // Might need to change condition to which package selected
      if (RowInfo.DayOfService2 === null || RowInfo.DayOfService2 === '-') {
        day2.style.visibility = 'hidden';
      } else {
        day2.removeAttribute('hidden');
      }
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
// To check Day 1 is not the same as Day 2
function CheckDropDowns(thisSelect) {
  const otherSelectId = (thisSelect.id === 'dayOfService1') ? 'dayOfService2' : 'dayOfService1';
  const otherSelect = document.getElementById(otherSelectId);

  for (i = 0; i < otherSelect.options.length; i++) {
    // otherSelect.options[i].style.display = 'block';
    otherSelect.options[i].removeAttribute('hidden');
    if (otherSelect.options[i].value === thisSelect.value) {
      // otherSelect.options[i].style.display = 'none';
      otherSelect.options[i].setAttribute('hidden', 'hidden');
    }
  }
}

$('#updateContract').click(() => {
  // data extraction
  const contractId = $('#contract-id-update').val();
  const dayOfService1 = $('#dayOfService1').val();
  let dayOfService2 = $('#dayOfService2').val();
  const estimatedPricing = $('#estimatedPricing').val();
  if ($('#day2').is(':hidden')) {
    dayOfService2 = '-';
  }
  // data compilation
  const info = {
    contractId,
    dayOfService1,
    dayOfService2,
    estimatedPricing,
  };

  // call web service endpoint
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/updateContract/${contractId}`,
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
        // loadAllBookingByLimit(1);
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
        text: 'Something Went Wrong',
      }).show();
    },
  });
});

$(document).ready(() => {
  const queryParams = new URLSearchParams(window.location.search);
  console.log('--------Query Params----------');
  console.log(`Query Param (source): ${window.location.search}`);
  console.log(`Query Param (extraction): ${queryParams}`);

  loadAllContractByLimit('1');
  loadAllContracts();
});
