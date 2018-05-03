var Member = require('../models/member');

// route lang en
exports.lang_en = function(req, res, next) {
    res.cookie('language', 'en', {maxAge: 90000, httpOnly:true});
    res.redirect('back');
}

// route lang vi
exports.lang_vi = function(req, res, next) {
    res.cookie('language', 'vi', {maxAge: 90000, httpOnly:true});
    res.redirect('back');
}
exports.index = function(req, res, next) {
    
    res.render('frontend/home/index', {title: req.__('Demo Website Nodejs')});
}