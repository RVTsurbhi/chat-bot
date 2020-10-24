const mongoose = require('mongoose')

let Group = mongoose.Schema(
    {
        name : {type : String, default: null},
        members : [{type: mongoose.Schema.Types.ObjectId, ref: 'Users'}],
        type : { type: String, enum : ['group','single'], default : 'single'}
    },
    { timeStamps : true}
)


module.exports = mongoose.model('Group', Group);