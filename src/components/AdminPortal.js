import React from 'react'
import { Link,useNavigate } from 'react-router-dom';


import "../compCss/AdminPortal.css"

export default function AdminPortal() {
  return (
    <div className='adminportalContainer'>
        <Link to='/newstudentenroll'><button>Enroll New Student</button></Link>
        <Link to='/attendance'><button>Take Attendance</button></Link>
    </div>
  )
}
