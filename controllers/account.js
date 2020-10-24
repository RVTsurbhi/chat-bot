/******* Models *********/
const UserModel = require('../models/user');

/****** 3rd party modules *******/
const bcrypt = require('bcrypt');

/******** Helpers **********/
const { signUp, login } = require('../validators/account');
const jwtHelpers = require('../helpers/jwtHelper');
const responseHelper = require('../helpers/responses');

/************************************/
/*********** Controllers ************/
/************************************/

/* Register user */
const userSignup = async(req, res, next)=>{
    try{
        let userForm = await signUp.validateAsync(req.body)
        let userInfo = await UserModel.findOne({ email : userForm.email})
        if(userInfo){
            throw Error("Email Already exist");
        }else {
            let userData = await new UserModel(req.body).save()
            let token = await jwtHelpers.genrateToken(userData);
            
            userData.token = token
            userData.save()

            let data = {
                token : token
                // user : userData
            }
            responseHelper.data(res, data, 200, "Account created successfully.");
        } 
    }catch(err){
        next(err);
    }
}

/* user Login */
const userLogin = async(req, res, next)=>{
    try{
        let userForm = await login.validateAsync(req.body)
        let userCriteria = await UserModel.findOne({ email : userForm.email })
        if(!userCriteria){
            throw Error("Invalid Account");
        }
        const passwordMatch = await bcrypt.compare(userForm.password, userCriteria.password);
        if (!passwordMatch) {
            throw Error("Invalid credentials");
        }
        //generate token
        let token = await jwtHelpers.genrateToken(userCriteria);
        userCriteria.token = token
        userCriteria.save()
        
        let data = {
            token : token
            // user : userCriteria
        }
        responseHelper.data(res, data, 200, "user successfully login");
    }catch(err){
        next(err)
    }
}

module.exports = {
    userSignup,
    userLogin
}