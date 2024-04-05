import axios from 'axios'
import React, { useState,useRef,useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import Webcam from 'react-webcam';
// import { Button } from 'react-bootstrap'

import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../session/actions'; // Import logout action


export default function StudentEnroll() {
    const isLoggedIn = useSelector(state => state.isLoggedIn);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(()=>{
        if(!isLoggedIn){
            
            navigate('/login');
        }
    }, [isLoggedIn])
    

    const [studentData, setStudentData] = useState({
        name: '',
        email: '',
        password: '',
        branch: '',
        year: '',
        images: [],
      });

    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [facingMode, setFacingMode] = useState('user'); // Initial facing mode
    const webcamRef = useRef(null);

    
    const handleCameraToggle = (e) => {
        e.preventDefault();
        setIsCameraOpen(!isCameraOpen);
        if (!isCameraOpen) {
            setFacingMode('user');
        }
    };

    const handleFacingModeChange = (e) => {
        e.preventDefault();
        setFacingMode(facingMode === 'user' ? 'environment' : 'user');
    };

    const handleCapture = async (e) => {
        e.preventDefault();
        if (webcamRef.current) {
            const imageSrc = webcamRef.current.getScreenshot({ mimeType: 'image/jpeg' });
            setStudentData(prevData => ({
                ...prevData,
                images: [...prevData.images, imageSrc],
            }));
            console.log(studentData.images)
        }
    };
      
    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log(studentData.name)
        // const apiUrl = 'http://localhost:8080/api/newstudentenroll';
        const apiUrl = 'https://a69a-2402-8100-31b7-146e-3446-857f-e8ec-9867.ngrok-free.app/api/newstudentenroll';    // PORT 8080
        try {
            const formData = new FormData();
        
            formData.append('name', studentData.name);
            formData.append('email', studentData.email);
            formData.append('password', studentData.password);
            formData.append('branch', studentData.branch);
            formData.append('year', studentData.year);
            console.log(studentData.images)
            studentData.images.forEach((image, index) => {
                formData.append(`images[${index}]`, JSON.stringify(image));
            });
            const response = await axios.post(apiUrl, formData);
            console.log(response.data);
            if (response.status === 200||response.status === 201) {
                // Call the API endpoint to train the model
                // const trainResponse = await axios.post('http://localhost:5000/api/train-model');
                const trainResponse = await axios.post('https://6231-2402-8100-31b7-146e-3446-857f-e8ec-9867.ngrok-free.app/api/train-model');  //  PORT 5000
                console.log(trainResponse.data);
          
                // Handle successful training or display an error message
                if (trainResponse.status === 200 ) {
                  alert('Data added successfully. Model trained successfully!');
                } else {
                  alert('Data added successfully. Model training failed.');
                }
              } else {
                alert('Failed to add data.');
              }
            alert('Data added successfully');
            navigate('/adminportal')
        } catch (error) {
            console.error('Error making API request:', error);
            alert('Failed to add data');
            }
    };
    
    
  return (
    <div className='formContainer enrollContainer'>
        <form onSubmit={handleSubmit}>
            <div className='inputBox'>
                <input 
                    onChange={e=>setStudentData({...studentData,name:e.target.value})} 
                    type='text' 
                    required 
                    placeholder='Student Name'
                ></input>
            </div>
            <div className='inputBox'>
                <input 
                    onChange={e=>setStudentData({...studentData,email:e.target.value})} 
                    type='email' 
                    required 
                    placeholder='Student Email'
                ></input>
            </div>
            <div className='inputBox'>
                <input 
                    onChange={e=>setStudentData({...studentData,password:e.target.value})}  
                    type='password' 
                    required 
                    placeholder='Student Password'
                ></input>
            </div>
            <div className='inputBox'>
                <input 
                    onChange={e=>setStudentData({...studentData,branch:e.target.value})} 
                    type='text' 
                    required 
                    placeholder='Student Branch'
                ></input>
            </div>
            <div className='inputBox'>
                <input 
                    onChange={e=>setStudentData({...studentData,year:e.target.value})} 
                    type='text' 
                    required 
                    placeholder='Student Year'
                ></input>
            </div>
            {/* <div className='inputBox'>
                <input type='file' 
                  required 
                  accept='image/*'
                  onChange={e=>setSelectedFiles(e.target.files)}
                  multiple
                ></input>
            </div> */}
                {isCameraOpen && (
                    <div className="inputBox enrollInputBox">
                        <Webcam
                            ref={webcamRef}
                            audio={false} // Disable audio if not needed
                            screenshotFormat="image/jpeg" // Capture images as JPEG
                            videoConstraints={{
                                facingMode,
                            }} // Set facing mode dynamically
                            className="mirror enrollCamera"
                        />
                        <button onClick={handleCapture}>Capture Photo</button>
                        <button onClick={handleFacingModeChange}>
                            Switch Camera (Currently: {facingMode})
                        </button>
                        <div>Captured Images: {studentData.images.length}</div>
                    </div>
                )}
                <button onClick={handleCameraToggle}>
                    {isCameraOpen ? 'Close Camera' : 'Open Camera'}
                </button>
                <div className='inputBox'>
                    <input type='submit' value='Enter Data'></input>
                </div>
            
        </form>
    </div>
  )
}
