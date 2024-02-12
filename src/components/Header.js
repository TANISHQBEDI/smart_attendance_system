import React from 'react'

import DpesLogo from "../images/dpes-logo-updated.png"

export default function Header() {
  return (
    <div className='headerContainer'>
      <img 
        className='logo' 
        alt='Dpes Logo' 
        src={DpesLogo}
      ></img>
      <div className='logoTxt'>Dhole Patil College Of Engineering</div>
    </div>
  )
}
