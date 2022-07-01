/* eslint-disable linebreak-style */
/* eslint-disable no-plusplus */
/* eslint-disable no-console */
/* eslint-disable no-undef */
/* eslint-disable prefer-regex-literals */
/* eslint-disable no-useless-escape */

const backEndUrl = 'http://localhost:5000';
// const frontEndUrl = 'https://moc-fa.herokuapp.com';
// const backEndUrl = 'https://moc-ba.herokuapp.com';

function createCard(rates) {
  const card = `
  <tr>
  <td
      style="text-align: left;">
      ${rates.RateName} sqft:</td>
  <td>From S$  ${rates.RatePrice}</td>
</tr>
      `;

  return card;
}

function populateRatesMullBerry() {
  // call the web service endpoint
  $.ajax({
    url: `${backEndUrl}/ratesByPackagePublic/1`,
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
          rateName: rates.RateName,
          ratePrice: rates.RatePrice,
        };
        console.log('---------Card INfo data pack------------');
        console.log(RowInfo);
        // calling createRateTable to display values row by row
        const newRow = createCard(rates);
        // appeding row to ratesTable
        $('#mulberry').append(newRow);
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
function populateRatesSaffaras() {
  // call the web service endpoint
  $.ajax({
    url: `${backEndUrl}/ratesByPackagePublic/2`,
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

        console.log('---------Card INfo data pack------------');
        const RowInfo = {
          rateName: rates.RateName,
          ratePrice: rates.RatePrice,
        };
        console.log(RowInfo);
        // calling createRateTable to display values row by row
        const newRow = createCard(rates);
        // appeding row to ratesTable
        $('#Saffaras').append(newRow);
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

$(document).ready(() => {
  populateRatesMullBerry();
  populateRatesSaffaras();
});
