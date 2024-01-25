import React,{useRef} from 'react'
import Dropdown from 'react-bootstrap/Dropdown';
import axios from 'axios';


export default function SubjectDropdown() {
  const videoRef = useRef(null);

   const detectFaces = () => {
      const video = videoRef.current;
      // Your face detection logic here
   };

   const startCamera = async () => {
      const video = videoRef.current;
      // Your camera setup logic here
      video.srcObject = await navigator.mediaDevices.getUserMedia({ video: true });
      video.addEventListener('loadeddata', () => {
         detectFaces();
      });
   };

  return (
    <div>
      <Dropdown>
        <Dropdown.Toggle variant="primary" id="dropdown-basic">
          Give Attendance
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item onClick={() => startCamera('SDN')}>SDN</Dropdown.Item>
          <Dropdown.Item onClick={() => startCamera('BI')}>BI</Dropdown.Item>
          <Dropdown.Item onClick={() => startCamera('HPC')}>HPC</Dropdown.Item>
          <Dropdown.Item onClick={() => startCamera('DL')}>DL</Dropdown.Item>
        </Dropdown.Menu>
      
      </Dropdown>
      <video ref={videoRef} style={{ display: 'none' }} />
    </div>
    
    
  )
}
