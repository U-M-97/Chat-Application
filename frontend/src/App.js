import React from 'react'
import Signup from './components/signup/signup'
import Login from './components/login/login'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './components/home/home'
import Profile from "./components/profile/profile"

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Signup/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/home' element={<Home/>}/>
          <Route path='/profile' element={<Profile/>}/>
        </Routes>
      </BrowserRouter>
     
    </div>
  )
}

export default App