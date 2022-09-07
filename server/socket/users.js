const users = []

const removeUser = (id) => {
    
    const indexes = []
    for(let i = 0; i < users.length; i++){
        if(users[i].id === id){
            indexes.push(i)
        }
    }

    for(let i = indexes.length - 1; i >= 0; i--){
        users.splice(indexes[i], 1)
    }
    // console.log("after deletion")
    // console.log(users.map((item) => {
    //     return {id: item.id, user: item.user.username, room: item.room.roomName}
    // }))
}

const addUser = (id, user, room) => {
    // console.log(id)
    const existingUser = users.some((item) => {
        if(item.id === id && item.user._id === user._id && item.room._id === room._id){
            return true
        } 
        else if(item.id === id && item.user._id === user._id && item.room._id !== room._id){
            return false
        } 
    })
    // existingUser && console.log("existing user = ",existingUser.id)
    if(existingUser){
        return  {error: "User already present"}
    }
    else if(!existingUser){
        // console.log("running")
        removeUser(id)
    }  
    const newUser = {id, user, room}
    users.push(newUser)
    // console.log("changes to")
    // console.log(users.map((item) => {
    //     return {id: item.id, user: item.user.username, room: item.room.roomName}
    // }))
    return newUser
}

const getUser = (id, room) => {
    // console.log(id)
    // console.log(users.map((item) => {
    //     return {id: item.id, user: item.user.username, room: item.room.roomName}
    // }))
    const user = users.find((item) => {
        return item.id === id && item.room._id === room._id
    })
    user && console.log("user = ",user._id)
    return user
}

const getRoomUsers = (room) => {
    const roomUsers = users.filter((item) => {
        return item.room._id === room._id
    })
    return roomUsers.map((item) => {
        return item.user
    })
}

module.exports = {addUser, getUser, getRoomUsers, removeUser}