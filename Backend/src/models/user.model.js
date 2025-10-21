const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    fullname:{
        firstname:{
            type:String,
            required:true
        },lastname:{
            type:String,
            required:true
        }
    },
    password:{
        type:String
    }
},{
    timestamps:true
})

const UserModel = mongoose.model('users',UserSchema);

module.exports = UserModel;