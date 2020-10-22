const Joi = require('joi')

let signUp = Joi.object({
    email : Joi.string().email().required(),
    password : Joi.string().min(8).required(),
    userName : Joi.string().required(),
    profilePic : Joi.string().required()
})

let login = Joi.object({
    email : Joi.string().email().required(),
    password : Joi.string().required()
})

module.exports = {
    signUp,
    login
}