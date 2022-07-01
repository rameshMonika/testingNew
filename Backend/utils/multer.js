/* eslint-disable linebreak-style */
// eslint-disable-next-line linebreak-style
const multer = require('multer');
const path = require('path');

module.exports = multer({
  storage: multer.diskStorage({}),
  // file filter to execpt file types that are pictures alone
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png') {
      cb(new Error('File type not supported'), false);
      return;
    }
    cb(null, true);
  },
});
