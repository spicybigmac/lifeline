"use client"

import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';

function WebcamSample() {
    const [show, set_show] = useState(false);
    const video_element = useRef(null);
    const [source, set_source] = useState(null);
    const interval = useRef(null);
    
    const videoConstraints = {
        width: 640,
        height: 480,
        facingMode: "user"
    }

    const startCam = () => {
        set_show(true);
        interval.current = setInterval(() => {
          console.log(interval.current);
        }, 1000);
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

    const capture = React.useCallback(
        () => {
            if(video_element !== null){
              const src = video_element.current.getScreenshot();
              set_source(src);
            }
        },
        [video_element]
    );

    const analyze = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/processImage', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({image: String(source)}),
            });

            // if the backend returns an error
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'The link could not be processed.');
            }

            const data = await response.json();
            console.log(data);
        } catch (error) {
            console.error("Error during processing:", error);
            alert("Sorry, there was an error processing your image. Please try again.");
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

            {source && <img src={source} alt="webcam" />}
        </div>
    );
};

export default WebcamSample;