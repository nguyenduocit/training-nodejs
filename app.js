var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
// require tạo đa ngôn ngữ
var i18n = require('i18n');
var bodyParser = require('body-parser');
// tao ket noi database
 var mongoose = require('mongoose');
 // require các modul cần thiết cho chắc năng đăng ký
 var session = require('express-session');
 var passport = require('passport');
 var flash = require('connect-flash');
 var validator = require('express-validator');
// config template handlebars 
var expHbs = require('express-handlebars');
var settings = require('./config/settings');
 // tao ket noi database 
var database = require('./config/database');

var index = require('./routes/index');
var routerMember = require('./routes/member');
var test = require('./routes/test');

var app = express();
//
// mongoose connect với db hiện tại
mongoose.connect(database.dbStr);
mongoose.connection.on('error', function(err){
	console.log('Error connect to database: '+ err);
});
// require config passport
require('./config/passport');

// view engine setup
// config template handlebars 
var hbsConfig = expHbs.create({
	helpers: require('./helpers/handlebars.js').helpers,
	layoutsDir: path.join(__dirname, '/templates/'+ settings.defaultTemplate +'/layouts'),
	defaultLayout: path.join(__dirname, '/templates/' + settings.defaultTemplate + '/layouts/layout'),
	partialsDir: path.join(__dirname, '/templates/'+ settings.defaultTemplate +'/partials'),
	extname: '.hbs'
});

app.engine('.hbs', hbsConfig.engine);
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, '/templates/'+ settings.defaultTemplate));
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(validator());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// cấu hình session thuc hien chu nang dang ky
app.use(session({
	secret: settings.security_key,
	resave: false,
	saveUninitialized: true,
	//cookie: {secure:true} phần này thêm khi có https://
}));
// cau hinh thuc hien chuc nang dang ky
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
// khai báo sử dụng đa ngôn ngữ
app.use(function(req, res, next){
	i18n.init(req, res, next);
});

app.use(express.static(path.join(__dirname, 'public')));
// config đa ngôn ngữ
i18n.configure({
	locales:['en', 'vi'],
	register: global,
	fallbacks: {'en': 'vi'},
	cookie:'language', // tên của cookie trên browser 
	queryParameter: 'lang', // đây là parám trên url dùng thay đổi ngôn ngữ
	defaultLocale: 'en', // ngôn ngữ mặc định khi init nó sẽ tự tìm các chuỗi nằm trong hàm __ và __n để tự thêm vào dile json
	directory:__dirname + '/languages',
	directoryPermissions: '775', // thiết lập quyền ghi cho các file ngôn ngữ chỉ dùng cho hệ thống node js trên linux.
	autoReload:true,
	updateFiles : true,
	api:{
		'__':'__',// đây là 2 hàm dùng trong template dịch ngôn ngữ. 
		'__n':'__n'
	}
});

// khai báo để truyền biến 
app.use(function(req, res, next){
	res.locals.clanguage = req.getLocale(); // ngôn ngữ hiện tại
	res.locals.languages = i18n.getLocales(); // danh sách ngôn ngữ khai báo trong phần cấu hình bên trên.
	res.locals.settings = settings;
	next();
});

app.use('/', index);
app.use('/thanh-vien', routerMember);
app.use('/test', test);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handler
app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;
