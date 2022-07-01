/* eslint-disable linebreak-style */
const sidebar = document.querySelector('.sidebar');
const sidebarBtn = document.querySelector('.sidebarBtn');

// eslint-disable-next-line func-names
sidebarBtn.onclick = function () {
  sidebar.classList.toggle('active');
};
