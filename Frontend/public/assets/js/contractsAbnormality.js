/* eslint-disable linebreak-style */
/* eslint-disable no-shadow */
/* eslint-disable no-plusplus */
/* eslint-disable no-undef */
/* eslint-disable no-console */

const frontEndUrl = 'http://localhost:3001';
const backEndUrl = 'http://localhost:5000';
// const frontEndUrl = 'https://moc-fa.herokuapp.com';
// const backEndUrl = 'https://moc-ba.herokuapp.com';
let abnContractNum = '';
let abnormalcontract = '';

const tempAdminID = JSON.parse(localStorage.getItem('AdminID'));
const tmpToken = JSON.parse(localStorage.getItem('token'));
if (tmpToken === null || tempAdminID === null) {
  window.localStorage.clear();
  window.location.replace(`${frontEndUrl}/unAuthorize`);
}
function createRow(cardInfo) {
  const card = `
    <tr>
        <th scope="row">${cardInfo.ContractID}</th>
        <td>${cardInfo.FirstName} ${cardInfo.LastName}</td>
        <td>${cardInfo.Email}</td>
        <td>
            <button type="button" class="cancel-btn" onclick="cancelAbnormalContract(${cardInfo.ContractID})">Cancel</button>
        </td>
    </tr>
  `;
  return card;
}

function loadAllAbnContracts(CustomerID) {
  const CustomerId = parseInt(CustomerID, 10);
  console.log(typeof (CustomerId));

  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/abnormality/contracts/${CustomerId}/${abnContractNum}`,
    type: 'GET',
    contentType: 'application/json; charset=utf-8',

    success(data) {
      console.log(data);
      $('#contract-list').html('');
      for (let i = 0; i < data.length; i++) {
        const contract = data[i];

        const RowInfo = {
          AbnormalityId: contract.ContractAbnId,
          ContractID: contract.ContractID,
          FirstName: contract.FirstName,
          LastName: contract.LastName,
          Email: contract.Email,
        };

        const newCard = createRow(RowInfo);
        $('#contract-list').append(newCard);
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

// eslint-disable-next-line no-unused-vars
function cancelAbnormalContract(id) {
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/cancelAbnContract/${id}`,
    type: 'PUT',
    contentType: 'application/json; charset=utf-8',

    success(data) {
      console.log(data);
      const queryParams = new URLSearchParams(window.location.search);
      const customerID = queryParams.get('id');
      loadAllAbnContracts(customerID);
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

function resolveAbnContracts(id) {
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/abnormalcontracts/${id}`,
    type: 'PUT',
    contentType: 'application/json; charset=utf-8',

    success(data) {
      console.log(data);
      window.location.replace(`${frontEndUrl}/admin/abnormality/contract`);
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

$(document).ready(() => {
  const queryParams = new URLSearchParams(window.location.search);
  const customerID = queryParams.get('id');
  abnormalcontract = queryParams.get('abnContract');
  abnContractNum = queryParams.get('contractnum');

  console.log('--------Query Params----------');
  console.log(`Query Param (source): ${window.location.search}`);
  console.log(`Query Param (extraction): ${queryParams}`);
  loadAllAbnContracts(customerID);

  $('#resolveBtn').click(() => {
    resolveAbnContracts(abnormalcontract);
  });
});
