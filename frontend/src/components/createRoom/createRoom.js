import React from 'react'
import "./createRoom.css"
import CloseIcon from '@mui/icons-material/Close';
import { useState } from "react"
import axios from 'axios';
import { useSelector } from "react-redux"

const CreateRoom = ({open , onClose}) => {

  const [inputs , setInputs] = useState({
    roomName: "",
    roomPassword: "",
  })

  const [roomAccess, setRoomAccess] = useState("")
  const [toggleRoomName , setToggleRoomName ] = useState(false)
  const [toggleRoomPassword , setToggleRoomPassword ] = useState(false)
  const [toggleRoomAccess , setToggleRoomAccess ] = useState(false)

  const user = useSelector((state) => state.user.currentUser)

  if(open === false){
    return null
  }
  
  const handleChange = (e) => {
    const name = e.target.name
    const value = e.target.value
    setInputs(values => ({
      ...values, [name]:value
    }))
  }

  const handleAccess = (e) => {
    setRoomAccess(e.target.value)
    setToggleRoomAccess(false)
  }

  const handleSubmit = async () => {
    if(inputs.roomName == "" && roomAccess == "public"){
      setToggleRoomName(true)
      setToggleRoomAccess(false)
    }  else if(inputs.roomName != "" && roomAccess == "private" && inputs.roomPassword == ""){
      setToggleRoomPassword(true)
      setToggleRoomName(false)
     
    } else if(inputs.roomName == "" && roomAccess == "private" && inputs.roomPassword != ""){
      setToggleRoomName(true)
      setToggleRoomPassword(false)
    
    } else if(roomAccess == "private" && inputs.roomName == ""){
      setToggleRoomName(true)
    
    } else if(toggleRoomAccess == false && inputs.roomName == ""){
      setToggleRoomName(true)
    } else if(inputs.roomName != "" && roomAccess == ""){
      setToggleRoomAccess(true)
    }
    
    else {
      if(roomAccess == "public"){
        setInputs(values => ({
          ...values, roomPassword:""
        }))
      }
      setToggleRoomName(false)
      setToggleRoomPassword(false)

      console.log("running")
      console.log(inputs)

      const data = {
        roomName: inputs.roomName,
        roomPassword: inputs.roomPassword,
        roomAccess: roomAccess,
        roomAdmin: user.username,
        roomMembers: user._id
      }

      try{
        const res = await axios.post("http://localhost:5000/api/rooms/create" , data)
        console.log(res)
        
      } catch (err) {
        console.log(err)
      }
    }
  }

  console.log(inputs)
  console.log(roomAccess)

  return (
    <>
    <div className='overlay'></div>
        <div className='createRoom'>
            <div className='c-header'>
                <CloseIcon onClick={onClose} className="c-closeIcon"/>
            </div>
            <h2>Room Name</h2>
            <input className='c-input' name="roomName" value={inputs.roomName} onChange={handleChange}/>
            {toggleRoomName ? <p className='c-warning'>Please Enter Room Name</p> : null}
           
            <div className='c-radioContainer'>
              <label className='c-radioButtonItem'>
                <input type="checkbox" name='access' value="public" checked={roomAccess == "public" ? true : false} onClick={handleAccess}/>
                Public
              </label>

             
              <label className='c-radioButtonItem'>
                <input type="checkbox" name='access' value="private" checked={roomAccess == "private" ? true : false} onChange={handleAccess}/>
                Private
              </label>
            </div>
            {toggleRoomAccess ? <p className='c-warning'>Please Select Room Access</p> : null}

            {roomAccess == "private" ? <>
              <h2>Room Password</h2>
              <input className='c-input' name="roomPassword" value={inputs.roomPassword} onChange={handleChange}/>
              {toggleRoomPassword ? <p className='c-warning'>Please Enter Room Password</p> : null}
            </> : null}

            <div className='c-buttonContainer'>
             <button className='c-button' onClick={handleSubmit}>Create Room</button> 
            </div>
        </div>
    </>
  )
}

export default CreateRoom