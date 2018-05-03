var express = require('express');
var router = express.Router();
//Require Controller Module
var homeController = require('../controllers/homeController');

/* GET Language English. */
router.get('/en', homeController.lang_en);
/* GET Language Vietnamese. */
router.get('/vi', homeController.lang_vi);
/* GET home page. */
router.get('/', homeController.index);

module.exports = router;
