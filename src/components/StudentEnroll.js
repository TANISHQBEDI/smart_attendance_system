import axios from 'axios'
import React, { useState,useRef } from 'react'
// import { Button } from 'react-bootstrap'


export default function StudentEnroll() {

    const [sName,setSName]=useState()
    const [sEmail,setSEmail]=useState()
    const [sPassword,setSPassword]=useState()
    const [sBranch,setSBranch]=useState()
    const [sYear,setSYear]=useState()
    // const [selectedFiles, setSelectedFiles] = useState([]);
    const [capturedImages, setCapturedImages] = useState([]);
    const videoRef = useRef(null);

    const handleCapture = async () => {
        if (videoRef.current) {
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          canvas.width = videoRef.current.videoWidth;
          canvas.height = videoRef.current.videoHeight;
          context.drawImage(videoRef.current, 0, 0);
          const imageDataURL = canvas.toDataURL('image/jpeg');
          const capturedImage = await fetch(imageDataURL);
          const blob = await capturedImage.blob();
          setCapturedImages((prevImages) => [...prevImages, blob]);
        }
      };

    const handleSubmit=async (event)=>{
        event.preventDefault();

        const apiUrl='http://localhost:8080/api/newstudentenroll';


        try{
            const formData =new FormData();
            formData.append('sName',sName)
            formData.append('sEmail',sEmail)
            formData.append('sPassword',sPassword)
            formData.append('sBranch',sBranch)
            formData.append('sYear',sYear)
            // for (let i = 0; i < selectedFiles.length; i++) {
            //     formData.append(`selectedFiles`, selectedFiles[i]);
            // }
            capturedImages.forEach((image, index) => {
                formData.append(`${sName}[${index}]`, image);
              });

            console.log('data : ',formData)
            
            await axios.post(apiUrl, formData)
                .then(response => {
                    console.log(response.data);
                    alert("Data added successfully");
                })
                .catch(error => {
                    console.error('Error making API request:', error);
                    alert("Failed to add data");
                });
        }catch(err){
            console.log('Error during entry :', err);
            alert('An error occurred during entry.');
        }
    }
    
    
  return (
    <div className='formContainer'>
        <form onSubmit={handleSubmit}>
            <div className='inputBox'>
                <input 
                    onChange={e=>setSName(e.target.value)} 
                    type='text' 
                    required 
                    placeholder='Student Name'
                ></input>
            </div>
            <div className='inputBox'>
                <input 
                    onChange={e=>setSEmail(e.target.value)} 
                    type='email' 
                    required 
                    placeholder='Student Email'
                ></input>
            </div>
            <div className='inputBox'>
                <input 
                    onChange={e=>setSPassword(e.target.value)}  
                    type='password' 
                    required 
                    placeholder='Student Password'
                ></input>
            </div>
            <div className='inputBox'>
                <input 
                    onChange={e=>setSBranch(e.target.value)} 
                    type='password' 
                    required 
                    placeholder='Student Branch'
                ></input>
            </div>
            <div className='inputBox'>
                <input 
                    onChange={e=>setSYear(e.target.value)} 
                    type='password' 
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
            <div className="inputBox">
                <video ref={videoRef} autoPlay playsInline muted />
                <button onClick={handleCapture}>Capture Photo</button>
            </div>
            <div className='inputBox'>
                <button > input </button>
            </div>
            <div className='inputBox'>
                <input type='submit' value='Enter Data'></input>
            </div>
        </form>
    </div>
  )
}
