var express = require('express');
var router = express.Router();
// require thư viện thêm chuỗi token vào form
var csrf = require('csurf');
 
var csrfProtected = csrf();

router.use(csrfProtected);

var memberController = require('../controllers/memberController');
/* GET profile. */

router.get('/tai-khoan', memberController.get_profile)
/* GET users listing. */
router.get('/dang-ky', memberController.get_register);

/* Post member register . */
router.post('/dang-ky', memberController.post_register);

module.exports = router;
