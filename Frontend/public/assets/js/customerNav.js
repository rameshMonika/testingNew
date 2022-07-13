/* eslint-disable linebreak-style */
/* eslint-disable no-undef */
// eslint-disable-next-line prefer-const
let userType = localStorage.getItem('customerID');
let admin = localStorage.getItem('AdminID');
$(document).ready(() => {
  $('#nav-menu-item-164906').click(() => {
    window.location.assign('/login');
    window.localStorage.clear();
    
  });

  $('#mobile-menu-item-164246').click(() => {
    window.location.assign('/login');
    window.localStorage.clear();
  
  });
});
if (userType != null) {
  document.getElementById('nav-menu-item-1642909').style.display = 'none';
  document.getElementById('mobile-menu-item-164249').style.display = 'none';
  document.getElementById('nav-menu-item-1642908').style.display = 'none';
  document.getElementById('mobile-menu-item-164248').style.display = 'none';
  document.getElementById('nav-menu-item-164910').style.display = 'none';
  document.getElementById('mobile-menu-item-164245').style.display = 'none';
} else if (admin != null) {
  
  document.getElementById('nav-menu-item-164907').style.display = 'none';
  document.getElementById('mobile-menu-item-164247').style.display = 'none';
  document.getElementById('nav-menu-item-1642909').style.display = 'none';
  document.getElementById('mobile-menu-item-164249').style.display = 'none';
  document.getElementById('nav-menu-item-1642908').style.display = 'none';
  document.getElementById('mobile-menu-item-164248').style.display = 'none';
} else {
  document.getElementById('nav-menu-item-164906').style.display = 'none';
  document.getElementById('mobile-menu-item-164246').style.display = 'none';
  document.getElementById('nav-menu-item-164907').style.display = 'none';
  document.getElementById('mobile-menu-item-164247').style.display = 'none';
  document.getElementById('nav-menu-item-164910').style.display = 'none';
  document.getElementById('mobile-menu-item-164245').style.display = 'none';
}



