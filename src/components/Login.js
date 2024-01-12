import React, { useState } from 'react'
import axios from 'axios';

import { FaRegUser,FaUnlock } from "react-icons/fa";

import '../compCss/Login.css'

export default function Login
() {
    window.onload=()=>{
        let label=document.querySelectorAll('label').forEach(label=>{
            label.innerHTML=label.innerText.split('').map((letters,i)=>`<span style="transition-delay:${i*50}ms">${letters}</span>`).join('');
        });
    }

    const [username,setUsername]=useState('');
    const [password,setPassword]=useState('');

    function handleSubmit(event){
        event.preventDefault();

        // console.log(username," ",password)

        axios.post('http://localhost:8080/Login',{username,password})
        .then(res=>console.log(res))
        .catch(err=>console.log(err));
    }
    
  return (
    <div className='loginContainer'>
        <form onSubmit={handleSubmit}>
            <span className='heading'>SIGN IN</span>
            <div className='inputBox'>
                <FaRegUser className='icon' />
                <input type='text' required onChange={e=>setUsername(e.target.value)}></input>
                <label >Username</label>
            </div>
            <div className='inputBox'>
                <FaUnlock className='icon'/>
                <input type='password' required onChange={e=>setPassword(e.target.value)}></input>
                <label>Password</label>
            </div>

            <span className='text'>Don't have an account? <br></br><em>Contact admin</em></span>

            <div className='inputBox'>
                <input type='submit' value='LOGIN'></input>
            </div>
        </form>
        

    </div>
  )
}
