import React, { useEffect, useState } from 'react'
import axios from 'axios';

import { useNavigate } from 'react-router-dom';

import { FaRegUser,FaUnlock } from "react-icons/fa";

import { useDispatch } from 'react-redux';
import { loginSuccess } from '../session/actions';

import '../compCss/Login.css'

export default function Login
() {
    // const animateLabels = () => {
    //     document.querySelectorAll('label').forEach((label, i) => {
    //         label.innerHTML = label.innerText
    //             .split('')
    //             .map((letters, i) => `<span style="transition-delay:${i * 50}ms">${letters}</span>`)
    //             .join('');
    //     });
    // };

    // useEffect(()=>{
    //     animateLabels();
    // },[])
    
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [username,setUsername]=useState('');
    const [password,setPassword]=useState('');

    const handleSubmit=async (event)=>{
        event.preventDefault();

        // console.log(username," ",password)
        // const apiUrl='http://localhost:8080/api/login'    
        const apiUrl='https://decd-103-124-140-173.ngrok-free.app/api/login'    // PORT 8080


        try {
            const response = await axios.post(apiUrl, {
              username,
              password,
            });
      
            if (response.data.status === 'success') {
              
              dispatch(loginSuccess(response.data.user));
              navigate('/adminportal');
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
                <input 
                  type='text' 
                  required 
                  onChange={e=>setUsername(e.target.value)} 
                  placeholder='USERNAME'
                  onFocus={(e)=>e.target.previousElementSibling.classList.add('focused')}
                  onBlur={(e)=>e.target.previousElementSibling.classList.remove('focused')}
                >

                </input>
                {/* <label >Username</label> */}
            </div>
            <div className='inputBox'>
                <FaUnlock className='icon'/>
                <input 
                  type='password' 
                  required 
                  onChange={e=>setPassword(e.target.value)} 
                  placeholder='PASSWORD'
                  onFocus={(e)=>e.target.previousElementSibling.classList.add('focused')}
                  onBlur={(e)=>e.target.previousElementSibling.classList.remove('focused')}
                >

                </input>
                {/* <label>Password</label> */}
            </div>

            <div className='inputBox'>
                <input type='submit' value='LOGIN'></input>
            </div>
        </form>
        

    </div>
  )
}
