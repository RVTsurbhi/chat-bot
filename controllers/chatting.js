/******* Models *********/
const chatModel = require('../models/chat');
const groupModel = require('../models/group');
const userModel = require('../models/user');

/******** Helpers **********/
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const {group, groupMessage, singleMessage, message } = require('../validators/chat');
const responseHelper = require('../helpers/responses');

/************************************/
/*********** Controllers ************/
/************************************/

/* api to create group */
const createGroup = async(req, res, next)=>{
    try{
        let groupForm = await group.validateAsync(req.body)
        groupForm.members.push(req.user._id)
        if(groupForm.type === 'single'){
            let groupData = await groupModel.findOne(groupForm)
            if(groupData){
                throw Error("Chat with this User Already Exist")
            }
        }else {
            if(!groupForm.name){
                throw Error("name is required for creating group.")
            }
        }
        let newGroupData = await new groupModel(groupForm).save()
        responseHelper.data(res, newGroupData, 200, "group created successfully."); 
    }catch(err){
        next(err);
    }
}

/* api to send message */
const sendMessage = async(req, res, next)=>{
    try{
        let chatForm = await message.validateAsync(req.body);
        // if(req.body.type === "group"){
        //     chatForm = await groupMessage.validateAsync(req.body)
        // }else {
        //     chatForm = await singleMessage.validateAsync(req.body)
        // }
        chatForm.from_user = req.user._id
        let chatData = await new chatModel(chatForm).save()
        responseHelper.data(res, chatData, 200, "message sent successfully."); 
    }catch(err){
        next(err);
    }
}

/* api to get conversations */
const getConversation = async(req, res, next)=>{
    try{
        let chatData = await groupModel.aggregate([
            {
                $match: {
                    "members": {
                        "$in": [req.user._id]
                    }
                }
            },
            {
                $lookup: {
                    from: "chats",
                    localField: "_id",
                    foreignField: "groupId",
                    as: "conversations"
                }
            },
            {
                $unwind: {
                    path: `$conversations`,
                    // preserveNullAndEmptyArrays: false
                }
            },
            { $project : 
                {   "groupId" : "$conversations.groupId", 
                    'message':"$conversations.messages", 
                    "createdAt":"$conversations.createdAt", 
                    "sender":"$conversations.from_user",
                    "type": '$$ROOT.type',
                    "members" : '$$ROOT.members',
                    "groupName" : "$$ROOT.name",
                    "groupMembers": {
                        $filter: {
                           input: "$$ROOT.members",
                           as: "item",
                           cond: { $ne : ["$$item" , req.user._id] }
                        }
                    }
                }
            },
            // {
            //     $addFields: {
            //         conversationName: {
            //             $cond: {
            //                 if: {
            //                     $eq: [ "$type", "group" ]  
            //                 },
            //                 then: '$groupName', else:  "username" //{$arrayElemAt: [ "$groupMembers", 0 ]}
            //             }
            //         }
            //     }
            // },
            {
                $group:
                    {
                        _id: "$groupId",
                        createdAt: { $last: "$createdAt" },
                        message : {$last : "$message"}, 
                        sender : {$last : "$sender"},
                        type: {$last : "$type"},
                        groupMembers : {$last : "$groupMembers"},
                        members : {$last : "$members"},
                        groupName : {$last : "$groupName"},
                        // conversationName : {$last : "$conversationName"}
                    }
            },
            { $sort: { "createdAt": -1 } }
        ])
        let chatArr = []
        let resolvedFinalArray = await Promise.all(chatData.map( async (item)=>{
            // let convObj = item.toJSON();
            let strObj = JSON.stringify(item);
            let convObj = JSON.parse(strObj);
            let usersData = await userModel.find({_id : {$in : convObj.groupMembers} }).select('_id, userName , email')
            convObj.chatMembers = usersData
            // if(convObj.type === "single"){
            //     convObj['conversationName'] = convObj.chatMembers[0].userName
            // }else{}
            convObj['conversationName'] = convObj.type === "single" ? convObj.chatMembers[0].userName : convObj.groupName
            delete convObj.groupMembers
            delete convObj.members
            delete convObj.groupName
            chatArr.push(convObj)
        }))
        responseHelper.data(res, chatArr, 200, "conversations"); 
    }catch(err){
        next(err);
    }
}

/* api to get all messages of room */
const getAllMessages = async(req, res, next)=>{
    try{
        let limit = parseInt(req.query.limit) || 30
        if(!req.query.groupId){
            throw Error("group id is required.")
        }
        let messages = await chatModel.aggregate([
            {
                '$match': {
                    'groupId': ObjectId(req.query.groupId)
                }
            },
            {
                $addFields: {
                    sentByMe: {
                        $cond: {
                            if: {
                                $eq: [ "$from_user", req.user._id ]  
                            },
                            then: true, else: false
                        }
                    }
                }
            },
            { $sort: { "createdAt": -1 } },
            { $skip: 0 },
            { $limit: limit }
        ]);
        let finalMessages = messages.reverse()
        let groupData = await groupModel.findOne({_id : req.query.groupId})
        .populate('members', '_id userName email')
        let groupMembers = groupData.members.filter((item)=> item._id.toString() !== req.user._id.toString())
        let conversationName = groupData.type === "group" ? groupData.name : groupMembers[0].userName
        let chatData = {
            chats : finalMessages,
            groupName : conversationName,
            groupMembers : groupData.members
        }
        responseHelper.data(res, chatData, 200, 'messages'); 
    }catch(err){
        next(err);
    }
}

module.exports = {
    createGroup,
    sendMessage,
    getConversation,
    getAllMessages
}