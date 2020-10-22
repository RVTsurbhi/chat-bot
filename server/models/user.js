const mongoose = require('mongoose')
const bcrypt = require('bcrypt');

let UserSchema = mongoose.Schema(
    {
        email : { type : String, default:'', trim:true},
        password : { type : String, default:'', trim:true},
        userName : { type : String, default:'', trim:true},
        profilePic : { type : String, default:''},
        token : { type : String, default:''},
        createdAt : { type : Date, default : Date.now() },
        updatedAt : { type : Date, default : Date.now() }
    }
    // { timeStamps : true}
)

UserSchema.pre('save', function (next) {
	if (this.password && this.password.length <= 50) {
		bcrypt.hash(this.password, 10, (err, hash) => {
			if (err) next(err);
			this.password = hash;
			next();
		});
	} else {
		next();
	}
});

module.exports = mongoose.model('Users', UserSchema );