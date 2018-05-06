var mongoose = require('mongoose');
// require modul mã hóa password
var bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema;

var memberSchema = new Schema({

    info : {
        firstname: String,
        lastname: String,
        phone: String,
        company: String,
        address:String,
        cities:[{
            type: Schema.ObjectId,
            ref: 'City'
        }],// store array city_id
        countries:[{
            type: Schema.ObjectId,
            ref: 'Country'
        }],// store array country_id
    },
    local: { // usẻ local
        email:String,
        password:String,
        adminPin:String,
        activeToken: String,
        activeExpires: Date,
        restPasswordToken: String,
        resetPasswordExpires: Date
    },
    facebook:{ // user passport facebook
        id:String,
        token:String,
        email:String,
        name:String,
        photo:String
    },
    google:{ // use passport google
        id:String,
        token:String,
        email:String,
        name:String,
        photo:String
    },
    newsletter:Boolean,
    roles:String, //admin ,mod, member, vip 
    status: String, // active , inactive, suspended
}, {
    timestamps: true
});
// mã hóa mật khẩu 
memberSchema.methods.encryptPassword = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8))
}

//giải mã mật khẩu
memberSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
}

module.exports = mongoose.model('Member', memberSchema);