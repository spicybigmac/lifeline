"use client"

import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';

function WebcamSample() {
    const [show, set_show] = useState(false);
    const video_element = useRef(null);
    const interval = useRef(null);
    let data;
    
    const videoConstraints = {
        width: 640,
        height: 480,
        facingMode: "user"
    }

    const analyze = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/processImage', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({image: String(video_element.current.getScreenshot())}),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || "Error processing image.");
            }

            data = await response.json();
        } catch (error) {
            console.error("Error during processing:", error);
            alert("Error processing image.");
        }
    }

    const startCam = () => {
        set_show(true);
        interval.current = setInterval(analyze, 1000);
    }

    const stopCam = () => {
      let stream = video_element.current.stream;
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
      set_show(false);

      clearInterval(interval.current);
      interval.current = null
    }

    const toggle = () => {
      if(show){
        stopCam();
      } else {
        startCam();
      }
    }

    return (
        <div>
            <div className="camView">
                {show &&
                    <Webcam 
                        audio={false} 
                        ref={video_element} 
                        videoConstraints={videoConstraints} 
                        screenshotFormat="image/jpeg" 
                    />
                }
            </div>
            <button onClick={toggle}>{show ? "Stop" : "Start"}</button>
        </div>
    );
};

export default WebcamSample;