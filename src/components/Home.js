import React from 'react'
import '../compCss/Home.css'

import { Link } from 'react-router-dom';
import SubjectDropdown from './SubjectDropdown';



export default function Home() {
  
  return (
    <div className='homeContainer'>
        <Link to="/login"><button className='newEnrollBtn'>Admin Login</button></Link>

        {/* <SubjectDropdown/> */}
        
        
    </div>
  )
}
