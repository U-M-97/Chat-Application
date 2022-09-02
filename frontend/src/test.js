import React from 'react'
import {useState, useEffect, useRef} from "react";
import {io} from 'socket.io-client';
import { useSelector } from 'react-redux';

const Test = () => {

  
 
  return (
    <div>
        <p>Messages</p>
        <li>a</li>
        <li>b</li>
        <button>Send Chat</button>
    </div>
  )
}

export default Test