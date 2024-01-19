import React from 'react'
import Dropdown from 'react-bootstrap/Dropdown';
import axios from 'axios';


export default function SubjectDropdown() {

  const handleItemClick = async (subject) => {
    try {
        await axios.post('http://localhost:8080/api/giveattendance');
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
