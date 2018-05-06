var validator = require('express-validator');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var settings = require('./settings');
var Member = require('../models/member');

// xác định người dùng đăng nhập bằng phương thức nào .
var provider = null;

//copy trên trang passport http://www.passportjs.org/docs/configure/
passport.serializeUser(function(user, done) {
    done(null, user._id);
});
  
passport.deserializeUser(function(id, done) {
    Member.findById(id, function(err, member) {
        var newMember = member.toObject();
        newMember['provider'] = provider;
        done(err, newMember);
    });
});

//passport register
//local.register là tên tùy biến có thể đặt 
passport.use('local.register', new LocalStrategy({
    usernameField: 'email', // tên của input dùng đăng nhập
    passwordField: 'password', // tên của input mật khẩu
    passReqToCallback: true
}, function(req, email, password, done) {
    // validater các input từ trang đăng ký 
    console.log('po');
    req.checkBody('firstname', req.__('Please input first name')).notEmpty();
    req.checkBody('lastname', req.__('Please input last name')).notEmpty();
    req.checkBody('email', req.__('Email address invalid, please check again.')).notEmpty().isEmail();
    req.checkBody('password', req.__('password invalid, Password must be at least %d characters or more', settings.passwordLength)).notEmpty().isLength({
        min: settings.passwordLength
    });
    req.checkBody('password', req.__('Confirm password is not the same, please check again')).equals(req.body.rpassword);
    req.checkBody('accept', req.__('You have to accept with our terms to continute')).equals("1");

    var errors = req.validationErrors();
    if(errors) {
        var messages = [];
        errors.forEach(function(error){
            messages.push(error.msg);
        });

        return done(null, false, req.flash('error', messages));
    }

    // check trùng email yêu cầu nhập email mới
    Member.findOne({
        'local.email': email
    }, function(err, member) {
        if(err) {
            return done(err);
        }

        if(member) {
            return done(null, false, {
                messages: req.__('Email address used, please enter another email.')
            })
        }
        var newMember  = new Member();
        newMember.info.firstname = req.body.firstname;
        newMember.info.lastname  = req.body.lastname;
        newMember.local.email    = req.body.email;
        newMember.local.password = newMember.encryptPassword(req.body.password);
        newMember.newsletter     = req.body.newsletter;
        newMember.status         = (settings.confirmRegister == 1) ? 'INACTIVE': 'ACTIVE'; 
        newMember.roles          = 'MEMBER';
        // nếu yêu cầu kích hoạt tài khoản qua eamil thì trạng thái tài kohản là INACTIVE 
        newMember.save(function(err, result) {
            if(err) {
                return done(err);
            } else {
                // nếu yêu cầu kích hoạt tài khoản qua eamil thì chỉ đăng ký mà không tự động đăng nhập
                if(settings.confirmRegister == 1 ) {
                    return done(null, newMember)
                } else {
                    // tự động đăng nhập cho thành viên mới đăng ký khi không yêu cầu kích hoạt tài khoản qua email
                    req.logIn(newMember, function(err){
                        provider = 'local';
                        return done(err, newMember);
                    });
                }
            }
        });
    });
}));