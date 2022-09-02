import React from 'react'
import "./joinRoom.css"
import CloseIcon from '@mui/icons-material/Close';
import { useState } from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { roomJoined } from "../../redux/roomSlice"

const JoinRoom = ({open, onClose}) => {

  const [inputs, setInputs] = useState({
    roomName: "",
    roomPassword: ""
  })
  const [toggleRoomName, setToggleRoomName] = useState(false)
  const [toggleRoomPassword, setToggleRoomPassword] = useState(false)
  const [ toggleRoom, setToggleRoom ] = useState(false)
  const user = useSelector((state) => state.user.currentUser)
  const dispatch = useDispatch()

  if(open === false) {
    return null
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setInputs((values) => ({
      ...values, [name]:value
    }))
  }

  const handleSubmit = async () => {
    
    if(inputs.roomName == ""){
      setToggleRoomName(true)
      setToggleRoom(false)
    } else {
      setToggleRoomName(false)
      setToggleRoom(false)
      const data = {
        roomName: inputs.roomName,
        roomPassword: inputs.roomPassword,
        roomMembers: user._id
      }

      console.log(data)
      try{
        const res = await axios.post("http://localhost:5000/api/rooms/join", data)
        console.log(res.data)
        if(res.data == "Room not exists"){
          setToggleRoom(true)
        }
        else if(res.data == "You are already in the room"){
          toast('You are already in the room!', {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            onClose
            });
        } 
        else if(res.data.message == "Room Joined Successfully"){
          console.log(res.data.updatedRoom)
          dispatch(roomJoined(res.data.updatedRoom))
          toast('Room joined Successfully!', {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            onClose
            });
        }
      }catch(err){
        console.log(err)
      }
    }
  }

  const handleClick = () => {
    setInputs({
      roomName: "",
      roomPassword: ""
    })
    onClose()
  }


  return(
    <>
    <div className='overlay'></div>
        <div className='joinRoom'>
            <div className='j-header'>
                <CloseIcon onClick={handleClick} className="j-closeIcon"/>
            </div>
            <h2>Room Name</h2>
            <input name='roomName' value={inputs.roomName} className='j-input' onChange={handleChange}/>
            {toggleRoomName ? <p className='j-warning'>Please Enter Room Name</p> : null }
            {toggleRoom ? <p className='j-warning'>Room not exists</p> : null }
            <h2>Room Password</h2>
            <input name="roomPassword" value={inputs.roomPassword} className='j-input'  onChange={handleChange}/>
            <div className='j-buttonContainer'>
             <button className='j-button' onClick={handleSubmit}>JOIN</button>
            </div>
            <ToastContainer />
        </div>
    </>
   

  )
}

export default JoinRoom