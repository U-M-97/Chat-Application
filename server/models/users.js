const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    username:{
        type:String
    },
    password:{
        type:String
    },
    image:{
        type:String,
        default: "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png"
    }

    
})

const Users = mongoose.model('Users', userSchema)
module.exports = Users