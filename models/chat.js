const mongoose = require('mongoose')

let Chat = mongoose.Schema(
    {
        from_user : {type: mongoose.Schema.Types.ObjectId, ref: 'Users'},
        // to_user : {type: mongoose.Schema.Types.ObjectId, ref: 'User', default : null},
        // chatIndex: { type: Number, default: 0 },
        groupId : {type: mongoose.Schema.Types.ObjectId, ref: 'Group'},
        messages : {type : String, default:'', trim:true},
        createdAt : { type : Date, default : Date.now() },
        updatedAt : { type : Date, default : Date.now() }
        // type : { type: String, enum : ['group','single'], default : 'single'}
    },
    { timeStamps : true}
)


module.exports = mongoose.model('Chat', Chat );