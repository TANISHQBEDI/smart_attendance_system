import React from 'react'
import Dropdown from 'react-bootstrap/Dropdown';
import { Link } from 'react-router-dom';


export default function SubjectDropdown() {


  return (
    <div>
      <Dropdown>
        <Dropdown.Toggle variant="primary" id="dropdown-basic">
          Give Attendance
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item as='div'>
            <Link to="/attendance">
              SDN
            </Link>
          </Dropdown.Item>
          <Dropdown.Item as='div'>
            <Link to="/attendance">
                BI
            </Link>
          </Dropdown.Item>
          <Dropdown.Item as='div'>
            <Link to="/attendance">
              HPC
            </Link>
          </Dropdown.Item>
          <Dropdown.Item as='div'>
            <Link to="/attendance">
              DL
            </Link>
          </Dropdown.Item>
        </Dropdown.Menu>
      
      </Dropdown>
    </div>
    
    
  )
}
