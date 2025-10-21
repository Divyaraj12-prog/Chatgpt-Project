const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    user:{
        type:mongoose.Types.ObjectId,
        ref:"users",
        required:true
    },
    title:{
        type:String,
        required:true
    },
    lastactivity:{
        type:Date,
        default:Date.now
    }
},
{
    timestamps:true
})

const chatModel = mongoose.model('chat',chatSchema);

module.exports = chatModel;