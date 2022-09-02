import React from 'react'
import "./home.css"
import logo from "../../images/logo.jpg"
import SendIcon from '@mui/icons-material/Send';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import PeopleIcon from '@mui/icons-material/People';
import { useSelector , useDispatch } from 'react-redux';
import { useState, useEffect, useRef } from "react"
import JoinRoom from '../joinRoom/joinRoom';
import CreateRoom from "../createRoom/createRoom"
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { io } from "socket.io-client"
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import { useNavigate } from "react-router-dom";
import { loginSuccess } from '../../redux/userSlice';

const Home = () => {

  const user = useSelector((state) => state.user.currentUser)
  const joinedRoom = useSelector((state) => state.room.room)
  const [createRoom , setCreateRoom] = useState(false)
  const [joinRoom , setJoinRoom] = useState(false)
  const dispatch = useDispatch()
  const [inputs , setInputs] = useState()
  const [selectedRoom, setSelectedRoom] = useState()
  const [nameRoom , setNameRoom ] = useState()
  const [chatMessage , setChatMessage] = useState("")
  const [toggleChatMessage, setToggleChatMessage] = useState(false)
  const [liveMessage, setLiveMessage] = useState()
  const [onlineUsers, setOnlineUsers] = useState([])
  const [previousRoom, setPreviousRoom] = useState(false)
  const scroll = useRef()
  const socket = useRef()
  const [time, setTime] = useState()
  const [mouseEnter, setMouseEnter] = useState(false)
  const [isClicked, setIsClicked] = useState(false)
  const navigate = useNavigate()
  const [join, setJoin] = useState()

  const calculateTime = () => {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    const date = new Date()
    const month = monthNames[date.getMonth()]
    const day = date.getDate()
    let hours = date.getHours()
    let minutes = date.getMinutes()
    if(minutes < 10){
      minutes = minutes.toString().padStart(1,"0")
    }
    let seconds = date.getSeconds()
    if(seconds < 10){
      seconds = seconds.toString().padStart(2,"0")
    }
    let period
    if(hours < 13){
      period = "AM"
    }else{
      hours = hours - 12
      period = "PM"
    }
    console.log("seconds = ",seconds)
    const strOfTime = day + " " + month + " " + "At" + " " + hours + ":" + minutes + ":" + seconds + " " + period
    console.log(strOfTime)
    setTime(strOfTime)
  }

  const getUser = async () => {
    try{
      const res = await axios.get("http://localhost:5000/api/users/getUser" + user._id)
      dispatch(loginSuccess(res.data))
    }catch(err){
      console.log(err)
    }
  }

  const getRooms = async () => {
    try{
      const res = await axios.get("http://localhost:5000/api/rooms/get" + user._id)
      setInputs(res.data)
    } catch(err){
      console.log(err)
    }
  }

  useEffect(() => {
    socket.current = io("ws://localhost:4000")
    socket.current.on("connect" , () => {
      console.log(socket.current.id)
    })
    getUser()
    getRooms()

    socket.current.on("message", (data) => {
      console.log(inputs)
      setLiveMessage(data)
    })

    socket.current.on("roomData", (data) => {
      console.log(data)
    })

    return () => {
      socket.current.disconnect()
      socket.current.off()
    }
  }, [])

  useEffect(() => {
    if(inputs){
      if(inputs.length !== 0){
        if(selectedRoom == null){
          setSelectedRoom(inputs[0])
          setNameRoom(inputs[0].roomName)
        }
        else{
          inputs.map((input) => {
            if(input._id === selectedRoom._id){
              setSelectedRoom(input)
            }
          })
        } 
      } 
  }
}, [inputs])

  const handleClick = async (e) => {
    getRooms()
    console.log(e)
    console.log(selectedRoom)
      if(e._id !== selectedRoom._id){
        console.log("running")
        setPreviousRoom(selectedRoom)
        setSelectedRoom(e)
        setNameRoom(e.roomName)
      }
  }

  useEffect(() => {

    liveMessage && selectedRoom && setSelectedRoom((current) => {
      return {
        ...current, roomChat:[
          ...current.roomChat, liveMessage
        ]
      }
    })

    console.log("inputs = " , inputs)
  }, [liveMessage])

  useEffect(() => {

    if(selectedRoom){
      const userPresent = selectedRoom.roomMembers.find((member) => {
        return member._id == user._id
      })

      if(userPresent){
        setJoin(true)
      }
      else{
        setJoin(false)
      }
    }
    
    console.log("join = " , join)
    previousRoom && socket.current.emit("leaveRoom" , previousRoom)
    selectedRoom && socket.current.emit("joinRoom", {user, selectedRoom})
  }, [selectedRoom])

  const handleChat = (e) => {
    setChatMessage(e.target.value)
  }

  const handleSubmit = async () => {
    if(chatMessage == ""){
      setToggleChatMessage(true)
    } else{
      const data ={
        room: selectedRoom,
        user: user,
        message: chatMessage,
        time: time
      }
  
      try{
        const res = await axios.post("http://localhost:5000/api/rooms/newChat", data)
        setChatMessage("")
        if(res){
          // getRooms()
        }
       
      }catch(err){
        console.log(err)
      }

      socket.current.emit("newChat", {chatMessage, selectedRoom, time})
    }
  }

  useEffect(() => {
    console.log("time = ",time)
    time && handleSubmit() 
  },[time])

  const handleRemove = async (e) => {

    const data = {
      room: selectedRoom,
      id: e._id
    }
    try{
      const res = await axios.delete('http://localhost:5000/api/rooms/delete' , {data})
      if(res.data.message == "User deleted successfully"){
        toast('User deleted Successfully!', {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          });
          getRooms()
      }
    }catch(err){
      console.log(err)
    }
  }

  useEffect(() => {
    console.log("running")
    getRooms() 
  }, [createRoom, joinedRoom])

  useEffect(() => {

    const handleKey = (e) => {
      const element = document.activeElement.id
      console.log(element)
      if(e.key == "Enter"){
        if(element == ""){
          document.getElementById("h-message").focus()
        } else if(element == "h-message"){
          calculateTime()
        }
      }
    }

    scroll.current?.scrollIntoView({behaviour: "smooth"})
    
    document.addEventListener('keydown', handleKey)

    return () => (
      document.removeEventListener('keydown', handleKey)
    )
  }, [handleSubmit])

  useEffect(() => {

  })

  const handleDropDown = () =>{
    setMouseEnter(false)
    setIsClicked(!isClicked)
  }

  useEffect(() => {

    const handleKey = (e) => {
      const element = document.getElementById("dropDown")
      const profileElement = document.getElementById("profileAvatar")
      const inside = element.contains(e.target)
      const insideProfileAvatar = profileElement.contains(e.target)
      console.log(inside)
      if(!inside && !insideProfileAvatar){
        setIsClicked(false)
      }
    }

    document.addEventListener('mousedown', handleKey)

    return () => {
      document.addEventListener('mousedown', handleKey)
    }
  }, [])

  const handleJoin = async () => {
    const data = {
      room: selectedRoom._id,
      user: user
    }

    try{
      const res = await axios.put("http://localhost:5000/api/rooms/joinPublicRoom" , data)
      console.log(res)
      if(res){
        getRooms()
      }
    }catch(err){
      console.log(err)
    }
  }

  return (
    <div className='home'>
        <div className='h-header'>
            <img src={logo} alt='logo' className='h-logo'/>
            <div className='h-profileContainer'>
              <h2 className='h-username'>{user.username}</h2>
              <img id="profileAvatar" className='h-avatar' src={user.image} onMouseEnter={() => setMouseEnter(true)} onClick={handleDropDown} onMouseLeave={() => setMouseEnter(false)}/>
              {console.log(mouseEnter)}
              {mouseEnter === true || isClicked === true ?
                <div id="dropDown" className='h-dropDownMenuBackground' onMouseEnter={() => setMouseEnter(true)} onMouseLeave={() => setMouseEnter(false)}>
                  <div className='h-caretContainer'>
                    <ArrowDropUpIcon className='h-caret'/>
                  </div>
                  <div className='h-dropDownMenu'>
                    <div className='h-dropDownProfileImageContainer'>
                      <img src={user.image} className='h-dropDownAvatar'/>
                      <h1 className='h-dropDownMenuUsername'>{user.username}</h1>
                    </div>
                  
                    <div className='h-dropDownMenuItemsContainer'>
                      <div className='h-dropDownMenuItems' onClick={() => navigate("/profile")}>
                        <AccountCircleIcon className='h-dropDownMenuIcon'/>
                        <span className='h-dropDownMenuLink'>Edit Profile</span>
                      </div>

                      <div className='h-dropDownMenuItems'>
                        <SettingsIcon className='h-dropDownMenuIcon'/>
                        <span className='h-dropDownMenuLink'>Settings</span>
                      </div>

                      <div className='h-dropDownMenuItems'>
                        <LogoutIcon className='h-dropDownMenuIcon'/>
                        <span className='h-dropDownMenuLink'>Logout</span>
                      </div>

                    </div>
                  </div>
              </div> : null
             } 
            </div>       
        </div>

        <div className='h-bottom'>
            <div className='h-roomsContainer'>
              <div className='h-roomHeadingContainer'>
                <h2>Rooms</h2>
                <ChatBubbleOutlineOutlinedIcon className='h-roomChatIcon'/>
              </div>

                <div className='h-roomsOverflow'>
                  <div className='h-roomsItemContainer'>
                    {inputs && inputs.map((input) => {
                      return(
                        <>
                          <label className={input.roomName == nameRoom ? 'h-roomsLabel active' : "h-roomsLabel"} key={input._id} onClick={() => handleClick(input)}>{input.roomName}</label>  
                        </>                      
                      )
                    })}                  
                  </div>
                </div>
                
                <div className='h-buttonsContainer'>
                  <button onClick={() => setJoinRoom(true)}>Join Room</button>
                  <JoinRoom open={joinRoom} onClose={() => setJoinRoom(false)}/>
                  <button onClick={() => setCreateRoom(true)}>Create Room</button>
                  <CreateRoom open={createRoom} onClose={() => setCreateRoom(false)}/>
                </div>

            </div>

            <div className='h-chatContainer'>
              <div className='h-chatMessagesContainer'> 

                  {selectedRoom && selectedRoom.roomChat.map((chat) => {
                    return(
                      <>
                         {chat.user._id == user._id ? 
                            <div ref={scroll} className='h-chatItemContainerOutgoing'>
                              <div className='h-picLabelContainer'>
                                <img src={chat.user.image} alt="profile" className='h-chatProfileImage'/>
                                <label className='h-usernameLabel' key={chat._id}>{chat.user.username}</label>
                              </div>
                              <div className='h-messageAndTimeContainer'>
                                <p className='h-messagePara'>{chat.message}</p>
                                <p className='h-timePara'>{chat.time}</p>
                              </div> 
                                              
                            </div> 
                            :
                            <div ref={scroll} className='h-chatItemContainerIncoming'>
                               <div className='h-picLabelContainer'>
                                <img src={chat.user.image} alt="profile" className='h-chatProfileImage'/>
                                <label className='h-usernameLabel' key={chat._id}>{chat.user.username}</label>
                              </div> 
                              <div className='h-messageAndTimeContainer'>
                                <p className='h-messagePara'>{chat.message}</p>
                                <p className='h-timePara'>{chat.time}</p>
                              </div> 
                            </div>
                        }
                      </>
                    )
                  })}
              </div>

              {join === false ?
                <div className='h-joinButtonContainer'>
                  <button className='h-joinButton' onClick={handleJoin}>Join Room</button>
                </div> 
                :    
                <div className='h-chatSendContainer'>
                  <input id="h-message" placeholder='Write Something' value={chatMessage} onChange={handleChat}/>
                  <div className='h-chatIconContainer'  onClick={calculateTime}>
                  <SendIcon id="h-icon" className='h-chatIcon'/>
                  </div>
                </div>
              }
            </div>

            <div className='h-membersContainer'>
              <div className='h-membersContainerMargin'>
                <div className='h-membersTopContainer'>
                  <div className='h-membersHeading'>
                    <h2>Members</h2>
                    <PeopleIcon className='h-peopleIcon'/>
                  </div>

                  <div className='h-membersAdminContainer'>
                    <h3>Admin:</h3>
                    {selectedRoom &&  <label>{selectedRoom.roomAdmin}</label>}
                  </div>
                </div>
                
                
                <div className='membersOverflow'>
                    {selectedRoom && selectedRoom.roomMembers.map((member) => {
                      return(
                        <>
                        <div className='h-membersLabelContainer'>
                          <label className='h-membersLabel' key={member._id}>{member.username}</label>
                          {user.username == selectedRoom.roomAdmin && user.username != member.username ?  <PersonRemoveIcon className='h-personRemoveIcon' onClick={() => handleRemove(member)}/> : null}
                        </div>
                            {/* <ToastContainer /> */}
                        </>
                      
                      )
                    })}
                </div>

              </div>
            </div>
        </div>
    </div>
  )
}

export default Home