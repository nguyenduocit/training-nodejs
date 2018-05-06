var passport = require('passport');

exports.get_register = function(req, res, next) {
    var messages = req.flash('error');
    res.render('frontend/member/register', {
        pageTitle: req.__ ('Member Register'),
        csrfToken : req.csrfToken(),
        messages: messages,
        hasErrors: messages.length > 0 
    });
};

// post register
exports.post_register = passport.authenticate('local.register', {
    successRedirect: '/thanh-vien/tai-khoan',
    failureRedirect : '/thanh-vien/dang-ky',
    failureFlash: true
});

// Get profile
exports.get_profile =  function(req, res, next) {
    res.render('frontend/member/dashboard');
}