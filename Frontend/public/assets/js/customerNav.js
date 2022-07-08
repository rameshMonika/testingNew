/* eslint-disable linebreak-style */
/* eslint-disable no-undef */
// eslint-disable-next-line prefer-const
let userType = localStorage.getItem('customerID');
if (userType != null) {
  document.getElementById('nav-menu-item-1642909').style.display = 'none';
  document.getElementById('mobile-menu-item-164249').style.display = 'none';
  document.getElementById('nav-menu-item-1642908').style.display = 'none';
  document.getElementById('mobile-menu-item-164248').style.display = 'none';
} else {
  document.getElementById('nav-menu-item-164906').style.display = 'none';
  document.getElementById('mobile-menu-item-164246').style.display = 'none';
  document.getElementById('nav-menu-item-164907').style.display = 'none';
  document.getElementById('mobile-menu-item-164247').style.display = 'none';
}
$(document).ready(() => {
  $('#nav-menu-item-164906').click(() => {
    window.localStorage.clear();
    window.location.assign('/login');
  });

  $('#mobile-menu-item-164246').click(() => {
    window.localStorage.clear();
    window.location.assign('/login');
  });
});
