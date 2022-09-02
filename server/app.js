const express = require("express")
const app = express()
app.use(express.json({limit: '50mb'}))
const port = 5000
const mongoose = require("mongoose")
const DB = "mongodb+srv://admin:admin@cluster0.dmavh.mongodb.net/Chat-App?retryWrites=true&w=majority"
const authentication = require("./controllers/authentication")
const cors = require("cors")
app.use(cors())
const rooms = require("./controllers/rooms")

app.use("/api/users", authentication)
app.use("/api/rooms", rooms)

mongoose.connect(DB, {
    useNewUrlParser: true
}).then(()=>{
    console.log("Connection Successfull")
}).catch((err)=>{
    console.log(err)
})

app.listen(port, () => {
    console.log("Server is running on port " + port)
})

// Socket Server Setup 

const {addUser, getUser, getRoomUsers, removeUser} = require("./socket/users")

const io = require("socket.io")(4000, {
    cors: {
        origin: "http://localhost:3000"
    }
})

io.on("connection", (socket) => {
    console.log("User Connected")

    socket.on("joinRoom", ({user,selectedRoom}) => {
        
        const newUser = addUser(socket.id, user, selectedRoom)
        // console.log(newUser.error)
        if(newUser.error){
            return newUser.error
        }
        // console.log(newUser.user.username)

        socket.broadcast.to(newUser.room).emit("message", {
            user: newUser.user.username,
            message: "Joined the chat"
        })

        socket.join(newUser.room._id)

        io.to(newUser.room._id).emit("roomData", {
            room: newUser.room,
            users: getRoomUsers(newUser.room),  
        })

        // console.log(io.sockets.adapter.rooms) 
    })

    socket.on("leaveRoom", (previousRoom) => {
        // console.log("previous Room = ",previousRoom._id)
        socket.leave(previousRoom._id)
    })

    socket.on("newChat", ({chatMessage, selectedRoom, time}) => {
        const isUser = getUser(socket.id,selectedRoom)
        isUser && console.log(isUser.id, isUser.user.username, isUser.room.roomName, chatMessage)
        // console.log(io.sockets.adapter.rooms) 
        
        isUser && io.to(isUser.room._id).emit("message", {
            user: isUser.user,
            message: chatMessage,
            time: time
        })

        isUser && io.to(isUser.room._id).emit("roomData", {
            room: isUser.room,
            users: getRoomUsers(isUser.room)
        })
    })

    socket.on("disconnect", () => {
        console.log("user Disconnected")
        removeUser(socket.id)
    })
})


