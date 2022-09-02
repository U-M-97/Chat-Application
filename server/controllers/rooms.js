const express = require("express")
const router = express.Router()
const Rooms = require("../models/rooms")

router.post("/create" , async (req, res) => {
    const {roomName, roomPassword, roomAccess, roomAdmin, roomMembers } = req.body
    // console.log(req.body)
    const newRoom = new Rooms({
        roomName: roomName,
        roomPassword: roomPassword,
        roomAccess: roomAccess,
        roomAdmin: roomAdmin,
        roomMembers: roomMembers
    })

    try{
        const room = await newRoom.save()
        // console.log(room)
        res.send(room)
    } catch(err){
        // console.log(err)
    }
})

router.get("/get:id", async (req, res) => {
    const id = req.params.id
    try{
        const rooms = await Rooms.find({$or: [{roomAccess: "public"}, {roomMembers: id}]}).populate("roomMembers").populate("roomChat.user")
        res.send(rooms)
    }catch(err){
        // console.log(err)
    }
   
})

router.post("/join", async (req,res) => {
    const { roomName, roomPassword, roomMembers } = req.body
    try{

        const roomCheck = await Rooms.findOne({roomName})
        if(!roomCheck){
            return(
                // console.log("Room not exists"),
                res.send("Room not exists")
            )
        }
        
        const room = await Rooms.findOne({$and: [{roomName: roomName}, {roomPassword: roomPassword}, {roomMembers: roomMembers}]})
        // // console.log(room)
        if(room){
            return(
                // console.log("You are already in the room"),
                res.send("You are already in the room")
            )
        } else {
            const updatedRoom = await Rooms.findOneAndUpdate({
                $and: [{
                    roomName: roomName, 
                    roomPassword: roomPassword,
                }]},
                {
                    $push: {roomMembers: roomMembers}
                }
            )
            // console.log(updatedRoom)
            res.send({message:"Room Joined Successfully" , updatedRoom})
        }
    }catch(err){
        // console.log(err)
    }
})

router.delete("/delete" , async (req,res) => {
    const room = req.body.room
    const user = req.body.id
    // console.log(room,user)
    try{
        const result = await Rooms.findOneAndUpdate({$and: [{roomName: room.roomName} , {roomPassword: room.roomPassword}]}, {
            $pull: {roomMembers: user}
        })
        // console.log(res)
        res.send({message:"User deleted successfully", result})
    }catch(err){
        // console.log(err)
    }
    
})

router.post("/newChat", async (req,res) => {
    const {room, user, message, time} = req.body
    try{
        const chat = await Rooms.findOneAndUpdate({_id: room._id}, {
            $push: {
                roomChat: {
                   user: user,
                   message: message,
                   time: time
                }
            }
        })
        res.send(chat)
        // console.log(chat)
    }catch(err){
        // console.log(err)
    }
})

router.put("/joinPublicRoom", async (req,res) => {
    const {room, user} = req.body
    try{
        const updatedRoom = await Rooms.findByIdAndUpdate({_id: room},{
            $push: {
                roomMembers: user
            }
        })
        res.send(updatedRoom)
    }catch(err){
        console.log(err)
        res.send(err)
    }
})

module.exports = router