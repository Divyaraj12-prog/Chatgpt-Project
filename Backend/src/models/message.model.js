const mongoose = require('mongoose');

const MsgSchema = new mongoose.Schema({
    user:{
        type:mongoose.Types.ObjectId,
        ref:"users",
    },
     chat:{
        type:mongoose.Types.ObjectId,
        ref:"chats",
    },
    content:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:['user','model','system'],
        default:"user"
    }
},{
    timestamps:true
})

const MsgModel = mongoose.model('Messages',MsgSchema);

module.exports = MsgModel