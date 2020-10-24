const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)

let singleMessage = Joi.object({
    // to_user : Joi.objectId().required(),
    messages : Joi.string().min(8).required(),
    type : Joi.string().valid('single').required()
})

let groupMessage = Joi.object({
    groupId : Joi.objectId().required(),
    messages : Joi.string().required(),
    // type : Joi.string().valid('group', 'single').required()
})

let message = Joi.object({
    groupId : Joi.objectId().required(),
    messages : Joi.string().required(),
    // type : Joi.string().valid('group', 'single').required()
})

let group = Joi.object({
    name : Joi.string(),
    members : Joi.array().required(),
    type : Joi.string().valid('group', 'single').required()
})

module.exports = {
    singleMessage,
    groupMessage,
    group,
    message
}