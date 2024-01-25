import React from 'react'
import Dropdown from 'react-bootstrap/Dropdown';
import axios from 'axios';


export default function SubjectDropdown() {

  const handleItemClick = async (subject) => {
    try {
        await axios.post('https://45c2-2402-3a80-ca0-a65c-aca6-b11d-d84c-b2ec.ngrok-free.app/api/giveattendance');
        console.log(`Python script for ${subject} executed successfully`);
    } catch (error) {
        console.error(`Error executing Python script: ${error.message}`);
    }
  };

  return (
    <Dropdown>
      <Dropdown.Toggle variant="primary" id="dropdown-basic">
        Give Attendance
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.Item onClick={() => handleItemClick('SDN')}>SDN</Dropdown.Item>
        <Dropdown.Item onClick={() => handleItemClick('BI')}>BI</Dropdown.Item>
        <Dropdown.Item onClick={() => handleItemClick('HPC')}>HPC</Dropdown.Item>
        <Dropdown.Item onClick={() => handleItemClick('DL')}>DL</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  )
}
