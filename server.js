// Load required packages
var express = require('express');
var bodyParser = require('body-parser');
var fileController = require('./controllers/file');

var config = require('config');
// Create our Express application
var app = express();

// Use the body-parser package in our application
app.use(bodyParser.urlencoded({
  extended: true
}));

// Create our Express router
var router = express.Router();

// Create endpoint handlers for /files
router.route('/files')
  .post(fileController.uploadFile)
  .get(fileController.getFile);


router.route('/listFiles')
  .get(fileController.listFiles);

router.route('/deleteFile')
  .delete(fileController.deleteFile);


// Register all our routes with /api
app.use('/api', router);

// Start the server
app.listen(3000);

module.exports = app; 