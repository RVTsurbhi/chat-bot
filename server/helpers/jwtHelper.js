const Jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_EXPIRE } = process.env

/******* To generate token ********/
const genrateToken = (user)=>{
    try{
        let payload = {
            id : user._id,
            email : user.email,
            userName : user.userName,
            role : user.role
        }
        let token = Jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRE });
        return token;
    }catch(err){
        return err
    }
};

/******** Decode Jwt Token */
const decodeToken = (token)=>{
    try{
        let decoded = Jwt.verify(token, JWT_SECRET);
        return decoded;
    }catch(err){
        return err;
    }
};

module.exports = {
    genrateToken,
    decodeToken
}