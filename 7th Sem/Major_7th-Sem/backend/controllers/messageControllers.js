const asyncHandler = require("express-async-handler");
const Message = require("../Models/messageModel");
const Chat = require("../Models/chatModel");
const User = require("../Models/userModel")

const sendMessage = asyncHandler(async (req, res) => {
    const { content, chatId } = req.body

    if(!content || !chatId){
        console.log("Invalid data passed into request");
        return res.sendStatus(400)
    }

    var msgData = {
        sender: req.user._id,
        content: content,
        chat: chatId 
    }

    try {
        
        var msg = await Message.create(msgData)
        msg = await msg.populate("sender", "name pic")
        msg = await msg.populate("chat")
        msg = await User.populate(msg, {
            path: "chat.users",
            select: "name pic email"
        })

        await Chat.findByIdAndUpdate(req.body.chatId , {
            latestMessage: msg
        })

        res.status(201).json(msg)
    } catch (error) {
        res.status(400)
        throw new Error(error.message)
    }
})

const fetchMessage = asyncHandler(async (req, res) => {
    try {
        const msg = await Message.find({ chat: req.params.chatId }).populate("sender", "name pic email")
                    .populate("chat")

        res.status(200).json(msg)
    } catch (error) {
        res.status(404)
        throw new Error(error.message)
    }
})

module.exports = { sendMessage , fetchMessage }