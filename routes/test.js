var express = require('express');
var router = express.Router();

var testController = require('../controllers/testController');
router.get('/test', testController.test);

module.exports = router;