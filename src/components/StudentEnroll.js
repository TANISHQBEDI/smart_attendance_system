import axios from 'axios'
import React, { useState,useRef,useEffect } from 'react'
// import { Button } from 'react-bootstrap'


export default function StudentEnroll() {

    const [studentData, setStudentData] = useState({
        name: '',
        email: '',
        password: '',
        branch: '',
        year: '',
        images: [],
      });

      const [videoStream, setVideoStream] = useState(null);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    useEffect(() => {
        startCamera();
        return () => {
            stopCamera();
        };
    }, []);

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            setVideoStream(stream);
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (error) {
            console.error('Error accessing camera:', error);
        }
    };

    const stopCamera = () => {
        if (videoStream) {
            videoStream.getTracks().forEach(track => {
                track.stop();
            });
        }
    };

    const captureImage = (e) => {
        e.preventDefault()
        if (canvasRef.current && videoRef.current) {
            const canvas = canvasRef.current;
            const video = videoRef.current;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const imageDataURL = canvas.toDataURL('image/jpeg');
            const imgName=`${studentData.name}`
            setStudentData(prevData => ({
                ...prevData,
                images: [...prevData.images, {name:imgName,dataURL:imageDataURL}],
            }));
            console.log(studentData.images)
        }
    };

    const handleCameraToggle = (e) => {
        e.preventDefault()
        stopCamera();
        startCamera();
    };

    const handleStopCamera = (e) => {
        e.preventDefault()
        stopCamera();
    };
    
      
        const handleSubmit = async (event) => {
            event.preventDefault();
            console.log(studentData.name)
            const apiUrl = 'http://localhost:8080/api/newstudentenroll';
        
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
            alert('Data added successfully');
            } catch (error) {
            console.error('Error making API request:', error);
            alert('Failed to add data');
            }
        };
    
    
  return (
    <div className='formContainer'>
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
            <div className='inputBox'>
                    <video ref={videoRef} autoPlay playsInline />
                    <canvas ref={canvasRef} style={{ display: 'none' }} />
                    <button onClick={captureImage}>Capture Photo</button>
                    <button onClick={handleCameraToggle}>Toggle Camera</button>
                    <button onClick={handleStopCamera}>Stop Camera</button>
                </div>
            <div className='inputBox'>
                <input type='submit' value='Enter Data'></input>
            </div>
        </form>
    </div>
  )
}
