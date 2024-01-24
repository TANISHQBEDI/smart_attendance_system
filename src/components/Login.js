import React, { useEffect, useState } from 'react'
import axios from 'axios';

import { useNavigate } from 'react-router-dom';

import { FaRegUser,FaUnlock } from "react-icons/fa";

import '../compCss/Login.css'

export default function Login
() {
    const animateLabels = () => {
        document.querySelectorAll('label').forEach((label, i) => {
            label.innerHTML = label.innerText
                .split('')
                .map((letters, i) => `<span style="transition-delay:${i * 50}ms">${letters}</span>`)
                .join('');
        });
    };

    useEffect(()=>{
        animateLabels();
    },[])
    
    const navigate = useNavigate();

    const [username,setUsername]=useState('');
    const [password,setPassword]=useState('');

    const handleSubmit=async (event)=>{
        event.preventDefault();

        // console.log(username," ",password)
        const apiUrl=' https://c0af-144-48-178-201.ngrok-free.app/api/login'


        try {
            const response = await axios.post(apiUrl, {
              username,
              password,
            });
      
            if (response.data.status === 'success') {
              navigate('/newstudentenroll');
            } else {
              alert(response.data.message);
            }
          } catch (error) {
            console.error('Error during login :', error);
            alert('An error occurred during login.');
          }
    }
    
  return (
    <div className='formContainer'>
        <form onSubmit={handleSubmit}>
            <span className='heading'>ADMIN LOGIN</span>
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

            <div className='inputBox'>
                <input type='submit' value='LOGIN'></input>
            </div>
        </form>
        

    </div>
  )
}
