import React, { useEffect, useRef } from 'react';
import io from 'socket.io-client';

const VideoStream = () => {
  const videoRef = useRef();

  useEffect(() => {
    const socket = io('http://localhost:5000'); // Connect to Flask server

    socket.on('frame', (frameData) => {
      const frame = new Image();
      frame.onload = () => {
        videoRef.current.srcObject = frame;
      };
      frame.src = `data:image/jpeg;base64,${frameData}`;
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return <video ref={videoRef} autoPlay playsInline />;
};

export default VideoStream;
