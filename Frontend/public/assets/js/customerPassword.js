/* eslint-disable linebreak-style */
/* eslint-disable no-unused-vars */
/* eslint-disable func-names */
/* eslint-disable no-undef */
// const frontEndUrl = 'http://localhost:3001';
// const backEndUrl = 'http://localhost:5000';
// const frontEndUrl = 'https://moc-fa.herokuapp.com';
// const backEndUrl = 'https://moc-ba.herokuapp.com';
const frontEndUrl = 'http://54.254.150.51:3001';
const backEndUrl = 'http://54.254.150.51:5000';
const tmpToken = JSON.parse(localStorage.getItem('token'));
if (tmpToken === null) {
  window.location.replace(`${frontEndUrl}/unAuthorize`);
}
const tempCustomerID = JSON.parse(localStorage.getItem('customerID'));
if (tempCustomerID === null) {
  window.localStorage.clear();
  window.location.replace(`${frontEndUrl}/unAuthorize`);
}

$('#changePassword').click(() => {
  // data extraction
  const currentPw = $('#currentPassword').val();
  const newPw = $('#newPassword').val();
  const confirmPw = $('#confirmPassword').val();
  const customerID = localStorage.getItem('customerID');
  // data compilation
  const info = {
    currentPassword: currentPw,
    newPassword: newPw,
    confirmPassword: confirmPw,
  };
    // check if new password is the same as confirm password
  if (newPw === confirmPw) {
    $.ajax({
      headers: { authorization: `Bearer ${tmpToken}` },
      url: `${backEndUrl}/customer/password/${customerID}`,
      type: 'PUT',
      data: JSON.stringify(info),
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      // if
      success(data) {
        if (data.success === true) {
          $.ajax({
            headers: { authorization: `Bearer ${tmpToken}` },
            url: `${backEndUrl}/customer/editPassword/${customerID}`,
            type: 'PUT',
            data: JSON.stringify(info),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            // eslint-disable-next-line no-shadow
            success() {
              new Noty({
                timeout: '5000',
                type: 'success',
                layout: 'topCenter',
                theme: 'sunset',
                text: 'Changed successfully',
              }).show();
            },
            error(xhr) {
              new Noty({
                timeout: '5000',
                type: 'error',
                layout: 'topCenter',
                theme: 'sunset',
                text: xhr.responseText,
              }).show();
            }
          });
        }
      },
      error(xhr, textStatus, errorThrown) {
        console.log('Error in Operation');
        console.log(`XHR: ${JSON.stringify(xhr.responseText)}`);
        console.log(`Textstatus: ${textStatus}`);
        console.log(`Errorthorwn${errorThrown}`);
        new Noty({
          timeout: '5000',
          type: 'error',
          layout: 'topCenter',
          theme: 'sunset',
          text: xhr.responseText,
        }).show();
      },
    });
  } else {
    new Noty({
      timeout: '5000',
      type: 'error',
      layout: 'topCenter',
      theme: 'sunset',
      text: 'Password is not the same',
    }).show();
  }
  // call web service endpoint
});
// select the eye icon related to the current password field
const togglePasswordCurrent = document.querySelector('#togglePasswordCurrentPass');
// select the current password field
const currentPassword = document.querySelector('#currentPassword');
// function to change type of the text filed
togglePasswordCurrent.addEventListener('click', function (e) {
  // toggle the type attribute
  const type = currentPassword.getAttribute('type') === 'password' ? 'text' : 'password';
  currentPassword.setAttribute('type', type);
  // toggle the eye slash icon
  this.classList.toggle('fa-eye-slash');
});

const togglePasswordNew = document.querySelector('#togglePasswordNewPass');
const newPassword = document.querySelector('#newPassword');

togglePasswordNew.addEventListener('click', function (e) {
  // toggle the type attribute
  const type = newPassword.getAttribute('type') === 'password' ? 'text' : 'password';
  newPassword.setAttribute('type', type);
  // toggle the eye slash icon
  this.classList.toggle('fa-eye-slash');
});

const togglePasswordConfirm = document.querySelector('#togglePasswordConfirmPass');
const confirmPassword = document.querySelector('#confirmPassword');

togglePasswordConfirm.addEventListener('click', function (e) {
  // toggle the type attribute
  const type = confirmPassword.getAttribute('type') === 'password' ? 'text' : 'password';
  confirmPassword.setAttribute('type', type);
  // toggle the eye slash icon
  this.classList.toggle('fa-eye-slash');
});
