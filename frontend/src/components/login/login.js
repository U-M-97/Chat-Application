import React from 'react'
import logo from "../../images/logo.jpg"
import { useState, useEffect } from 'react'
import axios from "axios"
import { useNavigate } from "react-router-dom";
import "./login.css"
import { useDispatch } from "react-redux"
import { loginSuccess } from '../../redux/userSlice';

const Login = () => {

    const [toggleUsername, setToggleUsername] = useState(false)
    const [togglePassword, setTogglePassword] = useState(false)
    const [usernameExists, setUsernameExists] = useState(false)
    const [invalidCredentials, setInvalidCredentials] = useState(false)
    const [inputs, setInputs ] = useState({
        username:"",
        password:""
    })
    const navigate = useNavigate()
    const dispatch = useDispatch()

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
                setInvalidCredentials(false)
            }
        }
        
        else if(inputs.password == ""){
            setTogglePassword(true)
            setInvalidCredentials(false)
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
                const res = await axios.post("http://localhost:5000/api/users/login", data)
                console.log(res.data)

                if(res.data == "User not exists"){
                setUsernameExists(true)
                } else if(res.data == "Invalid Credentials"){
                    setInvalidCredentials(true)
                }

                else{
                    setInvalidCredentials(false)
                    dispatch(loginSuccess(res.data)) 
                    navigate("/home")
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
        <div className='login'>
            <img src={logo} className="loginLogo" alt='LOGO'/>
            <div className='loginFormContainer'>
            <h1>LOGIN</h1>
            <div className='loginInputsContainer'>
                <input id="username" placeholder='USERNAME' name='username' value={inputs.username} onChange={handleChange}/>
                {toggleUsername ? <p className='loginWarning'>Please enter your username</p> : null}
                {usernameExists ? <p className='loginWarning'>Username not Exists</p> : null}
                <input id="password" placeholder='PASSWORD' name="password" value={inputs.password} onChange={handleChange}/>
                {togglePassword ? <p className='loginWarning'>Please enter your password</p> : null}
                {invalidCredentials ? <p className='loginWarning'>Invalid Credentials</p> : null}
            </div>
            <div className='loginButtonContainer'>
            <button onClick={handleSubmit}>Login</button>
            <div className='loginSignupContainer'>
            <p>Create an Account!</p>
            <a href='/'>Sign Up</a>
            </div>
            </div>
            </div>
    </div>
    )
}

export default Login