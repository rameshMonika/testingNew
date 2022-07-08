/* eslint-disable linebreak-style */
/* eslint-disable func-names */
/* eslint-disable no-plusplus */
/* eslint-disable no-undef */
/* eslint-disable no-console */

const frontEndUrl = 'http://localhost:3001';
const backEndUrl = 'http://localhost:5000';
// const frontEndUrl = 'https://moc-fa.herokuapp.com';
// const backEndUrl = 'https://moc-ba.herokuapp.com';

let userSearchChar = [];
const userSearch = document.getElementById('searchEmployee');
const tmpToken = JSON.parse(localStorage.getItem('token'));
const tempAdminID = JSON.parse(localStorage.getItem('AdminID'));
if (tmpToken === null || tempAdminID === null) {
  window.location.replace(`${frontEndUrl}/unAuthorize`);
}
function createRow(cardInfo) {
  console.log(cardInfo);

  const card = `
      <div class="employee-card">
          <div class="employee-id">
              <img src="${cardInfo.EmployeeImgUrl}" alt="">
              <span>${cardInfo.EmployeeName}</span>
          </div>
          <p class="employee-des">${cardInfo.EmployeeDes}</p>
          <div class="employee-links">
              <a href="" data-toggle="modal" data-target="#skillsetsModal" onClick="loadAnEmployee(${cardInfo.EmployeeID})">View Skillsets</a>
              <a href="" data-toggle="modal" data-target="#viewEmpAvailabilityModal" onClick="loadAnEmployee(${cardInfo.EmployeeID})">View Availability</a>
          </div>
          <div class="employee-btn">
              <button type="button" class="edit-btn" data-toggle="modal" data-target="#editModal" onClick="loadAnEmployee(${cardInfo.EmployeeID})">Edit</button>
              <button type="button" class="delete-btn" data-toggle="modal" data-target="#deleteModal" onClick="loadAnEmployee(${cardInfo.EmployeeID})">Delete</button>
          
          </div>
      </div>
`;
  return card;
}

function createSkillRow(cardInfo) {
  const card = `
    <div class="skillsets">
      <div class="skillset-name">
        <i class="fa-solid fa-check"></i>
          <span>${cardInfo}</span>
      </div>
      <i class="fa-solid fa-trash-can" onclick="deleteSkills('${cardInfo}')"></i>
    </div>
  `;
  return card;
}

function pageBtnCreate(totalNumberOfPages, activePage) {
  $('#pagination').html('');
  let maxLeft = (activePage - Math.floor(5 / 2));
  let maxRight = (activePage + Math.floor(5 / 2));

  if (maxLeft < 1) {
    maxLeft = 1;
    maxRight = 5;
  }

  if (maxRight > totalNumberOfPages) {
    maxLeft = totalNumberOfPages - (5 - 1);
    maxRight = totalNumberOfPages;

    if (maxLeft < 1) {
      maxLeft = 1;
    }
  }

  if (activePage !== 1) {
    divPaginBtn = `<button type="button" onClick="loadEmployeeByLimit(${1})"><<</button>`;
    $('#pagination').append(divPaginBtn);
  }

  for (i = maxLeft; i <= maxRight; i++) {
    if (i === activePage) {
      divPaginBtn = `<button type="button" class="active" onClick="loadEmployeeByLimit(${i})">${i}</button>`;
      $('#pagination').append(divPaginBtn);
    } else {
      divPaginBtn = `<button type="button" onClick="loadEmployeeByLimit(${i})">${i}</button>`;
      $('#pagination').append(divPaginBtn);
    }
  }

  if (activePage !== totalNumberOfPages) {
    divPaginBtn = `<button type="button" onClick="loadEmployeeByLimit(${totalNumberOfPages})">>></button>`;
    $('#pagination').append(divPaginBtn);
  }
}

function loadAllEmployees(activePage) {
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/employee`,
    type: 'GET',
    contentType: 'application/json; charset=utf-8',

    success(data) {
      console.log('-------response data------');
      console.log(data);
      console.log(`LENGTH OF DATA:${data.length}`);
      userSearchChar = data;
      const totalNumberOfPages = Math.ceil(data.length / 6);

      pageBtnCreate(totalNumberOfPages, activePage);
    },

    error(xhr, textStatus, errorThrown) {
      if (errorThrown === 'Forbidden') {
        window.location.replace(`${frontEndUrl}/unAuthorize`);
      }
      console.log('Error in Operation');

      console.log(xhr);
      console.log(textStatus);
      console.log(errorThrown);

      console.log(xhr.responseText);
      console.log(xhr.status);
    },
  });
}

function loadEmployeeByLimit(pageNumber) {
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/employee/${pageNumber}`,
    type: 'GET',

    contentType: 'application/json; charset=utf-8',

    success(data) {
      console.log('-------response data------');
      console.log(data);
      console.log(`LENGTH OF DATA:${data.length}`);
      $('#employeeListing').html('');

      for (let i = 0; i < data.length; i++) {
        const employee = data[i];

        const RowInfo = {
          EmployeeID: employee.EmployeeID,
          EmployeeName: employee.EmployeeName,
          EmployeeDes: employee.EmployeeDes,
          EmployeeImgUrl: employee.EmployeeImgUrl,
          Skillsets: employee.Skillsets,
        };

        console.log('---------Card INfo data pack------------');
        console.log(RowInfo);

        const newRow = createRow(RowInfo);
        $('#employeeListing').append(newRow);
      }
      loadAllEmployees(pageNumber);
    },

    error(xhr, textStatus, errorThrown) {
      if (errorThrown === 'Forbidden') {
        window.location.replace(`${frontEndUrl}/unAuthorize`);
      }
      console.log('Error in Operation');

      console.log(xhr);
      console.log(textStatus);
      console.log(errorThrown);

      console.log(xhr.responseText);
      console.log(xhr.status);
    },
  });
}

function loadEmployeeAvailability() {
  const employeeId = $('#availEmployeeID').val();
  const dateExtracted = $('#datepicker').val();

  if (dateExtracted === '') {
    new Noty({
      timeout: '3000',
      type: 'error',
      layout: 'topCenter',
      theme: 'sunset',
      text: 'Date is not Selected!',
    }).show();
    return;
  }

  $.ajax({
    url: `${backEndUrl}/employee/availability/${employeeId}/${dateExtracted}`,
    type: 'GET',
    contentType: 'application/json; charset=utf-8',

    success(data) {
      console.log('-------response data------');
      console.log(data);
      console.log(`LENGTH OF DATA:${data.length}`);
      // $('#availabilityTimeslots').html('');

      if (data.length === 0) {
        // Ensure the color of the timeslot changes
        $('#eightThirtySlot').removeClass('unavailable');
        $('#twelveThirtySlot').removeClass('unavailable');
        $('#eightThirtySlot').removeClass('available');
        $('#twelveThirtySlot').removeClass('available');
        $('#eightThirtySlot').addClass('unavailable');
        $('#twelveThirtySlot').addClass('unavailable');

        new Noty({
          timeout: '3000',
          type: 'error',
          layout: 'topCenter',
          theme: 'sunset',
          text: 'Employee is not available on this date',
        }).show();
      } else {
        for (let i = 0; i < data.length; i++) {
          const employee = data[i];

          const RowInfo = {
            EmployeeID: employee.Employee,
            ScheduleDate: employee.ScheduleDate,
            TimeSlot: employee.TimeSlot,
            ScheduleID: employee.ScheduleID,
          };

          console.log('---------Card INfo data pack------------');
          console.log(RowInfo);

          if (RowInfo.TimeSlot === '08:30:00') {
            // Ensure the color of the timeslot changes
            $('#eightThirtySlot').removeClass('unavailable');
            $('#twelveThirtySlot').removeClass('unavailable');
            $('#eightThirtySlot').removeClass('available');
            $('#twelveThirtySlot').removeClass('available');
            $('#eightThirtySlot').addClass('available');
            $('#twelveThirtySlot').addClass('unavailable');
            new Noty({
              timeout: '3000',
              type: 'success',
              layout: 'topCenter',
              theme: 'sunset',
              text: 'Employee is available at 08:30:00 today!',
            }).show();
          } else {
            // Ensure the color of the timeslot changes
            $('#eightThirtySlot').removeClass('unavailable');
            $('#twelveThirtySlot').removeClass('unavailable');
            $('#eightThirtySlot').removeClass('available');
            $('#twelveThirtySlot').removeClass('available');
            $('#eightThirtySlot').addClass('unavailable');
            $('#twelveThirtySlot').addClass('available');
            new Noty({
              timeout: '3000',
              type: 'success',
              layout: 'topCenter',
              theme: 'sunset',
              text: 'Employee is available at 12:30:00 today!',
            }).show();
          }
        }
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
function loadAnEmployee(id) {
  console.log(id);
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/oneemployee/${id}`,
    type: 'GET',
    contentType: 'application/json; charset=utf-8',

    success(data) {
      console.log('-------response data------');
      console.log(data);
      console.log(`LENGTH OF DATA:${data.length}`);

      const employee = data[0];

      const RowInfo = {
        EmployeeID: employee.EmployeeID,
        Name: employee.EmployeeName,
        Description: employee.EmployeeDes,
        EmployeeImg: employee.EmployeeImgUrl,
        Skillsets: employee.Skillsets,
      };

      const skillsString = RowInfo.Skillsets;
      skillsArray = skillsString.split(',');
      $('#skillsModalContent').html('');

      for (let i = 0; i < skillsArray.length; i++) {
        const newRow = createSkillRow(skillsArray[i]);
        $('#skillsModalContent').append(newRow);
      }

      document.getElementById('NewProfilePreview').style.backgroundImage = `url(${RowInfo.EmployeeImg})`;
      $('#editEmployeeID').val(RowInfo.EmployeeID);
      $('#employeeSkillsID').val(RowInfo.EmployeeID);
      $('#availEmployeeID').val(RowInfo.EmployeeID);
      $('#deleteEmployeeID').val(RowInfo.EmployeeID);
      $('#editEmployeeName').val(RowInfo.Name);
      $('#editEmployeeDes').val(RowInfo.Description);
      $('#editEmployeeSkills').val(RowInfo.Skillsets);
      $('#editProfilePicLink').val(RowInfo.EmployeeImg);
    },

    error(xhr, textStatus, errorThrown) {
      console.log(xhr);
      console.log(textStatus);
      console.log(errorThrown);
      console.log('Error in Operation');

      // if (xhr.status == 201) {
      //     errMsg = "The id doesn't exist "
      // }
    },
  });
}

function updateEmployee() {
  const id = $('#editEmployeeID').val();
  // get value of the image uploaded from input file
  // eslint-disable-next-line camelcase
  const image_edit = document.getElementById('image_edit');

  // get value of the employee name from employee name field
  const employeeName = $('#editEmployeeName').val();
  // get value from employee description field
  const employeeDes = $('#editEmployeeDes').val();
  // get value from skill set field
  const skillSet = $('#editEmployeeSkills').val();
  // Get the initial image url
  const initialImg = $('#NewProfilePreview').css('background-image').replace(/^url\(['"]?/, '').replace(/['"]?\)$/, '');
  console.log(initialImg);
  // create a variable called webFormData and call the FormData
  // instance all field value to be added will be appended to webFormData
  const webFormData = new FormData();
  // webFormData.append method to append employeeName to the key of employeeName
  webFormData.append('employeeName', employeeName);
  // webFormData.append method to append employeeDes to the key of employeeDes
  webFormData.append('employeeDes', employeeDes);
  // webFormData.append method to append skillSet to the key of skillSet
  webFormData.append('skillSet', skillSet);
  // webFormData.append method to append initialImg to the key of initialImg
  webFormData.append('initialImg', initialImg);
  // webFormData.append method to append image.files[0] to the key of image
  // eslint-disable-next-line camelcase
  webFormData.append('image_edit', image_edit.files[0]);
  // ajax fuction to connect to the backend

  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    // url to connect to backend api
    url: `${backEndUrl}/employee/${id}`,
    // method type
    type: 'PUT',
    // setting processData false
    processData: false,
    // setting contentType false
    contentType: false,
    // setting cache false
    cache: false,
    // pass webForm data as data
    data: webFormData,
    // pass enctype as multipart/formdata
    enctype: 'multipart/form-data',
    // success method
    success(data, textStatus, xhr) {
      console.log(xhr);
      console.log(textStatus);
      console.log(data);
      // set value to empty after getting value
      $('#editEmployeeName').val('');
      $('#editEmployeeDes').val('');
      $('#editEmployeeSkills').val('');
      document.getElementById('image_edit').value = '';

      // succcess message return
      if (xhr.status === 201) {
        msg = 'Successfully added!';
        new Noty({
          timeout: '3000',
          type: 'success',
          layout: 'topCenter',
          theme: 'sunset',
          text: msg,
        }).show();
        $('#employeeListing').html('');
        loadEmployeeByLimit(1);
      }
    },
    // error method
    error(xhr, textStatus, errorThrown) {
      console.log('Error in Operation');
      console.log(xhr);
      console.log(textStatus);
      console.log(errorThrown);
      console.log(xhr.responseText);
      console.log(xhr.status);
      // error message return
      if (xhr.status === 500) {
        let errMsg = '';
        errMsg = 'Server Error';
        new Noty({
          timeout: '3000',
          type: 'error',
          layout: 'topCenter',
          theme: 'sunset',
          text: errMsg,
        }).show();
      }
    },
  });
}

function updateSkills(skills) {
  const id = $('#employeeSkillsID').val();
  const EmployeeSkills = skills.toString();

  const extractedData = {
    EmployeeSkills,
  };

  // ajax fuction to connect to the backend
  $.ajax({
    url: `${backEndUrl}/employees/skills/${id}`,
    type: 'PUT',
    contentType: 'application/json; charset=utf-8',
    data: JSON.stringify(extractedData),

    // success method
    success() {
      $('#skillsModalContent').html('');
      $('#newSkillsInput').val('');
      for (let x = 0; x < skillsArray.length; x++) {
        const newRow = createSkillRow(skillsArray[x]);
        $('#skillsModalContent').append(newRow);
      }

      new Noty({
        timeout: '3000',
        type: 'success',
        layout: 'topCenter',
        theme: 'sunset',
        text: 'Skills list is updated!',
      }).show();
    },
    // error method
    error(xhr, textStatus, errorThrown) {
      const msg = 'Skills list not Updated';
      new Noty({
        timeout: '3000',
        type: 'error',
        layout: 'topCenter',
        theme: 'sunset',
        text: msg,
      }).show();
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
function deleteSkills(skill) {
  for (let i = 0; i < skillsArray.length; i++) {
    if (skillsArray[i] === skill) {
      skillsArray.splice(i, 1);
      i--;
    }
  }

  updateSkills(skillsArray);
}

function deleteEmployee(id) {
  // call the web service endpoint for deleting class of service by id
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    url: `${backEndUrl}/employee/${id}`,
    type: 'DELETE',
    contentType: 'application/json; charset=utf-8',
    // if data inserted
    success(data, textStatus, xhr) {
      $('#employeeListing').html('');
      loadEmployeeByLimit(1);
      // if id in the params not valid show error
      if (xhr.status === 404) {
        // set and call error message
        // eslint-disable-next-line no-use-before-define
        errMsg = 'Not valid id';
        // eslint-disable-next-line vars-on-top
        let errMsg = '';
        new Noty({
          timeout: '3000',
          type: 'error',
          layout: 'topCenter',
          theme: 'sunset',
          text: errMsg,
        }).show();
        $('#employeeListing').html('');
        loadEmployeeByLimit(1);
      } else if (xhr.status === 200) {
        // if the params id is valid and
        // set and call confirmation message
        msg = 'Successfully deleted!';
        new Noty({
          timeout: '3000',
          type: 'success',
          layout: 'topCenter',
          theme: 'sunset',
          text: msg,
        }).show();
      }
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
      } else {
        errMsg = 'There is some other issues here';
      }
      new Noty({
        timeout: '3000',
        type: 'error',
        layout: 'topCenter',
        theme: 'sunset',
        text: errMsg,
      }).show();
    },

  });
}

function levenshtein(a, b) {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  const matrix = [];

  // increment along the first column of each row
  let i;
  for (i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  // increment each column in the first row
  let j;
  for (j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  // Fill in the rest of the matrix
  for (i = 1; i <= b.length; i++) {
    for (j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          Math.min(
            matrix[i][j - 1] + 1, // insertion
            matrix[i - 1][j] + 1, // deletion
          ),
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

userSearch.addEventListener('keyup', (e) => {
  let RowInfo = {};
  const similarResults = [];
  const searchString = e.target.value.toLowerCase();
  console.log(searchString);
  $('#pagination').html('');

  if (searchString === '') {
    console.log('if');
    $('#employeeListing').html('');
    loadEmployeeByLimit(1);
  }

  // eslint-disable-next-line arrow-body-style
  const filterUsers = userSearchChar.filter((user) => {
    return (
      user.EmployeeName.toLowerCase().includes(searchString)
    );
  });

  $('#similarSearch').html('');
  $('#employeeListing').html('');
  if (filterUsers.length !== 0) {
    for (let i = 0; i < filterUsers.length; i++) {
      const employee = filterUsers[i];

      // compile the data that the card needs for its creation
      RowInfo = {
        EmployeeID: employee.EmployeeID,
        EmployeeName: employee.EmployeeName,
        EmployeeDes: employee.EmployeeDes,
        EmployeeImg: employee.EmployeeImgUrl,
        Skillsets: employee.Skillsets,
      };

      const newCard = createRow(RowInfo);
      $('#employeeListing').append(newCard);
    }
  } else {
    for (let i = 0; i < userSearchChar.length; i++) {
      const compared = userSearchChar[i].EmployeeName;
      const distance = levenshtein(searchString, compared.toLowerCase()); // Levenshtein Distance
      const employee = userSearchChar[i];

      // compile the data that the card needs for its creation
      RowInfo = {
        EmployeeID: employee.EmployeeID,
        EmployeeName: employee.EmployeeName,
        EmployeeDes: employee.EmployeeDes,
        EmployeeImg: employee.EmployeeImgUrl,
        Skillsets: employee.Skillsets,
      };

      if (distance <= 4) {
        similarResults.push(RowInfo);
      }
    }

    for (let j = 0; j < similarResults.length; j++) {
      const newCard = createRow(similarResults[j]);
      $('#employeeListing').append(newCard);
    }
    $('#similarSearch').html(`<p><b>${searchString}</b> not found, do you mean...</p><br>`);
  }
});

$(document).ready(() => {
  const queryParams = new URLSearchParams(window.location.search);
  console.log('--------Query Params----------');
  console.log(`Query Param (source): ${window.location.search}`);
  console.log(`Query Param (extraction): ${queryParams}`);

  loadEmployeeByLimit(1);

  // update button
  $('#editEmployeeBtn').click(() => {
    updateEmployee();
  });

  // Get employee Availability date button
  $('#employeAvailBtn').click(() => {
    loadEmployeeAvailability();
  });

  // Open add skillsets input
  $('#addSkillsInputBtn').click(() => {
    $('.addEmployeeSkills').toggleClass('active');
  });

  // add skillsets button
  $('#addSkillsBtn').click(() => {
    const newSkill = $('#newSkillsInput').val();
    skillsArray.push(newSkill);

    updateSkills(skillsArray);
  });

  // delete button
  $('#deleteEmployeeBtn').click(() => {
    const employeeID = $('#deleteEmployeeID').val();
    deleteEmployee(employeeID);
  });
});

// function to add Employee
// eslint-disable-next-line no-unused-vars
function addEmployee() {
  // get value of the image uploaded from input file
  const image = document.getElementById('image');
  // get value of the employee name from employee name field
  const employeeName = $('#addEmployeeName').val();
  // get value from employee description field
  const employeeDes = $('#addEmployeeDes').val();
  // get value from skill set field
  const skillSet = $('#addEmployeeSkills').val();
  // create a variable called webFormData and call the FormData
  // instance all field value to be added will be appended to webFormData
  const webFormData = new FormData();
  // webFormData.append method to append employeeName to the key of employeeName
  webFormData.append('employeeName', employeeName);
  // webFormData.append method to append employeeDes to the key of employeeDes
  webFormData.append('employeeDes', employeeDes);
  // webFormData.append method to append skillSet to the key of skillSet
  webFormData.append('skillSet', skillSet);
  // webFormData.append method to append image.files[0] to the key of image
  webFormData.append('image', image.files[0]);
  // ajax fuction to connect to the backend
  $.ajax({
    headers: { authorization: `Bearer ${tmpToken}` },
    // url to connect to backend api
    url: `${backEndUrl}/adddEmployee`,
    // method type
    type: 'POST',
    // setting processData false
    processData: false,
    // setting contentType false
    contentType: false,
    // setting cache false
    cache: false,
    // pass webForm data as data
    data: webFormData,
    // pass enctype as multipart/formdata
    enctype: 'multipart/form-data',
    // success method
    success(data, textStatus, xhr) {
      console.log(xhr);
      console.log(textStatus);
      console.log(data);
      // set value to empty after getting value
      $('#addEmployeeName').val('');
      $('#addEmployeeDes').val('');
      $('#addEmployeeSkills').val('');
      document.getElementById('image').value = '';
      // succcess message return
      if (xhr.status === 201) {
        $('#employeeListing').html('');
        loadEmployeeByLimit(1);
        msg = 'Successfully added!';
        new Noty({
          timeout: '3000',
          type: 'success',
          layout: 'topCenter',
          theme: 'sunset',
          text: msg,
        }).show();
      }
    },
    // error method
    error(xhr, textStatus, errorThrown) {
      console.log('Error in Operation');
      console.log(xhr);
      console.log(textStatus);
      console.log(errorThrown);
      console.log(xhr.responseText);
      console.log(xhr.status);
      // error message return
      if (xhr.status === 500) {
        let errMsg = '';
        errMsg = 'Server Error';
        new Noty({
          timeout: '3000',
          type: 'error',
          layout: 'topCenter',
          theme: 'sunset',
          text: errMsg,
        }).show();
      }
    },
  });
}

function readURL(input) {
  if (input.files && input.files[0]) {
    const reader = new FileReader();

    reader.onload = function (e) {
      // $('#blah').attr('src', e.target.result);
      document.getElementById('ppPreview').style.backgroundImage = `url( ${e.target.result})`;
    };

    reader.readAsDataURL(input.files[0]);
  }
}

$('#image').change(function () {
  readURL(this);
});

function readNewURL(input) {
  if (input.files && input.files[0]) {
    const reader = new FileReader();

    reader.onload = function (e) {
      // $('#blah').attr('src', e.target.result);
      document.getElementById('NewProfilePreview').style.backgroundImage = `url( ${e.target.result})`;
    };

    reader.readAsDataURL(input.files[0]);
  }
}

$('#image_edit').change(function () {
  readNewURL(this);
});
