import React, { useState, useRef,useEffect } from 'react';
import context from 'react-bootstrap/esm/AccordionContext';

const StudentDropdown = () => {
  const [selectedSubject, setSelectedSubject] = useState('');
  const [capturing, setCapturing] = useState(false);
  const videoRef = useRef(null);

  const handleSubjectChange = (event) => {
    setSelectedSubject(event.target.value);
  };

  // const handleCaptureImage = () => {
  //   const videoElement = videoRef.current;

  //   if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
  //     navigator.mediaDevices.getUserMedia({ video: true })
  //       .then((stream) => {
  //         videoElement.srcObject = stream;
  //         videoElement.play();

  //         // Capture image after 3 seconds
  //         setTimeout(() => {
  //           const canvas = document.createElement('canvas');
  //           canvas.width = videoElement.videoWidth;
  //           canvas.height = videoElement.videoHeight;
  //           canvas.getContext('2d').drawImage(videoElement, 0, 0, canvas.width, canvas.height);

  //           const imageData = canvas.toDataURL('image/jpeg');
  //           sendImageData(imageData);
  //         }, 3000);
  //       })
  //       .catch((error) => {
  //         console.error('Error accessing camera:', error);
  //       });
  //   }
  // };

  const handleCaptureImage = () => {
    const videoElement = videoRef.current;
  
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
          // Stop the existing video stream
          if (videoElement.srcObject) {
            const tracks = videoElement.srcObject.getTracks();
            tracks.forEach((track) => {
              track.stop();
            });
          }
  
          // Start the new video stream
          videoElement.srcObject = stream;
          videoElement.play();
  
          // Capture image after 3 seconds
          setTimeout(() => {
            const canvas = document.createElement('canvas');
            canvas.width = videoElement.videoWidth;
            canvas.height = videoElement.videoHeight;
            canvas.getContext('2d').drawImage(videoElement, 0, 0, canvas.width, canvas.height);
            
  
            const imageData = canvas.toDataURL('image/jpeg');
            sendImageData(imageData);
          }, 3000);
        })
        .catch((error) => {
          console.error('Error accessing camera:', error);
        });
    }
  };

  const sendImageData = (imageData,stream) => {
    // Send image data to backend along with selected subject
    // fetch('http://localhost:5000/attendance/' + selectedSubject, {
    fetch('https://6944-144-48-178-203.ngrok-free.app/attendance/' + selectedSubject, {     //  PORT 5000
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ imageData }),
    })
    .then((response) => response.json())
    .then((data) => {
      alert(data.message)
      console.log(data);
      // window.location.reload();
      // if (videoRef.current.srcObject) {
      //   const tracks = videoRef.current.srcObject.getTracks();
      //   tracks.forEach((track) => {
      //     track.stop();
      //   });
      // }
      // // Restart the video stream
      // videoRef.current.srcObject = stream;
      // videoRef.current.play();
      // Handle response from backend as needed
    })
    .catch((error) => {
      console.error('Error sending image data:', error);
    })
  };


  useEffect(() => {
    const videoElement = videoRef.current;

    const stopVideoStream = () => {
      if (videoElement.srcObject) {
        const tracks = videoElement.srcObject.getTracks();
        tracks.forEach((track) => {
          track.stop();
        });
      }
    };

    window.addEventListener('beforeunload', stopVideoStream);

    return () => {
      window.removeEventListener('beforeunload', stopVideoStream);
      stopVideoStream();
    };
  }, []);

  return (
    <div className='recognitionDropdown'>
      <label htmlFor="subject">Select Subject:</label>
      <select id="subject" value={selectedSubject} onChange={handleSubjectChange}>
        <option value="">-- Select Subject --</option>
        <option value="HPC">HPC</option>
        <option value="DL">DL</option>
        {/* Add more subjects as needed */}
      </select>
      <br />
        <button onClick={handleCaptureImage}>Take Attendance</button>
      <br />
      <video ref={videoRef} width="320" height="260" autoPlay muted className="mirror"/>
    </div>
  );
};

export default StudentDropdown;
