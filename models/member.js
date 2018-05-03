var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var memberSchema = new Schema({

    info : {
        firstName: String,
        lastName: String,
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
    loacl: { // usẻ local
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
});


module.exports = mongoose.model('Member', memberSchema);