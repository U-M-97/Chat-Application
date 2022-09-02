const express = require("express")
const router = express.Router()
const User = require("../models/users")

router.post("/register", async (req,res) => {
    const {username, password} = req.body
    const newUser = new User({
        username:username,
        password:password
    })
    
    try{
        const checkUsername = await User.findOne({
            username
        })
        console.log(username)
        if(checkUsername){
            return res.send("Username already exists"),
            console.log("Username already exists")
        } else {
            const user = await newUser.save()
            res.json(user)
            console.log(user)
        }
        
    }catch (err){
        res.json(err)
        console.log(err)
    }
})

router.post("/login", async (req,res) => {
    const {username, password} = req.body
    const user = await User.findOne({
        username
    })

    if(!user){
        return console.log("User not exists"),
        res.send("User not exists")
    }

    if(user.password != password){
        return console.log("Invalid Credentials"),
        res.send("Invalid Credentials")
    }

    console.log("Login Successfull")
    res.json(user)
})

router.post("/updateImage", async (req,res) => {
    const {id, url} = req.body
    console.log(id, url)
    try{
        const uploadedImage = await User.findByIdAndUpdate(id, {image:url})   
        res.send(uploadedImage)
    }catch(err){
        console.log(err)
    }
})

router.put("/updateUsernameAndPassword", async (req,res) => {
    const {id, inputs} = req.body
    const {username, password} = inputs
    try{
        if(username != "" && password == ""){
            const update = await User.findByIdAndUpdate(id, {username:username})
            res.send(update)
        }
        else if(username == "" && password != ""){
            const update = await User.findByIdAndUpdate(id, {password:password})
            res.send(update)
        }else{
            const update = await User.findByIdAndUpdate(id, {username:username, password:password})
            res.send(update)
        }
        
    }catch(err){
        console.log(err)
    }
})

router.get("/getUser:id", async (req,res) => {
    const id = req.params.id
    try{
        const user = await User.findById(id)
        res.send(user)
    }catch(err){
        console.log(err)
    }
})


module.exports = router