"use client"

import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';

function WebcamSample() {
    const [show, set_show] = useState(false);
    const video_element = useRef(null);
    const interval = useRef(null);
    const [data, set_data] = useState(null);
    let counter = 0;
    const threshold = 10;
    
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

            const dat = await response.json();
            set_data(dat);

            var has_fallen = false;
            dat[1].forEach((result) => {
                has_fallen ||= (result[5] == 0);
            })

            if(has_fallen){
                ++counter;
            } else {
                counter = 0;
            }
            
            if(counter == threshold){
                await fetch('http://127.0.0.1:8000/emergencyCall', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: "",
                });

                stopCam();
            }
            
        } catch (error) {
            console.error("Error during processing:", error);
            alert("Error during processing.");
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

      set_data(null);
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

            <div className="analyzed">
                <img src={data ? `data:image/jpeg;base64,${data[0]}` : undefined} />
            </div>
        </div>
    );
};

export default WebcamSample;