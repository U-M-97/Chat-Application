const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    
    roomAdmin: {
        type: String
    },
    roomName:{
        type: String
    },
    roomPassword: {
        type: String
    },
    roomMembers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Users"
        } 
    ],
    roomChat: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Users"
            },
            message: {
                type: String
            },
            time: {
                type: String
            }
        }
    ], 
    roomAccess: {
        type: String
    }
})

const Rooms = mongoose.model('Rooms', userSchema)
module.exports = Rooms