var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/tin-tuc', function(req, res, next) {
	res.render('tin-tuc', {title:'Tin tuc', noidung : 'noidung tin tuc'});
});

router.get('/fedu.vn', function(req, res, next) {
	var data = { data : ['html', 'css', 'java', 'php']};

	res.render('fedu', {data : data});

});

module.exports = router;
