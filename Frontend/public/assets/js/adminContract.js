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
        <td>$${cardInfo.EstimatePricing}</td>
        <td>${cardInfo.Address}</td>
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

$(document).ready(() => {
  const queryParams = new URLSearchParams(window.location.search);
  console.log('--------Query Params----------');
  console.log(`Query Param (source): ${window.location.search}`);
  console.log(`Query Param (extraction): ${queryParams}`);

  loadAllContractByLimit('1');
  loadAllContracts();
});
