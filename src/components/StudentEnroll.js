import React from 'react'

export default function StudentEnroll() {
  return (
    <div className='studentEnrollContainer'>
        <form>
            <div className='inputBox'>
                <input type='text' required placeholder='Username'></input>
                <label >Username</label>
            </div>
        </form>
    </div>
  )
}
