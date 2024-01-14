import React,{useState} from 'react'
import '../compCss/Home.css'
import Login from './Login';

import { Link } from 'react-router-dom';



export default function Home() {
  
  return (
    <div className='homeContainer'>
        <Link to="/login">{console.log("Link")}<button className='newEnrollBtn'>New Entrollment</button></Link>
    </div>
  )
}
