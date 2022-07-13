/* eslint-disable linebreak-style */
/* eslint-disable no-undef */

const sidebar = document.querySelector('.sidebar');
const sidebarBtn = document.querySelector('.sidebarBtn');

// eslint-disable-next-line func-names
sidebarBtn.onclick = function () {
  sidebar.classList.toggle('active');
};
$(document).ready(() => {
  $('#logout').click(() => {
    window.localStorage.clear();
    window.location.assign('/login');
  });
});
