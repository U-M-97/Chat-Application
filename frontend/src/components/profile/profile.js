import React, { useEffect, useState } from 'react'
import "./profile.css"
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { useNavigate } from "react-router-dom"
import { loginSuccess } from '../../redux/userSlice';

const Profile = () => {

  const user = useSelector((state) => state.user.currentUser)
  const [inputs, setInputs] = useState({
    username: "",
    password: ""
  })
  const [file, setFile] = useState()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [toggleInputs, setToggleInputs] = useState(false)

  const getUser = async () => {
    try{
      const res = await axios.get("http://localhost:5000/api/users/getUser" + user._id)
      dispatch(loginSuccess(res.data))
    }catch(err){
      console.log(err)
    }
  }

  const handleInput = (e) => {
    setToggleInputs(false)
    const {name, value} = e.target
    setInputs((values) => ({
      ...values, [name]:value
    }))
  }

  const handleSubmit = async (e) => {
    const data = new FormData()
    console.log(file)
    data.append("file", file)
    data.append("upload_preset", "chat application")
    console.log(data)
    try{
      const res = await axios.post("https://api.cloudinary.com/v1_1/codillionaire/image/upload", data)
      const url = res.data.url
  
      const uploadData = {
        id: user._id,
        url: url
      }
      console.log(uploadData)
      const upload = await axios.post("http://localhost:5000/api/users/updateImage", uploadData)
      console.log(upload)
    }catch(err){
      console.log(err)
    }
  }

  useEffect(() => {
    handleSubmit()
  }, [file])

  const update = async () => {
   
    if(inputs.username == "" && inputs.password == ""){
      setToggleInputs(true)
    }
    else{
      try{
        const data = {
          id: user._id,
          inputs: inputs
        }
  
        const res = await axios.put("http://localhost:5000/api/users/updateUsernameAndPassword", data)
        console.log(res)
        if(res){
          getUser()
          setInputs({
            username:"",
            password:""
          })
        }
      }catch(err){
        console.log(err)
      }
    }
  
    
  }

  return (
    <div className='profile'>
      <div className='p-avatarContainer'>
        <img className="p-avatar" src={user.image}/>
        <input id='imageUpload' type="file" name='image' style={{display:"none"}} onChange={(e) => setFile(e.target.files[0])}/>
        <label for="imageUpload" className='p-cameraContainer'>
          <CameraAltIcon className='p-camera'/>
        </label>    
      </div>
      <h1 className='p-header'>{user.username}</h1>
      
      <div className='p-editItemContainer'>
        <h2>Change Username</h2>
        <input type="text" name='username' value={inputs.username} onChange={handleInput}/>
      </div>

      <div className='p-editItemContainer'>
        <h2>Change Password</h2>
        <input type="text" name='password' value={inputs.password} onChange={handleInput}/>
      </div>

      <div className='p-buttonContainer'>
        <button className='p-backButton' onClick={() => navigate("/home")}>
          <ArrowBackIcon className='p-backButtonIcon'/>
        </button>
        <button className='p-saveButton' onClick={update}>Save</button>
      </div>
      {toggleInputs==true ? <p style={{color: "red", fontWeight:"bold", marginTop:"30px"}}>Please fill the required fields</p> : null}
      
    </div>
  )
}

export default Profile