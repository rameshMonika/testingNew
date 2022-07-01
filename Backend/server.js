/* eslint-disable linebreak-style */
/* eslint-disable no-console */

//= ======================================================
//              Imports
//= ======================================================
const app = require('./controller/app');

//= ======================================================
//              Configurations
//= ======================================================
const hostname = '0.0.0.0';
const port = process.env.PORT || 5000;

//= ======================================================
//              Main
//= ======================================================
app.listen(port, hostname, () => {
  console.log(`Server started and is accessible at http://
    ${hostname}:${port}/`);
});
