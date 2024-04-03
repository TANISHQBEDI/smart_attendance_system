import React, { useState, useRef } from 'react';

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

  const sendImageData = (imageData) => {
    // Send image data to backend along with selected subject
    // fetch('http://localhost:5000/attendance/' + selectedSubject, {
    fetch('https://f0de-144-48-178-201.ngrok-free.app/attendance/' + selectedSubject, {
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
      window.location.reload();
      // Handle response from backend as needed
    })
    .catch((error) => {
      console.error('Error sending image data:', error);
    })
  };

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
      <video ref={videoRef} width="320" height="240" autoPlay muted />
    </div>
  );
};

export default StudentDropdown;
