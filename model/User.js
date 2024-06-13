const mongoose = require('mongoose')


let userSchema = new mongoose.Schema({
    name:{
        type:String,
    },
    email:{
        type:String,
    }
});
module.exports =  mongoose.model('UserSchema',userSchema);