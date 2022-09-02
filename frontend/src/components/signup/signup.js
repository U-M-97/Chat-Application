import React from 'react'
import "./signup.css"
import logo from "../../images/logo.jpg"
import { useState, useEffect } from 'react'
import axios from "axios"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";

const Signup = () => {

  const [toggleUsername, setToggleUsername] = useState(false)
  const [togglePassword, setTogglePassword] = useState(false)
  const [usernameExists, setUsernameExists] = useState(false)
  const [inputs, setInputs ] = useState({
    username:"",
    password:""
  })
  const navigate = useNavigate()

  const handleChange = (e) => {
    setUsernameExists(false)
    const {name , value } = e.target
    setInputs(values => ({
      ...values, [name]:value
    }))
  }

  const handleSubmit = async () => {

    if(inputs.username == ""){
      setToggleUsername(true)
      if(inputs.password != ""){
        setTogglePassword(false)
      }
    }
    
    else if(inputs.password == ""){
      setTogglePassword(true)
      if(inputs.username != ""){
        setToggleUsername(false)
      }
    }

    else {
      setToggleUsername(false)
      setTogglePassword(false)
      const data = {
        username: inputs.username,
        password: inputs.password
      }

      try{
        const res = await axios.post("http://localhost:5000/api/users/register", data)
        console.log(res.data)

        if(res.data == "Username already exists"){
          setUsernameExists(true)
        }

        else{
          toast('Registration Successfull!', {
            position: "bottom-center",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            });

            navigate("/login")
  
            // setTimeout(() => {
            //   navigate("/about")
            // }, 1000)
        }

      }catch(err){
        console.log(err)
      }
    }
  }

  useEffect(() => {
    const handleKey = (e) => {
      const element = document.activeElement.id
      if(e.key == "Enter"){
        if(inputs.username == ""){
          document.getElementById("username").focus();
          console.log("running user")
           if(element == "username" && inputs.username == ""){
            setToggleUsername(true)
          }
        } else if(inputs.username != "" && inputs.password == ""){
          setToggleUsername(false)
          document.getElementById("password").focus()
          console.log("running pass")
          if(element == "password" && inputs.password == ""){
            setTogglePassword(true)
          }
        } else if(inputs.username != "" && inputs.password != ""){
          handleSubmit()
          console.log("running button")
        } 
      }

      else if(e.keyCode == 38){
        document.getElementById("username").focus()
      }

      else if(e.keyCode == 40){
        document.getElementById("password").focus()
      }
    }
    document.addEventListener('keydown', handleKey)

    return () => {
      document.removeEventListener('keydown', handleKey)
    } 
  }, [handleSubmit])

  console.log(inputs)

  return (
    <div className='signup'>
      <img src={logo} className="signupLogo" alt='LOGO'/>
      <div className='sigunpFormContainer'>
        <h1>Join and start chatting</h1>
        <div className='signupInputsContainer'>
          <input id="username" placeholder='USERNAME' name='username' value={inputs.username} onChange={handleChange}/>
          {toggleUsername ? <p className='signupWarning'>Please enter your username</p> : null}
          {usernameExists ? <p className='signupWarning'>Username already exists</p> : null}
          <input id="password" placeholder='PASSWORD' name="password" value={inputs.password} onChange={handleChange}/>
          {togglePassword ? <p className='signupWarning'>Please enter your password</p> : null}
        </div>
        <div className='signupButtonContainer'>
         <button onClick={handleSubmit}>Sign Up</button>
         <ToastContainer toastStyle={{backgroundColor: "#b2ff47"}}/>
         <div className='signupLoginContainer'>
          <p>already have an acoount?</p>
          <a href='/login'>Login</a>
         </div>
        </div>
      </div>
    </div>
  )
}

export default Signup